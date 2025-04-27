import mysql2 from 'mysql2';
import env from 'dotenv';

const pass = process.env.PASSWORD;
const iphost = process.env.IP;
const userEnv = process.env.USER;

export function db_Init() {
    var con = mysql2.createConnection({
        host: iphost,
        user: userEnv,
        password: pass,
        database: "lostnfound"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    return con;
}

export function db_CreateDB(con) {
    con.query("CREATE DATABASE " + con.database, function (err, result) {
        if (err) throw err;
        console.log("Created database.");
    });
    con.query("CREATE TABLE people (name VARCHAR(255), id INT, pass VARCHAR(255))");

    return con;
}

export function db_AddPerson(con, name, id, pass) {
    con.query("INSERT INTO people (name, id, password) VALUES ('" + name + "', '" + id + "', '" + pass + "')");

    return con;
}

export function db_FindPersonByID(con, id) {
    return con.query("SELECT * USING id FROM people");
}