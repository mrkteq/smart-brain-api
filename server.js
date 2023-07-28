const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image  = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : 'postgres://smart_brain_xy64_user:quC1BbE7iNfwpEVKEuZsbWBr7VOfuEOE@dpg-cj0g8gs07spl5op4us50-a.frankfurt-postgres.render.com/smart_brain_xy64',
      port : 5432,
      user : 'smart_brain_xy64_user',
      password : 'quC1BbE7iNfwpEVKEuZsbWBr7VOfuEOE',
      database : 'smart_brain_xy64'
    }
  });

const app = express(); 

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send(db.users) });
// app.get('/', (req, res) => { res.send('this is working') });
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt) });
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => {image.handleImage(req, res, db) });

app.listen(process.env.PORT || 3000, () => {
    console.log('smart brain app listening on port ${process.env.PORT}!');
});

/*
    1. npm init
    2. npm install express
    3. npm install nodemon
    4. touch server.js
    5. import express 
    6. create an instance of express and save it to a variable called app
    7. create a route handler that will send a response to the browser
    8. tell the app to listen on port 3000 and console.log a message to confirm that it is running
    9. npm start
    10. http://localhost:3000/ in browser to see the response
*/


/*
    1. create a variable called database and set it equal to an object with users because we don't have a database yet
    2. in postman, create a POST request to http://localhost:3000/signin and mock up a user object with an email and password
    3. in the server.js file, create a conditional that checks if the email and password match the user object in the database
*/