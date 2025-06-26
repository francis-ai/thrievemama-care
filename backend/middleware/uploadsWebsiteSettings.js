// uploadWebsiteSettings.js
const multer = require('multer');
const path = require('path');

// Set up disk storage in uploads/website-settings
const websiteSettingsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/website-settings'); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadWebsiteSettings = multer({ storage: websiteSettingsStorage });

module.exports = uploadWebsiteSettings;
