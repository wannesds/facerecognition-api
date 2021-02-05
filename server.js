import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';


import handleRegister from './controllers/register.js';
import handleImage from './controllers/image.js';
import handleProfile from './controllers/profile.js';
import handleSignIn from './controllers/signIn.js';


const app = express();
const db = knex({
    client: 'pg',
    connection: {
        connectionString : 'process.env.DATABASE_URL',
        ssl: {
            rejectUnauthorized: false
          }
    }
});

app.use(express.json());
app.use(cors());

db.select('*').from('users').then(data => {
    console.log(data);
});
app.get('/', (req, res) => { res.send('succes'); })

app.get('/profile/:id', handleProfile(db))
app.put('/signin',  handleSignIn(db, bcrypt))
app.put('/register', handleRegister(db, bcrypt))
app.put('/image', (req, res) => {handleImage.handleEntries(req, res, db)} )
app.put('/imageurl', (req, res) => {handleImage.handleApiCall(req, res)})
// = app.put('/image', (req, res) => { handleEntries(req, res, db) })
// (req, res) gets auto added and called back in file

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})