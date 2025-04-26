import express, { json } from 'express'
import cors from 'cors'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { v1, v4 } from 'uuid'
import { dirname, join } from 'path';
import session from 'express-session'; // Sessions
const { body, validationResult } = require('express-validator'); // Middleware for validating requests
import argon2 from 'argon2'; // Hashing
import crypto from 'crypto'; // Cryptocurrencies obviously

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const port = 3000

const secret = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: secret, // a secret string used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false // don't create session until something stored
}));

app.use(express.static(join(__dirname, '../dist')));

const read_data = (path) => {
    const raw = fs.readFileSync(path);
    return JSON.parse(raw);
}

const write_data = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}

// Change for production
app.use(cors({
    origin: "http://localhost:5173", 
}))
app.use(express.json());
app.use(express.static("./public"));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    const apiResponse = {success: false, user: null, message: null};
    if (mockUsers[username] && mockUsers[username] === password) {
        req.session.user = { username };
        apiResponse.success = true;
        apiResponse.user = username;
        apiResponse.message = "Login success";
        res.status(200);
    }
    else
    {
        apiResponse.success = false;
        apiResponse.user = null;
        apiResponse.message = "Invalid credentials";
        res.status(401);
    }


    res.json(apiResponse);
});

app.post('/auth/logout', (req, res) => {
    const apiResponse = {success: true};
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json(apiResponse);
    });
});

app.get('/auth/verify', async (req, res) => {
    const apiResponse = {success: false, user: null};
    try {
        if (req.session.user)
        {
            apiResponse.success = true;
            apiResponse.user = req.session.user;
            res.status(200);
        }
        else
        {
            res.status(401);
        }

        res.json(apiResponse);
    } catch (error) {
        console.log(error);
    }
})

// Register account in MySQL db. Don't forget to hash!!!!!
app.post('/auth/register',
    // Middleware to validate input
    [
        body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    async (req, res) => {
        
    }
);

app.post('/id', (req, res) =>{
    var code = req.body.code;
    var clients_json = read_data("./database/clients.json");

    if (code in clients_json)
    {
        return res.json({
            client: clients_json[code]
        });
    }
    else
    {
        res.status(404);
    }
})

app.post('/add', (req, res) =>{
    var code = req.body.code;
    var url = req.body.url;
    var clients_json = read_data("./database/clients.json");

    if (code in clients_json)
    {
        clients_json[code].content_locks.fullBlock.push(url);
        write_data("./database/clients.json", clients_json);
    }
    else
    {
        res.status(404);
    }
})

app.get('/getclients', (req, res) =>{
    var clients_json = read_data("./database/clients.json");

    // write_data("./database/clients.json", clients_entries);

    return res.json({
        clients: clients_json
    });
})

app.post('/restrictions', (req, res) => {
    const code = req.body.code;
    var users = read_data("./database/clients.json");
    
    //Should access database to retrieve restrictions
    if(code in users){
        res.send(users[code].content_locks);
    }
    else
    {
        res.status(404);
    }
});

app.get('*', (req, res) => {
    res.sendFile(join(__dirname, './public/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})