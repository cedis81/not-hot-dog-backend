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

app.get('/', (req, res) => { 'not hot dog backend is working' });

app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)});

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {getProfile.handleGetProfile(req, res, db)});

app.put('/image', (req,res) => {image.handleImage(req, res, db)});

app.post('/imageurl', (req,res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is running on port ${process.env.PORT}` )
});
