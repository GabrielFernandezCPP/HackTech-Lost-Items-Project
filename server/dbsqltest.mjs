import { createClient } from '@supabase/supabase-js';
import { configDotenv } from 'dotenv';
import argon2 from 'argon2'; // Hashing

configDotenv();

const db_url = process.env.DATABASE_URL;
const db_key = process.env.DB_ANON_KEY;

export async function db_AddUser(email, raw_password) {
    try {
        // 1. Hash the password
        const hashed_password = await argon2.hash(raw_password);

        // 2. Insert into Supabase
        const { data, error } = await supabase
            .from('Users')
            .insert([
                { email: email, password: hashed_password }
            ]);

        if (error) {
            console.error('Error inserting user:', error.message);
            return null;
        }
        return data[0].email;
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return null;
    }
}

export async function db_FindUserByID(id) {
    try {
        const { data, error } = await supabase
            .from("Users")
            .select("*")
            .eq("id", id);
        
        return data;
    } catch (err) {
        console.error("UNEXPECTED ERROR!: ", err.message);
        return null;
    }
}

export async function db_GetPasswordHash(email) {
    try {
        const { data, error } = await supabase
            .from("Users")
            .select("password")
            .eq("email", email);
        
        return data[0].password;
    } catch (err) {
        console.error("UNEXPECTED ERROR!: ", err.message);
        return null;
    }
}

export async function db_ValidatePassword(email, password) {
    try {
        const passwordHash = await db_GetPasswordHash(email);
        console.log(passwordHash, password);
        if (await argon2.verify(passwordHash, password))
        {
            return true;
        }
        return false;
    } catch (err) {
        console.error("UNEXPECTED ERROR!: ", err.message);
        return null;
    }
} 

export function db_CreateDB(con) {
    con.query("CREATE DATABASE " + con.database, function (err, result) {
        if (err) throw err;
        console.log("Created database.");
    });
    con.query("CREATE TABLE people (name VARCHAR(255), id INT, pass VARCHAR(255))");

    return con;
}

export const supabase = createClient(db_url, db_key);