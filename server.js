const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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


app.listen(3000, ()=> {
  console.log('app is running on port 3000')
});
