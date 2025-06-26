const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerGeneralUser);
router.post('/login', authController.loginUser);

// Support Ticket Routes
router.post('/submit-ticket', authController.submitSupportTicket);
router.get('/get-support-tickets', authController.getSupportTickets);
router.post('/support-tickets/:ticketId/reply', authController.replyToTicket);
router.get('/support-tickets/:ticketId', authController.getSingleTicket);

// Review Routes
router.post('/submit-review', authController.submitReview);
router.get('/my-reviews/:userId/:userType', authController.getUserReviews);

// Get Reviews to Home screen. 
router.get('/approved-reviews', authController.getApprovedReviews);

// Routes for Notifications
router.post('/notifications', authController.sendNotification);
router.get('/notifications/:userId/:userType', authController.getNotifications);
router.put('/notifications/mark-read/:notificationId', authController.markNotificationAsRead);



// Payment Testing
router.post('/verify-payment', authController.verifyPaystackPayment);


module.exports = router;
