CREATE SCHEMA users;

CREATE TABLE users.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(24) UNIQUE NOT NULL,
    email VARCHAR(256) UNIQUE NOT NULL,
    password_hash CHAR(60) NOT NULL
);

