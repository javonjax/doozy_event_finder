import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dataRoutes from './Data/dataRoutes';
import accountRoutes from './Accounts/accountRoutes';
import dotenv from 'dotenv';
import { connectDB, pool } from './Accounts/db';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
dotenv.config();


declare module 'express-session' {
  interface SessionData {
    userId?: number;
    email?: string;
  }
};

const app: Application = express();
const port: number = 3000;
const PgStore = connectPgSimple(session);

// Middleware
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use(session({
  store: new PgStore({
    pool,
    createTableIfMissing: true
  }),
  secret:'secretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000, secure: false }
}));

// Routes
app.use('/api', dataRoutes);
app.use('/api', accountRoutes);

// Start Server and connect to DB
app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running at http://localhost:${port}`);
});
