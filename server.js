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

const database = {
    users: [
        {
            id: '1',
            name: 'John',
            email: 'john@mail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '2',
            name: 'Sally',
            email: 'sally@mail.com',
            password: 'candies',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@mail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.put('/signin', (req, res) => {
    const { email, password } = req.body;
        if(email === database.users[0].email && 
            password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json('error logging in');
        }

})

app.post('/register', (req, res) => {
    const { email, password, name } = req.body; //destructering
    //const hash = bcrypt.hashSync(password, 10);

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

    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found === true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if(!found) {
        res.status(400).json('not found');
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})