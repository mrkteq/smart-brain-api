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

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { 
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
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
                        email: loginEmail[0].email,
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
        .catch(err => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id}).then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('Not found');
        }
    })
    .catch(err => res.status(400).json('error getting user'));
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
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