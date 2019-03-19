const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// connect database
const knexConfig = {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : '',
      password : '',
      database : 'smart-mind'
    }
  };
const db = knex(knexConfig);

// init express server
const app = express(),
    PORT = process.env.PORT || 3000;

// middleware: parsing the request body
app.use(bodyParser.json());

// middleware: enable cors (Cross-Origin Resource Sharing)
app.use(cors());

// routes
app.get('/', (req, res) => { res.send('server is working'); });
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db));
app.put('/image', (req, res) => image.handleImage(req, res, db));
app.post('/imageurl', (req, res) => image.handleApiCall(req, res));

// start the server on port
app.listen(PORT, () => {
    console.log('server.js is running on port: '+ PORT);
});