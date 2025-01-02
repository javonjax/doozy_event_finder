import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from './db';
import { UserAccount } from '../../../schemas/schemas';

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;
const router: Router = express.Router();
const checkIfExists = async (field: string, value: string) => {
  const query = {
    text: `SELECT * FROM users.users WHERE ${field} = $1;`,
    values: [value],
  };
  const result = await pool.query(query);
  return { account: result.rows[0] };
};

/*
  Register a new account.
*/
router.post('/register', async (request: Request, response: Response): Promise<void> => {
  try {
    const { username, email, password } = request.body;

    // Ensure all params are present.
    console.log('Checking that all params are present.');
    if (!username || !password || !email) {
      throw new Error('Missing registration parameters.');
    }

    // Check if a user exists under the given email.
    console.log('Checking an account is registered with the given email.');
    let query = {
      text: 'SELECT * FROM users.users WHERE email = $1;',
      values: [email],
    };
    const existsUnderEmail = await pool.query(query);
    if (existsUnderEmail.rowCount && existsUnderEmail.rowCount > 0) {
      throw new Error('An account is already registered with this email address.',);
    }
    
    // Check if a user exists with the given username.
    console.log('Checking an account is registered with the given username.');
    query = {
      text: 'SELECT * FROM users.users WHERE username = $1;',
      values: [username],
    };
    const existsUnderUsername = await pool.query(query);
    if (existsUnderUsername.rowCount && existsUnderUsername.rowCount > 0) {
      throw new Error('An account is already registered with this username.');
     }

    // Encrypt password.
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    // Attempt to add the new user to the database.
    console.log('Attempting to register account.');
    query = {
      text: `INSERT INTO users.users (username, email, password_hash)
             VALUES ($1, $2, $3);`,
      values: [username, email, hashedPassword],
    };
    const registration = await pool.query(query);
    if (registration.rowCount === 0) {
      throw new Error('Registration failed. Please try again.',);
    }
    response.status(201).json({
      message: 'Account created successfully.',
    });
  } catch (error) {
    if (error instanceof Error) {
        response
        .status(500)
        .json({ message: error.message || 'Internal server error.' });
    }
  }
});

/*
  Login with an account.
*/
router.post('/login', async (request: Request, response: Response): Promise<void> => {
  try {
    const { email, password } = request.body;
    const user: { account: UserAccount | undefined } = await checkIfExists('email', email);
    
    if (!user.account) {
      throw new Error('Invalid email or password.');
    }

    const validPassword: boolean = await bcrypt.compare(
      password,
      user.account.password_hash,
    );

    if (!validPassword) {
      throw new Error('Invalid email or password.');
    }
    console.log(request.session)
    request.session.userId = user.account.id;
    request.session.email = user.account.email;
    console.log(request.session)
    response.status(200).json({message: 'Login successful.'});
  } catch (error) {
    if (error instanceof Error) {
      response
        .status(500)
        .json({ message: error.message || 'Internal server error.' });
    }   
  }
});

/*
  Logout of an account.
*/
router.post('/logout', (request: Request, response: Response): void => {
  request.session.destroy((error) => {
    if (error) {
      return response.status(500).json({ message: 'Could not logout at this time.'});
    } else {
      response.status(200).json({ message: 'You are now logged out.'})
    }
  });
});

/*
  Check for an active session
*/
router.get('/session', (request: Request, response: Response): void => {
  if (request.session.userId) {
    response.status(200).json({ message: 'User is authenticated.'})
  } else {
    response.status(401).json({ message: 'Active session not found. Please login.'})
  }
});

export default router;
