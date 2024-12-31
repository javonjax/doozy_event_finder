import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dataRoutes from './Data/dataRoutes';
import accountRoutes from './Accounts/accountRoutes';
import dotenv from 'dotenv';
import { connectDB } from './Accounts/db';
dotenv.config();

const app: Application = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', dataRoutes);
app.use('/api', accountRoutes);

// Start Server and connect to DB
app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running at http://localhost:${port}`);
});
