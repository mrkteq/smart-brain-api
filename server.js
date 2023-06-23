const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
            id: '124',
            name: 'Sally',
            email: 'sally@sally.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@john.com'
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
        res.json('success'); // if the email and password match, we want to send back a success message
    } else {
        res.status(400).json('error logging in'); // if the email and password don't match, we want to send back an error message
    }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body; // we want to destructure the data that the user sends to us
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });
    database.users.push({
        id: '125',
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        entries: 0,
        joined: new Date()
    }) // we want to push this new user object into our database
    res.json(database.users[database.users.length-1]); // we want to return the last user in the database
});

app.get('/profile/:id', (req, res) => { // we want to get the id from the request parameters
    const { id } = req.params; // we want to destructure the id from the request parameters
    let found = false; // we want to create a variable called found and set it equal to false
    database.users.forEach(user => { // we want to loop through the users array
        if (user.id === id) { // if the user id matches the id from the request parameters
            found = true; // we want to set found equal to true
            return res.json(user); // we want to return the user object
        }
    })
    if (!found) { // if found is still false
        res.status(400).json('not found'); // we want to send back a not found message
    }
});

app.post('/image', (req, res) => { // we want to update the user's entries
    const { id } = req.body; // we want to destructure the id from the request body
    let found = false; // we want to create a variable called found and set it equal to false
    database.users.forEach(user => { // we want to loop through the users array
        if (user.id === id) { // if the user id matches the id from the request body
            found = true; // we want to set found equal to true
            user.entries++; // we want to increment the user's entries
            return res.json(user.entries); // we want to return the user's entries
        }
    })
    if (!found) { // if found is still false
        res.status(400).json('not found'); // we want to send back a not found message
    }
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