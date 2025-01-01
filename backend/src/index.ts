import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dataRoutes from './Data/dataRoutes';
import accountRoutes from './Accounts/accountRoutes';
import dotenv from 'dotenv';
import { connectDB } from './Accounts/db';
import session from 'express-session';
dotenv.config();


declare module 'express-session' {
  interface SessionData {
    userId?: number;
    email?: string;
  }
};

const app: Application = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret:'secretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 300000, secure: false }
}));

// Routes
app.use('/api', dataRoutes);
app.use('/api', accountRoutes);

// Start Server and connect to DB
app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running at http://localhost:${port}`);
});
