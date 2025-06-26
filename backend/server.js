// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Set CORS for frontend
app.use(express.json());

// Image uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/website-settings', express.static('uploads/website-settings'));
app.use('/uploads/users', express.static('uploads/users'));
app.use('/uploads/caregivers', express.static('uploads/caregivers'));
app.use('/uploads/story', express.static('uploads/story')); 
app.use('/uploads/founder', express.static('uploads/founder'));




// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/waitlist', require('./routes/waitlistRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/caregivers', require('./routes/caregiverRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));