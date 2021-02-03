const handleRegister = (db, bcrypt) => (req, res) => {
    const { email, password, name } = req.body; //destructering
    if (!email || !password || !name) {
        return res.status(400).json('incorrect formp submission');
    }
    const hash = bcrypt.hashSync(password, 10);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
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
        .catch(err => res.status(400).json('unable to register'))

    //sends the newly added data back
}

export default handleRegister;




