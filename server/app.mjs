import express, { json } from 'express'
import cors from 'cors'
import fs from 'fs'
import { v1, v4 } from 'uuid'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();
const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD; 

const app = express()
const port = 3000

const generate_code = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const read_data = (path) => {
    const raw = fs.readFileSync(path);
    return JSON.parse(raw);
}

const write_data = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}

const validate_code = (path, code) => {
    const raw = fs.readFileSync(path);
    const json = JSON.parse(raw);

    for (let entry of json)
    {
        if (entry.code === code)
        {
            return false;
        }
    }
    return true;
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

app.get('/login', (req, res) =>{
    username = req.body[0];
    password = req.body[1];

    if (username == 'test' && password == '1234'){
        res.json({
            "name": "HealthyGamerGG",
            "id": 0
        })
    }else{
        throw new Error("Bad Login");
    }
})

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
})

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
    subject: `Someone found your item: ${itemName}`,
    text: "finder message test, this is what the user inputs"
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Email failed to send' });
  }
});