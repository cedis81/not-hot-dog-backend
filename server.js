const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const getProfile = require('./controllers/getProfile');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'cedrichom',
    password : '',
    database : 'hotdog'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json(database.users)
});

app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)});

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {getProfile.handleGetProfile(req, res, db)});

app.put('/image', (req,res) => {image.handleImage(req, res, db)});

app.listen(3000, ()=> {
  console.log('app is running on port 3000')
});
