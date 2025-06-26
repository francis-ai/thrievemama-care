// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');
const uploadWebsiteSettings = require('../middleware/uploadsWebsiteSettings');

// Admin Registration
router.post('/register', adminController.adminRegister);

// Admin Login
router.post('/login', adminController.adminLogin);

// Social
router.post('/social', adminController.addSocialLink);        // POST /social
router.get('/social', adminController.getSocialLinks);        // GET /social
router.put('/social/:id', adminController.updateSocialLink);  // PUT /social/:id

// About us
const aboutUsImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/about');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const aboutupload = multer({ storage: aboutUsImage }); // ✅ fixed here

// About Us Routes
router.post('/add-about', aboutupload.single('about_image'), adminController.addAboutUs);
router.get('/get-about', adminController.getAboutUs);

//Story
const storyImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/story');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const storyUpload = multer({ storage: storyImageStorage });

//Story Route
router.post('/add-story', storyUpload.single('story_image'), adminController.addOurStory);
router.get('/get-story', adminController.getOurStory);

// Founder
const founderImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/founder');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const founderUpload = multer({ storage: founderImageStorage });

// Founder Routes
router.post('/add-founder', founderUpload.single('founder_image'), adminController.addFounder);
router.get('/get-founder', adminController.getFounder);


// Save or update website settings (logo + banners)
router.post(
  '/save-settings',
  uploadWebsiteSettings.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner1', maxCount: 1 },
    { name: 'banner2', maxCount: 1 },
    { name: 'banner3', maxCount: 1 },
  ]),
  adminController.saveWebsiteSettings
);

// Get website settings
router.get('/get-settings', adminController.getWebsiteSettings);

// Route to get, update and deletes all users and caregivers
router.get('/users', adminController.getAllUsers);
router.get('/caregivers', adminController.getAllCaregivers);
router.post('/update-caregiver-status', adminController.updateCaregiverStatus);
router.delete('/delete-user/:id', adminController.deleteUser);
router.delete('/delete-caregiver/:id', adminController.deleteCaregiver);

// KYC Management
router.get('/kyc', adminController.getAllKYC);
router.get('/kyc/:id', adminController.getKYCDetails);
router.patch('/kyc/:id/status', adminController.updateKYCStatus);

// Route to get All caregiverRequest
router.get('/all-caregiver-requests', adminController.getAllCaregiverRequests);

// Support Routes
router.get('/support-tickets', adminController.getAllSupportTickets); // Get all support tickets (with messages)
router.post('/support-tickets/:ticketId/respond', adminController.respondToTicket); // Respond to a ticket
router.put('/support-tickets/:ticketId/status', adminController.updateTicketStatus); // Update ticket status

// Review
router.get('/all-reviews', adminController.getAllReviews);
router.put('/review/approve/:id', adminController.approveReview);

module.exports = router;