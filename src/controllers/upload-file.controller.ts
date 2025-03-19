import express, { Router } from "express";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable,uploadString } from "firebase/storage";
import multer from "multer";
import config from "../config/firebase.config"
import { v2 as cloudinary } from 'cloudinary';

const router: Router = express.Router();

//Initialize a firebase application
initializeApp(config.firebaseConfig);
import { nanoid } from 'nanoid'

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });



router.post("/", upload.single("image"), async (req, res) => {



    const img = req.body.image;
    console.log(img)

    
   const ids = nanoid();
    


  
    //const base64str = `data:image/png;base64,${img}`;
    cloudinary.config({ 
        cloud_name: 'da46ytkha', 
        api_key: '977157797782912', 
        api_secret: 'PUrUIjl3IAp5ghsXqEznBWn7WVY' // Click 'View API Keys' above to copy your API secret
    });
    
   try {
     // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           `${img}`, {
               public_id:ids,
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);

    return res.json(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(`${ids}`, {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url(`${ids}`, {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
   } catch (error) {
    return res.json('error ao enviar arquivo!');
   }
});


export default router;