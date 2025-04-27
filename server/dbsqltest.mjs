import mysql2 from 'mysql2';
import { configDotenv } from 'dotenv';

configDotenv();

const pass = process.env.PASSWORD;
const db_location = process.env.DB_LOCATION;

console.log(db_location)
console.log(pass)

const db_connect = () => {
    const con = mysql2.createConnection({
        host: db_location,
        user: "hacktech",
        password: pass
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    return con;
}

export default db_connect;