//database connection 

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;  //connection string from process.env

if(!MONGODB_URI){
    throw new Error("Please define mongodb uri in env file")  
}

//jo bhi node env h wahi se connection miljaye
let cached = global.mongoose;  

//check whether cache has any connection like mongoose or not
if(!cached){
    cached = global.mongoose = {conn: null , promise: null} //create cache
}

//connection on db

export async function connectDatabase(){
    if (cached.conn){ //if conection already exists
        return cached.conn;
    }

    if(!cached.promise){   //if any promise is also not running
        const opts = {
            bufferCommands: true, //handle temporary storage
            maxPoolSize: 10, //no. of connections that can be done at a time with mongodb
        }
    
    //is any promise exists
    cached.promise = (mongoose.connect(MONGODB_URI,opts))
    .then(()=>mongoose.connection) 
    }
    //if any promise exists and is running
    try {
        cached.conn = await cached.promise
    } catch (error:any) {
        cached.promise = null //make promise null
        throw error
    }

    return cached.conn;

}
