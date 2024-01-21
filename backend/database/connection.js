const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'proprogram251@',
  database: 'VuKids'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
  } else {
    console.log('connection succussed ');
  }
});

module.exports = connection;