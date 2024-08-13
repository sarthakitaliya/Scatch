var cloudinary = require('cloudinary') ;
var cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

var storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'SCATCH',
    allowedFormats: ['jpg', 'png'],
});
module.exports = {
    cloudinary,
    storage
};