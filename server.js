import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';


const app = express();
const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'wannes',
        password : '',
        database : 'facerecognition'
    }
});

db.select('*').from('users').then(data => {
    console.log(data);
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('succes');
})

app.put('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).res.json('unable to get user'))
        } else {
            return res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.put('/register', (req, res) => {
    const { email, password, name } = req.body; //destructering
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
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where({id})
        .then(user => {
            if(user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('not found');
            }
        })
        .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})