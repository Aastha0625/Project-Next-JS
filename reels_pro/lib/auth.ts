//contains next-auth options
import { NextAuthOptions } from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials"
import { connectDatabase } from "./db";
import User from "../models/Users";
import bcrypt from "bcryptjs";
import jwt from "json5"

export const authOptions : NextAuthOptions = {
  //providers array defined
    providers : [
       //credentials n ho, github google ho to next-auth se lakr kr skte h
        CredentialsProvider({
            name : "Credentials",
            credentials : {
                email : {label : "Email", typle: "text"},
                password : {label : "Password", type : "password"}
            },
            //credentials ka logic
            async authorize(credentials){

                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing email or password")
                }

                try{
                    await connectDatabase();
                    //checking user details
                    const user = await User.findOne({email : credentials.email})

                    if(!user){
                        throw new Error("No user found")
                    }
                    //compare takes two props: password and credentials
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password,
                    )
                    //password dont match
                    if(!isValid){
                        throw new Error("Invalid password")
                    }
                    //when everything is fine
                    return {
                        id : user._id.toString(),
                        email : user.email
                    }
                }
                catch (error:any){
                    throw error;
                }
            }
        }),
    ],

    callbacks : {
        async jwt({token , user}){
            if(user){
                token.id = user.id
            }
            return token;
        },
        //session has an object ,most things found here : session holds info about currently logged 
        // in users
        //represents authenticated user's state
        async session({session , token}){ //token ke andar id dena start ki datbase me 
        // rkhne ke alawa uski id lekr tokens me kaam krate h 

            if (session.user){
                session.user.id = token.id as string
            }
            return session
        }
        
    },

    //pages
    pages: {
        signIn : "/login",
        error : "/login",
    },

    session : { //gives option to store token in database or jwt 
        strategy : "jwt", 
        maxAge : 30*24*60*60
    },

    //secret
    secret : process.env.NEXTAUTH_SECRET
};