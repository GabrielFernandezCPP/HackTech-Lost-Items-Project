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
            ])
            .select();

        if (error) {
            console.error('Error inserting user:', error.message);
            return null;
        }
        
        return data;
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
            .eq("email", email)
            .single();
        
        if (data != null)
            return data.password;
        return null;
    } catch (err) {
        console.error("UNEXPECTED ERROR!: ", err.message);
        return null;
    }
}

export async function db_GetItemsFromUser(email) {
    try {
        const ids_query = await supabase
            .from("Users")
            .select("items")
            .eq("email", email)
            .single();
        
        
        
        if (ids_query.data != null)
        {
            
        }

        return null;
    } catch (err) {
        console.error("UNEXPECTED ERROR!: ", err.message);
        return null;
    }
}

export async function db_ValidatePassword(email, password) {
    try {
        const passwordHash = await db_GetPasswordHash(email);
        if (passwordHash == null)
            return false;
        if (await argon2.verify(passwordHash, password))
        {
            return true;
        }
        return false;
    } catch (err) {
        console.error("UNEXPECTED ERROR!: ", err.message);
        return false;
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

export async function db_CheckIfPersonExists(email) {
    try {
        //Check if email exists;
        const { data, error } = await supabase
            .from("Users")
            .select("*")
            .eq("email", email);
        
        var notInDB = (data.length == 0);
    } catch (err) {
        console.error("UNEXPECTED ERROR!: ", err.message);
        return null;
    }
}

export async function db_CheckIfItemOwnerExistsAndDeleteIfNot(email) {
    try {
        //Check to see email is in main db.
        const { data, error } = await supabase
            .from("Users")
            .select("*")
            .eq("email", email);
        
        //If the returned data is none, then the user is not registered. So delete all of their items.
        var notInDB = (data.length == 0);

        if (notInDB)
        {
            const { data, error } = await supabase
                .from("lost_items")
                .delete()
                .eq('owner_email', email)
            
                console.log("Deleted item.");
        }
        
        return notInDB;
    } catch (err) {
        console.error("UNEXPECTED ERROR!: ", err.message);
        return null;
    }
}

export const supabase = createClient(db_url, db_key);