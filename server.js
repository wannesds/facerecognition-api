import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';

import handleRegister from './controllers/register.js';
import entriesCount from './controllers/entriesCount.js';
import profileId from './controllers/profile.js';
import handleSignIn from './controllers/signIn.js';


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

app.get('/', (req, res) => { res.send('succes'); })

app.get('/profile/:id', (req, res) => { profileId(req, res, db) })
app.put('/signin', (req, res) => { handleSignIn(req, res, db, bcrypt) })
app.put('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })
app.put('/image', (req, res) => { entriesCount(req, res, db) })

app.listen(3000, () => {
    console.log('app is running on port 3000');
})