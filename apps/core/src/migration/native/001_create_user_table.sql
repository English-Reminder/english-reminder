CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  slack_id VARCHAR(50) NOT NULL,
  credential_id SERIAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cambridge_credential (
    id SERIAL PRIMARY KEY,
    user_id SERIAL NOT NULL,
    username VARCHAR(256) NOT NULL,
    password VARCHAR(256) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
