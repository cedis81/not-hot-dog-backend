const handleSignIn = (req, res, db, bcrypt) => {
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
    .catch(err => res.status(400).json('invalid credentials'))
}

module.exports = {
  handleSignIn
}
