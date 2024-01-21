const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const bcrypt = require('bcrypt');
const db = require('../database/connection.js');

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth } = req.body;
    // const image_data = req.files.image_data; // Assuming you use a middleware for file uploads

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.status(400).send('Email already registered');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO `vukids`.`student` (`firstName`,`lastName`,`email`,`password`,`phone`,`dateOfBirth`,`createdAt`,`image_data`) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, "hi");';
    const values = [firstName, lastName, email, hashedPassword, phone, dateOfBirth];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error executing the query:', err);
        res.status(500).send({ message: 'Error registering user', error: err.message });
        return;
      }

      console.log(results);
      res.status(201).send('Registered successfully!');
    });
  } catch (err) {
    res.status(500).send({ message: 'Error registering user', error: err.message });
  }
});

// login api => POST method
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      res.status(400).send('Wrong email or password!');
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      res.status(200).send('Logged in successfully!');
    } else {
      res.status(400).send('Wrong email or password!');
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// users api => GET method
app.get('/student', (req, res) => {
  const query = 'SELECT * FROM student';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing the query:', err);
      res.status(500).send('Error fetching students');
      return;
    }
    res.status(200).json(results);
  });
});

// student api => GET method
app.get('/student/:id', (req, res) => {
  const studentId = req.params.id;
  console.log('Requested studentId:', studentId);

  const query = 'SELECT * FROM student WHERE id = ?';
  
  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error executing the query:', err);
      res.status(500).send('Error fetching student');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Student not found');
    } else {
      const student = results[0];
      res.status(200).json(student);
    }
  });
});

// root endpoint
app.get('/', (req, res) => {
  res.send('Hello, this is the root endpoint!');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("VuKids Api Console \n" + "/register \n" + "/login \n" + "/student \n" + "/student/ (specifc student)");
});


function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM vukids.student WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error executing the query:', err);
        reject(err);
      } else {
        const user = results[0];
        resolve(user);
      }
    });
  });
}