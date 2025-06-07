"use client" // This component must be a client component

import { ImageKitProvider} from "imagekitio-next";
import { SessionProvider } from "next-auth/react";  //use of sessions naywhere


const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIc_KEY;

//request authentication
const authenticator = async ()=>{
    try {  //gets response
        const response = await fetch("/api/imagekit-auth")
        //if not req response
        if(!response.ok){
            const errorText = await response.text();
            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`
            );
        }
        //receive data
        const data = await response.json();
        const { signature , expire , token} = data;
        return { signature , expire , token};
    } 
    //if authentication fails
    catch (error:any) {
        console.log(error);
        throw new Error(`Imagekit Authentication request failed: `)
    }
}

export default function Providers({children}: {children :React.ReactNode}){
    return (
        <SessionProvider>
        <ImageKitProvider
        urlEndpoint = {urlEndpoint}
        publicKey = {publicKey}
        authenticator = {authenticator}
        >
           { children}
        </ImageKitProvider>
        </SessionProvider> //for use of session anywhere while image uploading
    )
}