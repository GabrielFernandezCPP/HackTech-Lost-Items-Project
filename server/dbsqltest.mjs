import { createClient } from '@supabase/supabase-js';
import { configDotenv } from 'dotenv';
import argon2 from 'argon2'; // Hashing

import {v4 as uuidv4} from 'uuid'

configDotenv();

const MAX_ITEMS = 10;

const db_url = "https://gxrljirppmwkbkfgoosk.supabase.co";
const db_key = process.env.DB_ANON_KEY;

export async function db_SetItemState(uuid, state) {
    try {
        var response = await supabase
            .from("lost_items")
            .update({ status: state})
            .eq("uuid", uuid);
    
    console.log(`${uuid}'s state was updated to ${state}.`);
    return true;
    } catch (err) {
        console.error('Unexpected error in SET ITEM STATE:', err.message);
        return null;
    }
}

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
            .select()
            .single();

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

            //Add the default item to the list of items ONLY if there are less than maxitems

            if (arr.length < MAX_ITEMS)
            {
                retArr.push({
                    id: -1,
                    uuid: 0,
                    owner_email: email,
                    item_name: "Add Item",
                    item_description: "Add a new item to find.",
                    status : -1,
                });
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

export async function db_GetItemWithUUID(uuid) {
    try {
        const ids_query = await supabase
            .from("lost_items")
            .select("*")
            .eq("uuid", uuid)
            .single();

        return ids_query.data;
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

export async function db_RemoveItem(email, id) {
    try {
        if (await db_CheckIfPersonExists() == false)
        {
            console.log(`${email} does not exist in our system.`);
            return false;
        }
        
        //Remove id
        var responseItem = await supabase
            .from("lost_items")
            .delete()
            .eq('id', id);

        //Get items
        var response = await supabase
            .from("Users")
            .select("items")
            .eq("email", email)
            .single();
        
        //Remove item
        console.log(response.data.items);

        const index = response.data.items.indexOf(id);

        if (index > -1) {response.data.items.splice(index, 1);}

        var newArr = response.data.items;

        //Set new arr
        response = await supabase
            .from("Users")
            .update({items : newArr})
            .eq('email', email)

        console.log(`Removed ${id} from ${email}.`);
        return true;
    } catch (err) {
        console.error('Unexpected error in REMOVE ITEM:', err.message);
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
            .select()
            .single();
        
        var idCreated = response.data.id;
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