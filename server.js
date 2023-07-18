const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'marktucker',
      password : '',
      database : 'smart-brain'
    }
  });

const app = express(); 

app.use(bodyParser.json()); // this is middleware that will parse the body of the request and convert it to JSON
app.use(cors()); // this is middleware that will allow us to make requests from the frontend to the backend 

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@john.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '122',
            name: 'Ann',
            email: 'ann@ann.com',
            password: 'apples',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '',
            hash: '',
            email: ''
        }
    ]
}

// this is a route handler
app.get('/', (req, res) => { 
    res.send(database.users); // this will send the users array to the browser
});

app.post('/signin', (req, res) => { // whatever the user enters on the frontend is going to come back here in the request and we want to check it with our list of users to make sure they match
    bcrypt.compare("apples", '$2a$10$zg4kPB5e5l4XYCbv/V7c6OSwMIBFbpXsGW3v68GlV7Bdd.dKUoIg2', function(err, res) {
        console.log('first guess', res);
    });
    bcrypt.compare("veggies", '$2a$10$zg4kPB5e5l4XYCbv/V7c6OSwMIBFbpXsGW3v68GlV7Bdd.dKUoIg2', function(err, res) {
        console.log('second guess', res);
    });
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
        // res.json('success'); // if the email and password match, we want to send back a success message
        res.json(database.users[0]); // we want to return the first user in the database
    } else {
        res.status(400).json('error logging in'); // if the email and password don't match, we want to send back an error message
    }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body; // we want to destructure the data that the user sends to us
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });
    db('users')
    .returning('*')
    .insert({
        name: name,
        email: email,
        joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => { // we want to get the id from the request parameters
    const { id } = req.params; // we want to destructure the id from the request parameters
    db.select('*').from('users').where({id}).then(user => {
        if (user.length) { // if the user length is greater than 0
            res.json(user[0]); // we want to return the user
        } else {
            res.status(400).json('Not found'); // if the user length is 0, we want to return a not found message
        }
    })
    .catch(err => res.status(400).json('error getting user'));
});

app.put('/image', (req, res) => { // we want to update the user's entries
    const { id } = req.body; // we want to destructure the id from the request body
    db('users').where('id', '=', id) // we want to update the users table where the id equals the id from the request body
        .increment('entries', 1) // we want to increment the entries by 1
        .returning('entries') // we want to return the entries
        .then(entries => {
            res.json(entries[0].entries); // we want to return the first entry
        })
        .catch(err => res.status(400).json('unable to get entries')
    )
});

app.listen(3000, () => {
    console.log('smart brain app listening on port 3000!');
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