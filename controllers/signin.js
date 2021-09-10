const handleSignIn = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(user => {
      return bcrypt.compare(password, user[0].hash);
    })
    .then(user => {
      if (user) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user=> {
            res.json(user[0])
          })
          .catch(err=> res.status(400).json('error fetching user'))
      } else {
        res.status(400).json('invalid credentials')}
    })
    .catch(err => res.status(400).json('invalid credentials'))
}

module.exports = {
  handleSignIn
}
