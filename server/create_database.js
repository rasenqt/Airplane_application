const sqlite3 = require('sqlite3').verbose();

// Create a new database connection
const db = new sqlite3.Database('plane.sqlite');

// SQL statement to create a table

const createTableairplanes = `

  CREATE TABLE IF NOT EXISTS airplanes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
    
  )
`;




//Execute the SQL statement to create the table
db.run(createTableairplanes, (error) => {
  if (error) {
    console.error('Error creating table:', error.message);
  } else {
    console.log('Table created successfully');
  }
});




const createTableSeats = `
  CREATE TABLE seats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    seatCode TEXT NOT NULL,
    airplanename TEXT NOT NULL,
    userid INTEGER  DEFAULT -1
  )
`;

// Execute the SQL statement to create the table
db.run(createTableSeats, (error) => {
  if (error) {
    console.error('Error creating table:', error.message);
  } else {
    console.log('Table created successfully');
  }
});



const createTableUsers = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    salt TEXT NOT NULL,
    password TEXT NOT NULL
  )
`;

// Execute the SQL statement to create the table
db.run(createTableUsers, (error) => {
  if (error) {
    console.error('Error creating table:', error.message);
  } else {
    console.log('Table created successfully');
  }
});


// Close the database connection
db.close(); 