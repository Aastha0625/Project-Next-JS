import mongoose, { model, Schema , models} from "mongoose";
import bcrypt from "bcryptjs";


//export interface of user
export interface IUser{   
    email : string;
    password : string;
    _id? : mongoose.Types.ObjectId; //id can be there or not hence ?
    createdAt?: Date;
    updatedAt?: Date;
}

//contains schema(how data is stored) of an user
const userSchema = new Schema<IUser>(
    {
        email : {type:String, required: true, unique:true},
        password: {type:String, required: true }},
        {timestamps : true},
)
//prehook, data save hone se pehle ek hook
userSchema.pre("save",async function (next){
    //prehook chalega jab given password field modify hua h,tb encrypt(hash)
    if (this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
});

//model is constructor represents collection of databases
//edge cases nextjs ke solve krne model?.User use krenge, optionally agr user h to wahi 
// dedo verna aage ka dedo
const User =  models?.User || model<IUser>("User",userSchema)

export default User;