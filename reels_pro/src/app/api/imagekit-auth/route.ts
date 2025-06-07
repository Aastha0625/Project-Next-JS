import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey : process.env.NEXT_PUBLIC_PUCLIC_KEY!,
    privateKey : process.env.PRIVATE_KEY!,
    urlEndpoint : process.env.NEXT_PUBLIC_URL_ENDPOINT!,
})

//gives the response tokens,expiries,etc. for uploading files after authentication
export async function  GET(){
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters()
         return NextResponse.json(authenticationParameters)
    } 
    catch (error : any) {
        return NextResponse.json (
            {
                error : "Imagekit Auth failed"},
                {status : 500}  
        );
    }
}