const express = require('express');
const router = express.Router();
const { joinWaitlist } = require('../controllers/waitlistController');

// Keep route clean here
router.post('/', joinWaitlist);

module.exports = router;
