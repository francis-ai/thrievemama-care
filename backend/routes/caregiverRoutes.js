const express = require('express');
const router = express.Router();
const multer = require('multer');
const caregiverController = require('../controllers/caregiverController');
const upload = require('../middleware/kycUpload');

// Storage config for caregiver profile images
const caregiverProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/caregivers');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadcaregiverProfile = multer({ storage: caregiverProfileStorage });

// Routes
router.get('/profile/:id', caregiverController.getCaregiverProfile);
router.post('/update-profile', uploadcaregiverProfile.single('profile_image'), caregiverController.updateProfile);
router.post('/change-password', caregiverController.changePassword);

// Routs for KYC submition, update and get
router.post(
  '/kyc',
  upload.fields([
    { name: 'id_card', maxCount: 1 },
    { name: 'proof_of_address', maxCount: 1 },
    { name: 'guarantor1_doc', maxCount: 1 },
    { name: 'guarantor2_doc', maxCount: 1 }
  ]),
  caregiverController.submitKYC
);
router.get('/kyc/:caregiver_id', caregiverController.getKYCStatus);
router.patch(
  '/kyc/caregiver/:caregiver_id',
  upload.fields([
    { name: 'id_card', maxCount: 1 },
    { name: 'proof_of_address', maxCount: 1 },
    { name: 'guarantor1_doc', maxCount: 1 },
    { name: 'guarantor2_doc', maxCount: 1 }
  ]),
  caregiverController.updateKYCByCaregiverId
);

// Routes to get All caregiver request
router.get('/all-caregiver-requests', caregiverController.getAllRequests);

// Show or unshow interest
router.post('/show-interest', caregiverController.showInterest);
router.post('/unshow-interest', caregiverController.unshowInterest);

// Optional: Get all interested requests
router.get('/my-interests/:caregiverId', caregiverController.getMyInterests);

//Get KYC status
router.get('/kyc-status/:id', caregiverController.getCaregiverKYCStatus);

// Get Reviews from users
router.get('/caregiver-reviews/:caregiverId', caregiverController.getAllReviewsForCaregiver);

module.exports = router;