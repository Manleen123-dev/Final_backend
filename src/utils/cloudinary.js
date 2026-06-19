import { v2 as cloudinary } from 'cloudinary';
import fs  from"fs";


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY , 
        api_secret:process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    console.log("Inside cloudinary.js");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);

console.log("Cloudinary config:", cloudinary.config());
const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("Local file path:", localFilePath);
        console.log("File exists:", fs.existsSync(localFilePath));

        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File uploaded:", response.url);
        return response;

    } catch (error) {
        console.log("Cloudinary Error:", error);

        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
}

  export{uploadOnCloudinary}  
    
    // Optimize delivery by resizing and applying auto-format and auto-quality

        
  