CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name VARCHAR(25) NOT NULL,
  last_name VARCHAR(25) NOT NULL,
  email VARCHAR(50) NOT NULL CHECK 
    (position('@' IN email) > 1),
  phone VARCHAR(15) NOT NULL
);

CREATE TABLE hosts (
  host_username VARCHAR(25) PRIMARY KEY
);

CREATE TABLE guests (
  guest_username VARCHAR(25) PRIMARY KEY
);

CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  host_username VARCHAR(25) NOT NULL
    REFERENCES users,
  title TEXT NOT NULL,
  description VARCHAR(400) NOT NULL,
  price VARCHAR(10) NOT NULL
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL
    REFERENCES listings,  
  guest_username VARCHAR(25) NOT NULL 
    REFERENCES guests,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  body VARCHAR(200) NOT NULL,
  from_username VARCHAR(25) NOT NULL 
    REFERENCES users,
  to_username VARCHAR(25) NOT NULL
    REFERENCES users,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE
);
