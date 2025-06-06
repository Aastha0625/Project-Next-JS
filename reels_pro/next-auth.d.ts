//next-auth setup : STEPS: 1. next-auth.d.ts 2. NextAuthOptions 3.[...nextauth] 
//4. register 5.middleware

import { DefaultSession } from "next-auth";

declare module "next-auth"{
    interface Session{
        user : {
            id : String;
        } & DefaultSession["user"];
    }
}