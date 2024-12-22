import express, { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
const router: Router = express.Router();

const { pool } = require('./db');
const jwt = require('jsonwebtoken');

const checkIfExists = async (field: string, value: string) => {
  const query = {
    text: `SELECT * FROM users.users WHERE ${field} = $1;`,
    values: [value],
  };
  const result = await pool.query(query);
  return { exists: result.rowCount > 0, account: result.rows[0] };
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
    if (existsUnderEmail.rowCount > 0) {
      throw new Error('An account is already registered with this email address.',);
    }

    // Check if a use
    console.log('Checking an account is registered with the given username.');
    query = {
      text: 'SELECT * FROM users.users WHERE username = $1;',
      values: [username],
    };
    const existsUnderUsername = await pool.query(query);
    if (existsUnderUsername.rowCount > 0) {
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
  Sign in with an account.
*/
router.post('/signin', async (request: Request, response: Response): Promise<void> => {
  try {
    const { email, password } = request.body;
    const user: { exists: boolean, account: any } = await checkIfExists('email', email);
    if (!user.exists) {
      throw new Error('Invalid email or password.');
    }

    const validPassword: boolean = await bcrypt.compare(
      password,
      user.account.password_hash,
    );

    if (!validPassword) {
      throw new Error('Invalid email or password.');
    }

    // Generate json web token
    const token = jwt.sign({id: user.account.id}, process.env.JWT_SECRET, 
                           {expiresIn: process.env.JWT_EXPIRES_IN});

    // response.cookie('token', token, {
    //   httpOnly: true,
    //   sameSite: 'strict'
    // });

    response.status(200).json({message: 'Sign in successful.', token: token});
  } catch (error) {
    if (error instanceof Error) {
      response
        .status(500)
        .json({ message: error.message || 'Internal server error.' });
    }   
  }
});

export default router;
