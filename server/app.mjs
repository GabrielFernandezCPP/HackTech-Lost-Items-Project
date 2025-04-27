import express, { json } from 'express'
import cors from 'cors'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { v1, v4 } from 'uuid'
import { dirname, join } from 'path';
import session from 'express-session'; // Sessions
import { body, validationResult } from 'express-validator'; // Middleware for validating requests
import crypto from 'crypto'; // Cryptocurrencies obviously
import * as head from './dbsqltest.mjs';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import nocache from 'nocache';


const NEUTRAL = 0;
const LOST = 1;
const FOUND = 2;

dotenv.config();
const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD; 
//import { db_FindPersonByID } from '../src/db/dbheader.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;
const secret = crypto.randomBytes(32).toString('hex');

const read_data = (path) => {
    const raw = fs.readFileSync(path);
    return JSON.parse(raw);
}

const write_data = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}

app.use(session({
    secret: secret, // a secret string used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {
        httpOnly: true,    // Cannot be accessed by JS in browser
        secure: false,     // Set to true if using HTTPS!
        maxAge: 24 * 60 * 60 * 1000 // 1 day session
    }
}));

// Change for production
app.use(cors({
    origin: ['https://lost-and-found-h4rt.onrender.com:5173', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
    credentials: true
}))
app.use(express.json());
app.use(express.static("./public"));

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (await head.db_ValidatePassword(email, password)) {
        req.session.user = { email };
        res.json({ email: email });
        res.status(200);
        return;
    }
    else
    {
        res.sendStatus(401);
        return;
    }
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.sendStatus(200);
        return;
    });
});

app.get('/auth/check', nocache(), async (req, res) => {
    try {
        if (req.session.user)
        {
            const email = req.session.user;
            res.status(200);
            res.json({ email: email });
            return;
        }
        else
        {
            res.status(401);
            res.json({ email: null });
            return;
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
    res.json(apiResponse);
})

// Register account in MySQL db. Don't forget to hash!!!!!
app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;
    const added_row = await head.db_AddUser(email, password);

    console.log(`Added row: ${added_row}`);
    
    if (added_row != null) {
        let email = added_row.email;
        req.session.user = { email };
        res.json({ email: email });
        res.status(200);
    }
    else res.sendStatus(500);

    return added_row;
});

app.post('/items/add', async (req, res) => {
    const email = req.session.user;
    const title = req.body.title;
    const description = req.body.description;
    const added_row = await head.db_AddItem(email, title, description, 0);

    if (added_row != null) {
        let name = added_row.item_name;
        let description = added_row.item_description;
        res.json({ name: name, description: description });
        res.status(200);
        return;
    }
    else res.sendStatus(500);

    // Respond
}
);

app.post('/items/get', async (req, res) => {
    // Validate item name through database
    let items = {};
    if (req.body != null && 'uuid' in req.body)
    {
        items = await head.db_GetItemWithUUID(req.body.uuid);
    }
    else
    {
        const email = req.session.user.email;
        items = await head.db_GetItemsFromUser(email);
    }

    res.status(200).json({ items: items });
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

app.post('/api/contact-owner', async (req, res) => {
    const { ownerEmail, itemName, finderMessage } = req.body;
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUsername,
        pass: emailPassword
      }
    });
  
    const mailOptions = {
      from: emailUsername,
      to: ownerEmail,
      subject: `Someone found your item: ${itemName}!`,
      text: `They left you this message:\n${finderMessage}`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Email failed to send' });
    }

});

app.use((req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// await head.db_GetItemsFromUser("john@email");//
//head.db_AddItem("john@email", "Beach Ball", "A beach ball.", NEUTRAL);
//head.db_RemoveItem("john@email", 36);
//console.log(await head.db_CheckIfItemOwnerExistsAndDeleteIfNot("johndoe@rand.otcom"));