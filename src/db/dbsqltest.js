var mysql2 = require('mysql2');
var env = require('dotenv');

var pass = process.env.PASSWORD;

var con = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: pass
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});