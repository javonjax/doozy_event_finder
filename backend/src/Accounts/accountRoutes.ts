import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { pool } from "./db";
import { EventCardData, UserAccount } from "../../../schemas/schemas";
import { QueryResult } from "pg";

const router: Router = express.Router();
const checkIfUserExists = async (field: string, value: string) => {
  const query = {
    text: `SELECT * FROM users.users WHERE ${field} = $1;`,
    values: [value],
  };
  const queryRes = await pool.query(query);
  return { account: queryRes.rows[0] };
};

const checkIfPinExists = async (
  userId: string,
  eventId: string,
): Promise<boolean> => {
  const query = {
    text: `SELECT * FROM users.pins WHERE user_id = $1 AND event_id = $2;`,
    values: [userId, eventId],
  };
  const queryRes: QueryResult<any> = await pool.query(query);

  if (queryRes.rowCount) {
    return queryRes.rowCount > 0;
  } else {
    return false;
  }
};

/*
  Register a new account.
*/
router.post(
  "/register",
  async (request: Request, response: Response): Promise<void> => {
    try {
      const { username, email, password } = request.body;

      console.log("Checking that all params are present.");
      if (!username || !password || !email) {
        throw new Error("Missing registration parameters.");
      }

      console.log("Checking an account is registered with the given email.");
      let query = {
        text: "SELECT * FROM users.users WHERE email = $1;",
        values: [email],
      };
      const existsUnderEmail: QueryResult<any> = await pool.query(query);
      if (existsUnderEmail.rowCount && existsUnderEmail.rowCount > 0) {
        throw new Error(
          "An account is already registered with this email address.",
        );
      }

      console.log("Checking an account is registered with the given username.");
      query = {
        text: "SELECT * FROM users.users WHERE username = $1;",
        values: [username],
      };
      const existsUnderUsername: QueryResult<any> = await pool.query(query);
      if (existsUnderUsername.rowCount && existsUnderUsername.rowCount > 0) {
        throw new Error("An account is already registered with this username.");
      }

      // Encrypt password.
      const salt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);

      console.log("Attempting to register account.");
      query = {
        text: `INSERT INTO users.users (username, email, password_hash)
             VALUES ($1, $2, $3);`,
        values: [username, email, hashedPassword],
      };
      const queryRes: QueryResult<any> = await pool.query(query);
      if (queryRes.rowCount === 0) {
        throw new Error("Registration failed. Please try again.");
      }
      response.status(201).json({
        message: "Account created successfully.",
      });
    } catch (error) {
      if (error instanceof Error) {
        response
          .status(500)
          .json({ message: error.message || "Internal server error." });
      }
    }
  },
);

/*
  Login with an account.
*/
router.post(
  "/login",
  async (request: Request, response: Response): Promise<void> => {
    try {
      const { email, password } = request.body;
      if (!email || !password) {
        throw new Error("Missing login parameters.");
      }
      const user: { account: UserAccount | undefined } =
        await checkIfUserExists("email", email);

      if (!user.account) {
        throw new Error("Invalid email or password.");
      }

      const validPassword: boolean = await bcrypt.compare(
        password,
        user.account.password_hash,
      );

      if (!validPassword) {
        throw new Error("Invalid email or password.");
      }

      request.session.userId = user.account.id;
      request.session.email = user.account.email;

      response.status(200).json({ message: "Login successful." });
    } catch (error) {
      if (error instanceof Error) {
        response
          .status(500)
          .json({ message: error.message || "Internal server error." });
      }
    }
  },
);

/*
  Logout of an account.
*/
router.post("/logout", (request: Request, response: Response): void => {
  request.session.destroy((error) => {
    if (error) {
      response.status(500).json({ message: "Could not logout at this time." });
    } else {
      response.status(200).json({ message: "You are now logged out." });
    }
  });
});

/*
  Check for an active session
*/
router.get("/session", (request: Request, response: Response): void => {
  if (request.session.userId) {
    response.status(200).json({ message: "User is authenticated." });
  } else {
    response
      .status(401)
      .json({ message: "Active session not found. Please login." });
  }
});

/*
  Get pinned events.
*/
router.get(
  "/pins",
  async (request: Request, response: Response): Promise<void> => {
    try {
      if (!request.session.userId) {
        response
          .status(401)
          .json({ message: "Must be logged in to get pinned events." });
        return;
      }

      const query = {
        text: "SELECT * FROM users.pins WHERE user_id = $1;",
        values: [request.session.userId],
      };

      const queryRes: QueryResult<any> = await pool.query(query);

      if (queryRes.rowCount && queryRes.rowCount > 0) {
        response.status(200).json({ pinnedEvents: queryRes.rows });
      } else {
        response
          .status(404)
          .json({ message: "No pinned events found for this user." });
      }
    } catch (error) {
      if (error instanceof Error) {
        response
          .status(500)
          .json({ message: error.message || "Internal server error." });
      }
    }
  },
);

/*
  Create a new pinned event.
*/
router.post(
  "/pins",
  async (request: Request, response: Response): Promise<void> => {
    try {
      if (!request.session.userId) {
        response
          .status(401)
          .json({ message: "Must be logged in to pin events." });
        return;
      }

      const {
        id: eventId,
        name,
        images,
        url,
        dates,
        category,
      }: EventCardData & { category: string } = request.body;

      if (!eventId || !name || !images || !url || !dates || !category) {
        throw new Error("Missing parameters. Could not create new pin.");
      }

      console.log("Checking if event is already pinned for this user.");
      const pinExists: boolean = await checkIfPinExists(
        String(request.session.userId),
        eventId,
      );
      if (pinExists) {
        throw new Error("This event is already pinned by this user.");
      }

      console.log("Attempting to add pinned event.");
      const query = {
        text: `INSERT INTO users.pins (user_id, event_id, event_name, img_url, ticket_url, event_date, event_time, event_category)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        values: [
          request.session.userId,
          eventId,
          name,
          images[0].url,
          url,
          dates.start.localDate,
          dates.start.localTime,
          category,
        ],
      };

      const queryRes: QueryResult<any> = await pool.query(query);

      if (queryRes.rowCount && queryRes.rowCount === 0) {
        throw new Error("Failed to pin this event. Please try again later.");
      }

      response.status(201).json({
        message: "Event pinned.",
      });
    } catch (error) {
      if (error instanceof Error) {
        response
          .status(500)
          .json({ message: error.message || "Internal server error." });
      }
    }
  },
);

/*
  Delete a pinned event.
*/
router.delete(
  "/pins/:event_id",
  async (request: Request, response: Response): Promise<void> => {
    try {
      if (!request.session.userId) {
        response
          .status(401)
          .json({ message: "Must be logged in to delete pinned events." });
        return;
      }

      const eventId: string = request.params.event_id;
      const query = {
        text: "DELETE FROM users.pins WHERE user_id = $1 and event_id = $2;",
        values: [request.session.userId, eventId],
      };

      const queryRes: QueryResult<any> = await pool.query(query);

      if (queryRes.rowCount && queryRes.rowCount > 0) {
        response
          .status(200)
          .json({ message: "Pinned event has been deleted." });
      } else {
        response.status(404).json({ message: "That event was not pinned." });
      }
    } catch (error) {
      if (error instanceof Error) {
        response
          .status(500)
          .json({ message: error.message || "Internal server error." });
      }
    }
  },
);

export default router;
