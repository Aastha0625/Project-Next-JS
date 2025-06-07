//component used to use the file upload using the provider
"user client";
//lucide react has icons,loaders etc.
import {Loader2} from "lucide-react";
import React, {useState} from "react";
import {IKUpload ,} from  "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";


//file upload ke time jo jo chesse chahiye uske liye interface
interface FileUploadProps{
    onSuccess : (res : IKUploadResponse)=>void; 
    onProgress ?: (progress : number)=> void;
    fileType?: "image" | "video"
}



export default function FileUpload ({ //all this will be received
    onSuccess ,
    onProgress,
    fileType = "image"
}: FileUploadProps){

    //need two states: for uploading and then error/success
    const [ uploading , setUploading] = useState(false);
    const [error , setError] = useState<string | null>(null)
    
    //error handle
    const onError = (err: {message : string})=>{
        console.log("Error",err);
        setError(err.message)
        setUploading(false)
    };

    //success handle
    const handleSuccess = (response : IKUploadResponse)=>{
        console.log("Success",response);
        setUploading(false)
        setError(null)
        onSuccess(response) //object response passed to props Onsuccess for getting it as whole for user
    };

    //progress start handle
    const handleStartUpload = ()=>{
        setUploading(true)
        setError(null)
    };

    //handle progress
    const handleProgress = (evt: ProgressEvent)=>{
        if(evt.lengthComputable && onProgress){
            const percentComplete = (evt.loaded / evt.total)*100;
            onProgress(Math.round(percentComplete));
        }
    };

    //validate file type,size etc.
    const validateFile = (file : File)=>{
        if(fileType === "video"){
            if(!file.type.startsWith("video")){
                setError("Please upload a video file")
                return false //validate executes on true 
            }
            if (file.size > 100*1024*1024){
            setError("Video must be less thsn 100 MB")
            return false
        }
    }else{
        const validTypes = ["image/jpeg","image/png","/image/webp"]
        if ( !validTypes.includes(file.type)){
            setError("Please upload a valid file format (JPEG,PNG,WEBP)")
            return false
        }
        if (file.size > 5*1024*1024){
            setError("Image must be less thsn 5 MB")
            return false
        }
        }
        return false
    }


return 
    (
        <div className="space-y-2">
            <IKUpload 
            fileName={fileType === "video"? "video" : "image"}
            useUniqueFileName = {true}
            validateFile={validateFile}
            onError={onError}
            onSuccess={handleSuccess}
            onUploadProgress={handleProgress}
            onUploadStart={handleStartUpload}
            accept={fileType === "video"? "video/*": "image/*"}
            className="file-input file-input-bordered w-full"
            folder={fileType === "video"? "/videos" : "/images"}
            transformation={
                {
                    pre : "l+text,i-Imagekit,fs-50,l-end",
                    post:[
                        {
                            type : "transformation",
                            value: "w-100"
                        },
                    ],
                    
                }} 
            />

            //conditional render
            {
                uploading && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="animate-spin w-4 h-4"/>
                    <span>Uploading...</span>
                    </div>
                )
            }

            //error render
            {
                error && (
                    <div className = "text-error text-sm">{error}</div>
                )
            }
</div> )

}

