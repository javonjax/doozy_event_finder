import dotenv from 'dotenv';
import { Pool, QueryResult } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString: string = process.env.PG_RENDER_URL as string;
const dbConfig: string = process.env.PG_CONFIG as string;
const pool: Pool = process.env.NODE_ENV === 'production' ? new Pool({connectionString}) : new Pool(JSON.parse(dbConfig));

const createUsersTable = async (): Promise<void> => {
  try {
    const res: QueryResult<any> = await pool.query(`
      SELECT EXISTS (
          SELECT 1 
          FROM information_schema.tables
          WHERE table_schema = 'users' AND table_name = 'users' 
      )    
    `);

    const tableExists = res.rows[0].exists;

    if (!tableExists) {
      const schemaFile: string = path.resolve(__dirname, '../../db_schema/user.schema.sql');
      const schemaSQL: string = fs.readFileSync(schemaFile, 'utf-8');
      await pool.query(schemaSQL);
    } else {
      console.log('Users table already exists.');
    }
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

const createPinsTable = async (): Promise<void> => {
  try {
    const res: QueryResult<any> = await pool.query(`
      SELECT EXISTS (
          SELECT 1 
          FROM information_schema.tables
          WHERE table_schema = 'users' AND table_name = 'pins' 
      )    
    `);

    const tableExists = res.rows[0].exists;

    if (!tableExists) {
      const schemaFile: string = path.resolve(__dirname, '../../db_schema/pins.schema.sql');
      const schemaSQL: string = fs.readFileSync(schemaFile, 'utf-8');
      await pool.query(schemaSQL);
    } else {
      console.log('Pins table already exists.');
    }
  } catch (error) {
    console.error('Error creating pins table:', error);
  }
};

const connectDB = async (): Promise<void> => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL.');
    await createUsersTable();
    await createPinsTable();
  } catch (error) {
    console.error('Connection error', error);
  }
};

export { pool, connectDB };
