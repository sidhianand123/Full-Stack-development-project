const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with your credentials
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,  
    api_key: process.env.CLOUD_API_KEY,  
    api_secret: process.env.CLOUD_API_SECRET
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV', // The name of the folder in Cloudinary
   allowed_formats: ['jpeg', 'png', 'jpg']
  },
});

module.exports = {
    cloudinary,
    storage
};
 