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

app.get('/', (req, res) => {
  res.json(database.users)
})

app.post('/register', async (req, res) => {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10)

  db.transaction(trx => {
    trx.insert({
      hash: hashedPassword,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
      .returning('*')
      .insert({
        email: loginEmail[0],
        name: name,
        joined: new Date()
      })
      .then(user => {
        res.json(user[0]);
      })
    })
    .then(trx.commit)
    .catch(trx.rollback)
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
