const handleRegister = async (req, res, db, bcrypt) => {
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
}

module.exports = {
  handleRegister: handleRegister
}
