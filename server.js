const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');

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

const database = {
  users: [
    {
      id: '123',
      name: 'john',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 3,
      hotdogs: 4,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'Sally@gmail.com',
      password: 'diu',
      entries: 3,
      hotdogs: 5,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.json(database.users)
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'));
})

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


app.listen(3000, ()=> {
  console.log('app is running on port 3000')
});
