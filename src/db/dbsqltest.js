var mysql2 = require('mysql2');
var pass = process.env.PASSWORD;
console.log(pass);

var con = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: pass
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});