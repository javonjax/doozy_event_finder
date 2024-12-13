import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dataRoutes from './dataRoutes/dataRoutes';
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
    console.log(typeof '')
  res.send('Hello, TypeScript with Express!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
