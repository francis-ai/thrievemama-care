const db = require('../config/db');
const bcrypt = require('bcryptjs');
const axios = require('axios');


// GET user profile by ID
exports.getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM tbl_users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE user profile
exports.updateProfile = async (req, res) => {
  const { name, phone, gender, address, user_id } = req.body;
  const profile_image = req.file ? req.file.filename : null;

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'User ID is required.' });
  }

  try {
    let updateFields = [];
    let params = [];

    if (name) {
      updateFields.push('name = ?');
      params.push(name);
    }

    if (phone) {
      updateFields.push('phone = ?');
      params.push(phone);
    }

    if (gender) {
      updateFields.push('gender = ?');
      params.push(gender);
    }

    if (address) {
      updateFields.push('address = ?');
      params.push(address);
    }

    if (profile_image) {
      updateFields.push('profile_image = ?');
      params.push(profile_image);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No data provided for update.' });
    }

    params.push(user_id); // Where clause value

    const [result] = await db.query(
      `UPDATE tbl_users SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

exports.changePassword = async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM tbl_users WHERE id = ?', [id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE tbl_users SET password = ? WHERE id = ?', [hashedPassword, id]);

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error while changing password.' });
  }
};

// Submit Request
exports.submitCaregiverRequest = async (req, res) => {
  const { user_id, service, duration, ageGroup, address, notes, offer_amount } = req.body;

  // Check required fields
  if (!user_id || !service || !duration || !address || offer_amount === undefined) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const status = 'Open';

    await db.query(
      `INSERT INTO tbl_caregiver_requests 
        (user_id, service, duration, age_group, address, notes, status, offer_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, service, duration, ageGroup, address, notes, status, offer_amount]
    );

    res.status(201).json({ success: true, message: 'Caregiver request submitted successfully' });
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get My request
exports.getUserCaregiverRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const [requests] = await db.query(
      `SELECT * FROM tbl_caregiver_requests WHERE user_id = ? ORDER BY created_at DESC`, [userId]
    );

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve requests' });
  }
};

// Update Request
exports.updateRequest = async (req, res) => {
  const { id } = req.params;
  const { service, duration, age_group, address, notes, status, offer_amount } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE tbl_caregiver_requests 
       SET service = ?, duration = ?, age_group = ?, address = ?, notes = ?, status = ?, offer_amount = ? 
       WHERE id = ?`,
      [service, duration, age_group, address, notes, status, offer_amount, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    res.status(200).json({ success: true, message: "Request updated successfully." });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


// Close Request
exports.closeRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      `UPDATE tbl_caregiver_requests SET status = 'Close' WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    res.status(200).json({ success: true, message: "Request closed successfully." });
  } catch (error) {
    console.error("Close request error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Delete Request
exports.deleteRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const [result] = await db.query(
      `DELETE FROM tbl_caregiver_requests WHERE id = ?`,
      [requestId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getInterestedCaregivers = async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate userId exists
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const [results] = await db.query(`
      SELECT 
        ci.id AS interest_id,
        ci.status,
        ci.created_at AS interest_date,
        c.id AS caregiver_id,
        c.name AS caregiver_name,
        c.email,
        c.phone,
        c.gender,
        c.profile_image,
        r.id AS request_id,
        r.service,
        r.duration,
        r.age_group,
        r.offer_amount As offer_amount,
        r.address AS request_address,
        r.status AS request_status
      FROM tbl_caregiver_interests ci
      INNER JOIN tbl_caregivers c ON ci.caregiver_id = c.id
      INNER JOIN tbl_users u ON c.id = u.id
      INNER JOIN tbl_caregiver_requests r ON ci.request_id = r.id
      WHERE r.user_id = ?
      AND ci.interested = 1 
      ORDER BY ci.created_at DESC
    `, [userId]);

    if (!results.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No caregivers have shown interest yet'
      });
    }

    const caregivers = results.map(row => ({
      interest_id: row.interest_id,
      status: row.status,
      interest_date: row.interest_date,
      caregiver: {
        id: row.caregiver_id,
        name: row.caregiver_name,
        email: row.email,
        phone: row.phone,
        gender: row.gender,
        caregiver_photo: row.profile_image
      },
      request: {
        id: row.request_id,
        service: row.service,
        duration: row.duration,
        age_group: row.age_group,
        offer_amount: row.offer_amount,
        address: row.request_address,
        request_status: row.request_status
      }
    }));

    res.status(200).json({ 
      success: true, 
      data: caregivers 
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching caregiver interests',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

exports.updateInterestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // 1. Update only the status field
    const [result] = await db.query(`UPDATE tbl_caregiver_interests SET status = ? WHERE id = ?`,
      [status, id]
    );

    // 2. Check if update was successful
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No matching record found" 
      });
    }

    // 3. Return success
    res.status(200).json({ 
      success: true, 
      message: "Status updated",
      status: status 
    });

  } catch (error) {
    console.error("Status update failed:", error);
    res.status(500).json({ 
      success: false, 
      message: "Database error" 
    });
  }
};

// Get Approved caregiver
exports.getApprovedCaregivers = async (req, res) => {
  const userId = req.params.userId;

  try {
    const approvedCaregiversQuery = `
      SELECT ci.*, cr.*, c.name AS caregiver_name, c.profile_image AS caregiver_image
      FROM tbl_caregiver_interests ci
      INNER JOIN tbl_caregiver_requests cr ON ci.request_id = cr.id
      INNER JOIN tbl_caregivers c ON ci.caregiver_id = c.id
      WHERE cr.user_id = ? AND ci.status = 'Approved'
    `;

    const [results] = await db.query(approvedCaregiversQuery, [userId]);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching approved caregivers:', error);
    res.status(500).json({ message: 'Error fetching approved caregivers' });
  }
};

