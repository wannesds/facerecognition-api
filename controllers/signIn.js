const handleSignIn = (db, bcrypt) => (req, res) => {
    const { email, password} = req.body; //destructering
    if (!email || !password) {
        return res.status(400).json('incorrect formp submission');
    }
    db.select('email', 'hash').from('login')
      .where('email', '=', email)
      .then(data => {
          const isValid = bcrypt.compareSync(password, data[0].hash);
          if(isValid) {
              return db.select('*').from('users')
              .where('email', '=', email)
              .then(user => {
                  res.json(user[0])
              })
              .catch(err => res.status(400).res.json('unable to get user'))
          } else {
              return res.status(400).json('wrong credentials')
          }
      })
      .catch(err => res.status(400).json('wrong credentials'))
}

export default handleSignIn;
