import dotenv from 'dotenv';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';


const config: string = process.env.PG_CONFIG as string;
const pool = new Pool(JSON.parse(config));

const createUsersTable = async (): Promise<void> => {
  try {
    const res = await pool.query(`
            SELECT EXISTS (
                SELECT 1 
                FROM information_schema.tables
                WHERE table_schema = 'users' AND table_name = 'users' 
            )    
        `);

    const tableExists = res.rows[0].exists;
    
    if (!tableExists) {
      const schemaFile = path.resolve(__dirname, './db_schema/user.schema.sql');
      const schemaSQL = fs.readFileSync(schemaFile, 'utf-8');
      await pool.query(schemaSQL);
    } else {
      console.log('Table already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

const createFavoritesTable = async (): Promise<void> => {
  try {
    const res = await pool.query(`
      SELECT EXISTS (
          SELECT 1 
          FROM information_schema.tables
          WHERE table_schema = 'users' AND table_name = 'users' 
      )    
  `);
  } catch (error) {
    console.error('Error creating FAVORITES table:', error);
  }
};

const connectDB = async (): Promise<void> => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL.');
    await createUsersTable();
  } catch (error) {
    console.error('Connection error', error);
  }
};

export { pool, connectDB };
