import { createClient } from '@supabase/supabase-js';
import { configDotenv } from 'dotenv';
import argon2 from 'argon2'; // Hashing

import {v4 as uuidv4} from 'uuid'

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
                { email: email, password: hashed_password, items: [] }
            ])
            .select();

        if (error) {
            console.error('Error inserting user:', error.message);
            return null;
        }
        
        return data;
    } catch (err) {
        console.error('Unexpected error in ADD PERSON:', err.message);
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
        console.log(email)
        const ids_query = await supabase
            .from("Users")
            .select("items")
            .eq("email", email)
            .single();
        
        if (ids_query.data != null)
        {
            var arr = ids_query.data.items;
            console.log(arr);

            var retArr = [];

            for (let i of arr)
            {
                var loop = await supabase
                    .from("lost_items")
                    .select()
                    .eq("id", i)
                    .single();

                retArr.push(loop.data);
            }

            return retArr;
        }

        console.log("User has an invalid item array.");
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

export async function db_AddItem(email, iName, iDesc, status) {
    try {
        if (await db_CheckIfPersonExists() == false)
        {
            console.log(`${email} does not exist in our system.`);
            return false;
        }

        var uuidGen = uuidv4();

        var response = await supabase
            .from("lost_items")
            .insert([{
                uuid: uuidGen, owner_email: email, item_name: iName, item_description: iDesc, status: status
            }])
            .select();
        
        var idCreated = response.data[0].id;
        //console.log(`Created: ${idCreated}`);
        
        response = await supabase
            .from("Users")
            .select("*")
            .eq('email', email);
        
        console.log(response.data);

        let arr = response.data[0].items;
        console.log(arr);
        arr.push(idCreated);

        response = await supabase
            .from("Users")
            .update({ items: arr})
            .eq('email', email);

        
        console.log(`Added: ${iName} to ${email}`);
        return true;
    } catch (err) {
        console.error('Unexpected error in ADD ITEM:', err.message);
        return null;
    }
}

export const supabase = createClient(db_url, db_key);