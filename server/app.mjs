import express, { json } from 'express'
import cors from 'cors'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { v1, v4 } from 'uuid'
import { dirname, join } from 'path';
import session from 'express-session'; // Sessions
import { body, validationResult } from 'express-validator'; // Middleware for validating requests
import argon2 from 'argon2'; // Hashing
import crypto from 'crypto'; // Cryptocurrencies obviously
import db_connect from './dbsqltest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const port = 3000
const database = db_connect();
const secret = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: secret, // a secret string used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false // don't create session until something stored
}));

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
    const apiResponse = {user: null, message: null};
    if (mockUsers[username] && mockUsers[username] === password) {
        req.session.user = { username };
        apiResponse.user = username;
        apiResponse.message = "Login success";
        res.status(200);
    }
    else
    {
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
        res.sendStatus(200);
    });
});

app.post('/auth/check', async (req, res) => {
    const apiResponse = {success: false, user: null};
    try {
        if (req.session.user)
        {
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(401);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    res.json(apiResponse);
})

// Register account in MySQL db. Don't forget to hash!!!!!
app.post('/auth/register', async (req, res) => {
    res.sendStatus(501);
}
);

app.post('/items/new', async (req, res) => {
    // Validate item name through database

    // Create new item object with uuid-v4
    const item = {
        name: req.body.name, 
        id: v4()
    }

    // Add item to database

    // Respond
}
);

// 
app.post('/items/remove', async (req, res) => {
    if (!req.session.user)
    {
        res.sendStatus(401);
        return;
    }
    
    // Get item id
    const item_id = req.body.id;
    // Query database for item

    // Handle query response. Exists: remove item

    // Respond
}
);

// app.get('*', (req, res) => {
//     res.sendFile(join(__dirname, './public/index.html'));
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})