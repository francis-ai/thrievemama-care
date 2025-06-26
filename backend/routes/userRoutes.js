const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');

// Storage config for user profile images
const userProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/users');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadUserProfile = multer({ storage: userProfileStorage });

// User Profile Routes
router.get('/profile/:id', userController.getUserProfile);
router.post('/update-profile', uploadUserProfile.single('profile_image'), userController.updateProfile);
router.post('/change-password', userController.changePassword);

// Caregiver Request
router.post('/caregiver-request', userController.submitCaregiverRequest);
router.get('/my-caregiver-requests/:userId', userController.getUserCaregiverRequests);
router.put("/update-my-caregiver-requests/:id", userController.updateRequest);
router.put("/close-my-caregiver-request/:id", userController.closeRequest);
router.delete("/delete-my-caregiver-requests/:id", userController.deleteRequest);

// Get interested caregivers and update their status. 
router.get('/interested-caregivers/:userId', userController.getInterestedCaregivers);
router.patch('/interests/:id/status', userController.updateInterestStatus);

// Get Approved caregiver
router.get('/approved-caregivers/:userId', userController.getApprovedCaregivers);

// submit a review for a caregiver
router.post('/caregiver-review', userController.submitCaregiverReview);
router.get('/caregiver-review/:userId/:caregiverId', userController.getUserReviewForCaregiver);
router.put('/caregiver-review/:userId/:caregiverId', userController.updateCaregiverReview);

// Count Total Request made
router.get('/caregiver-requests-count/:userId', userController.getCaregiverRequestsCount);

// Create Appointment
router.post('/create-appointment', userController.createAppointment);
router.put('/complete-appointment/:appointmentId', userController.completeAppointment);
router.get('/appointments/:userId', userController.getAppointmentsByUserId);

// Verify Payment
router.post('/verify-payment', userController.verifyPaystackPayment);



module.exports = router;
