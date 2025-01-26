import express, { Request, Response, Application } from "express";
import cors from "cors";
import dataRoutes from "./Data/dataRoutes";
import accountRoutes from "./Accounts/accountRoutes";
import dotenv from "dotenv";
import { connectDB, pool } from "./Accounts/db";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { CipherKey } from "crypto";
dotenv.config();

declare module "express-session" {
  interface SessionData {
    userId?: number;
    email?: string;
  }
}

// Environment variables.
const SECRET_KEY: CipherKey = process.env.COOKIE_SECRET as CipherKey;
const NODE_ENV: string = process.env.NODE_ENV as string;

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3000");
const PgStore = connectPgSimple(session);

// Middleware
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://doozy-hmbn.onrender.com"],
  }),
);
app.use(express.json());
app.use(
  session({
    store: new PgStore({
      pool,
      createTableIfMissing: true,
    }),
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000 * 24,
      secure: false,
    },
  }),
);

// Routes
app.use("/api", dataRoutes);
app.use("/api", accountRoutes);

// Start Server and connect to DB
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});
