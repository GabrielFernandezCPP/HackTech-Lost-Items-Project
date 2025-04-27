import { createClient } from '@supabase/supabase-js';
import { configDotenv } from 'dotenv';

configDotenv();

const db_url = process.env.DATABASE_URL;
const db_key = process.env.DB_ANON_KEY;

export function db_CreateDB(con) {
    con.query("CREATE DATABASE " + con.database, function (err, result) {
        if (err) throw err;
        console.log("Created database.");
    });
    con.query("CREATE TABLE people (name VARCHAR(255), id INT, pass VARCHAR(255))");

    return con;
}

export const supabase = createClient(db_url, db_key);