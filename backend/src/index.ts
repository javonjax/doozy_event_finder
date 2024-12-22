import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dataRoutes from './Data/dataRoutes';
import accountRoutes from './Accounts/accountRoutes';
import dotenv from 'dotenv';
dotenv.config();

const app: Application = express();
const port = process.env.PORT ;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', dataRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Doozy backend!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
