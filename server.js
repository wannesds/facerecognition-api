import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';


const app = express();


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

app.put('/register', (req, res) => {
    const { email, password, name } = req.body; //destructering
    //const hash = bcrypt.hashSync(password, 10);

    database.users.push({
        id: database.users.length+1,
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    
 
    res.json(database.users[database.users.length-1]);
    //sends the newly added data back
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