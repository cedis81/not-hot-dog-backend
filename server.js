const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');

const register = require('./controllers/register');

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
})

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(user => {
      return bcrypt.compare(req.body.password, user[0].hash);
    })
    .then(user => {
      if (user) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user=> {
            res.json(user)
          })
          .catch(err=> res.status(400).json('error fetching user'))
      } else {
        res.status(400).json('invalid credentials')}
    })
    .catch(err => res.status(400).json('failed to sign in'))
})

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db('users')
    .select('*')
    .from('users')
    .where({id})
    .then(user => {
        if(user.length) {
          res.json(user[0])
        } else {
          res.status(400).json('not found')
        }
    })
    .catch(err => res.status(400).json('not found'))
})

app.put('/image' , (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, ()=> {
  console.log('app is running on port 3000')
});
