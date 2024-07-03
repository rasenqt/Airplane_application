const sqlite3 = require('sqlite3').verbose();

// Create a new database connection
const db = new sqlite3.Database('plane.sqlite');

// SQL statement to create a table



const deleteTable = `
DROP TABLE IF EXISTS airplanes

`;
db.run(deleteTable, (error) => {
  if (error) {
    console.error('Error deleting table:', error.message);
  } else {
    console.log('Table delete');
  }
});


const deleteContent = `
DROP TABLE IF EXISTS seats

`;
db.run(deleteContent, (error) => {
  if (error) {
    console.error('Error deleting table:', error.message);
  } else {
    console.log('Table delete');
  }
});

const deleteUser = `
DROP TABLE IF EXISTS users

`;
db.run(deleteUser, (error) => {
  if (error) {
    console.error('Error deleting table:', error.message);
  } else {
    console.log('Table delete');
  }
});




// Close the database connection
db.close(); 