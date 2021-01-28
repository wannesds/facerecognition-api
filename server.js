import express from 'express';
import bcrypt from 'bcryptjs';

const app = express();

app.use(express.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@mail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
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

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json('succes');
    } else {
        res.status(400).json('error logging in');
    }
    res.json('signing');
})

app.post('/register', (req, res) => {
    const { email, password, name } = req.body; //destructering

    bcrypt.hash(password, 10,  function(err, hash) {
        console.log(hash);//why not working?? :c
    })
 
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if(!found) {
        res.status(400).json('not found');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
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