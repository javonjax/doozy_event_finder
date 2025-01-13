CREATE TABLE users.pins (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users.users(id) ON DELETE CASCADE,
    event_id VARCHAR(60) NOT NULL,
    event_name VARCHAR NOT NULL,
    event_category VARCHAR NOT NULL,
    img_url VARCHAR NOT NULL,
    ticket_url VARCHAR NOT NULL,
    event_date VARCHAR NOT NULL,
    event_time TIME NOT NULL
);