// POST: Submit a review
exports.submitCaregiverReview = async (req, res) => {
  const { user_id, caregiver_id, rating, comment } = req.body;

  if (!user_id || !caregiver_id || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    await db.query(
      `INSERT INTO tbl_caregiver_reviews (user_id, caregiver_id, rating, comment) VALUES (?, ?, ?, ?)`,
      [user_id, caregiver_id, rating, comment]
    );
    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Failed to submit review.' });
  }
};

// Get user's review for a specific caregiver
exports.getUserReviewForCaregiver = async (req, res) => {
  const { userId, caregiverId } = req.params;

  try {
    const [review] = await db.query(
      `SELECT * FROM tbl_caregiver_reviews WHERE user_id = ? AND caregiver_id = ? LIMIT 1`,
      [userId, caregiverId]
    );

    if (review.length === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.status(200).json(review[0]);
  } catch (error) {
    console.error('Error fetching user review:', error);
    res.status(500).json({ message: 'Failed to retrieve review.' });
  }
};

// Update user's review for a specific caregiver
exports.updateCaregiverReview = async (req, res) => {
  const { userId, caregiverId } = req.params;
  const { rating, comment } = req.body;

  try {
    const [existing] = await db.query(
      `SELECT * FROM tbl_caregiver_reviews WHERE user_id = ? AND caregiver_id = ?`,
      [userId, caregiverId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    await db.query(
      `UPDATE tbl_caregiver_reviews SET rating = ?, comment = ? WHERE user_id = ? AND caregiver_id = ?`,
      [rating, comment, userId, caregiverId]
    );

    res.status(200).json({ message: 'Review updated successfully.' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review.' });
  }
};

// Count Total Request made
exports.getCaregiverRequestsCount = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const [result] = await db.query(
      `SELECT COUNT(*) as count FROM tbl_caregiver_requests WHERE user_id = ?`,
      [userId]
    );
    res.json({ count: result[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create Appointment
exports.createAppointment = async (req, res) => {
  const {
    caregiver_id,
    user_id,
    request_id,
    appointment_date,
    appointment_time,
    payment_reference,
    amount_paid
  } = req.body;

  try {
    // 1. Verify payment exists and was successful
    const [payment] = await db.query(
      'SELECT * FROM tbl_payments WHERE reference = ? AND status = ?',
      [payment_reference, 'success']
    );

    if (!payment) {
      return res.status(400).json({ message: 'No valid payment found' });
    }

    // 2. Create the appointment
    const [appointment] = await db.query(
      `INSERT INTO tbl_appointments (
        caregiver_id,
        user_id,
        request_id,
        appointment_date,
        appointment_time,
        payment_reference,
        amount_paid,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        caregiver_id,
        user_id,
        request_id,
        appointment_date,
        appointment_time,
        payment_reference,
        amount_paid,
        'Scheduled' // Initial status
      ]
    );

    // 3. Update payment record with appointment ID
    await db.query(
      'UPDATE tbl_payments SET appointment_id = ? WHERE reference = ?',
      [appointment.insertId, payment_reference]
    );

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: {
        id: appointment.insertId,
        caregiver_id,
        user_id,
        request_id,
        appointment_date,
        appointment_time,
        payment_reference,
        amount_paid,
        status: 'Scheduled'
      }
    });

  } catch (err) {
    console.error('Appointment creation error:', err);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
};

// Appointment Completed
exports.completeAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const [appointmentRows] = await db.query(
      `SELECT * FROM tbl_appointments WHERE id = ?`,
      [appointmentId]
    );

    if (appointmentRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const appointment = appointmentRows[0];

    const [requestRows] = await db.query(
      `SELECT offer_amount FROM tbl_caregiver_requests WHERE id = ?`,
      [appointment.request_id]
    );

    const offerAmount = requestRows[0]?.offer_amount || 0;

    await db.query(
      `UPDATE tbl_appointments SET status = 'Completed' WHERE id = ?`,
      [appointmentId]
    );

    await db.query(
      `UPDATE tbl_caregivers SET available_balance = available_balance + ? WHERE id = ?`,
      [offerAmount, appointment.caregiver_id]
    );

    res.status(200).json({ success: true, message: 'Appointment marked as completed and caregiver credited' });
  } catch (error) {
    console.error('Completion error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Appointment
exports.getAppointmentsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const [appointments] = await db.query(
      `SELECT * FROM tbl_appointments WHERE user_id = ? ORDER BY id DESC`,
      [userId]
    );

    res.status(200).json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.verifyPaystackPayment = async (req, res) => {
  const { reference, user_id, user_type, email, amount } = req.body;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer sk_test_48c3d0ba847d7ea47302f8afc217834c382c93bd`,
      },
    });

    const data = response.data.data;

    if (data.status === 'success') {
      // Insert payment record
      const [paymentResult] = await db.query(
        `INSERT INTO tbl_payments 
        (user_id, user_type, email, amount, currency, reference, status, paid_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          user_type,
          email,
          amount,
          data.currency,
          reference,
          data.status,
          new Date(data.paid_at),
        ]
      );

      // Get the inserted payment record
      const [payment] = await db.query(
        'SELECT * FROM tbl_payments WHERE reference = ?',
        [reference]
      );

      res.status(200).json({ 
        message: 'Payment verified',
        payment: payment[0] 
      });
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

// Payment History


// Appointment History


// Terminate Service.
