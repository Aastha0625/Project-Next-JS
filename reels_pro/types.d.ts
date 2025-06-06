//declare karrhe h global variables for e.g. db.ts me mongoose jaise
import { Connection } from "mongoose";
declare global {
    var mongoose :
//do connections aayenge ya to hoga connection ya horha hoga via promisises
    {
        conn : Connection | null  
        promise : Promise <Connection> | null, //<> datatype

    }
}

export{};

//all this by typescript only other db would have been done