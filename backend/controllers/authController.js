const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const axios = require('axios');

exports.registerGeneralUser = async (req, res) => {
  const { name, email, phone, gender, category, password } = req.body;

  try {
    if (!['user', 'caregiver'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Check both tables for existing email
    const [userExists] = await db.query('SELECT * FROM tbl_users WHERE email = ?', [email]);
    const [caregiverExists] = await db.query('SELECT * FROM tbl_caregivers WHERE email = ?', [email]);

    if (userExists.length > 0 || caregiverExists.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const table = category === 'user' ? 'tbl_users' : 'tbl_caregivers';
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO ${table} (name, email, phone, gender, password) VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, gender, hashedPassword]
    );

    return res.status(200).json({ message: `${category === 'user' ? 'User' : 'Caregiver'} registered successfully.` });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;
    let userType = '';

    // 1. Check caregivers table
    const [caregiverRows] = await db.query('SELECT * FROM tbl_caregivers WHERE email = ?', [email]);
    if (caregiverRows.length > 0) {
      user = caregiverRows[0];
      userType = 'caregiver';
    } else {
      // 2. Check users table
      const [userRows] = await db.query('SELECT * FROM tbl_users WHERE email = ?', [email]);
      if (userRows.length > 0) {
        user = userRows[0];
        userType = 'user';
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Return common format for both types
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: userType,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit Ticket
exports.submitSupportTicket = async (req, res) => {
  const { user_id, user_type, subject, type, message } = req.body;

  if (!user_id || !user_type || !subject || !type || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert the ticket
    const [ticketResult] = await db.query(
      `INSERT INTO tbl_support_tickets (user_id, user_type, subject, type)
       VALUES (?, ?, ?, ?)`,
      [user_id, user_type, subject, type]
    );

    const ticketId = ticketResult.insertId;

    // Insert the initial message
    await db.query(
      `INSERT INTO tbl_support_messages (ticket_id, sender_type, sender_id, message)
       VALUES (?, ?, ?, ?)`,
      [ticketId, user_type, user_id, message]
    );

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully',
      ticket_id: ticketId,
    });
  } catch (err) {
    console.error('Error submitting support ticket:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get support ticket for a user/caregiver
exports.getSupportTickets = async (req, res) => {
  const { user_id, user_type } = req.query;

  if (!user_id || !user_type) {
    return res.status(400).json({ success: false, message: 'Missing user_id or user_type' });
  }

  try {
    const ticketsQuery = `
      SELECT t.*, m.id as message_id, m.message, m.sender_type, m.created_at as message_created_at
      FROM tbl_support_tickets t
      LEFT JOIN tbl_support_messages m ON t.id = m.ticket_id
      WHERE t.user_id = ? AND t.user_type = ?
      ORDER BY t.created_at DESC, m.created_at ASC
    `;

    const [rows] = await db.query(ticketsQuery, [user_id, user_type]);

    // Group messages under each ticket manually
    const ticketsMap = {};

    for (const row of rows) {
      const ticketId = row.id;
      if (!ticketsMap[ticketId]) {
        ticketsMap[ticketId] = {
          id: row.id,
          user_id: row.user_id,
          user_type: row.user_type,
          subject: row.subject,
          type: row.type,
          status: row.status,
          created_at: row.created_at,
          messages: [],
        };
      }

      if (row.message) {
        ticketsMap[ticketId].messages.push({
          id: row.message_id,
          message: row.message,
          sender_type: row.sender_type,
          created_at: row.message_created_at,
        });
      }
    }

    const tickets = Object.values(ticketsMap);

    res.status(200).json({ success: true, tickets });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.replyToTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { message } = req.body;
  const { user_id, user_type } = req.query;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message cannot be empty' });
  }

  if (!user_id || !user_type) {
    return res.status(400).json({ success: false, message: 'Missing user_id or user_type in query' });
  }

  try {
    await db.query(
      'INSERT INTO tbl_support_messages (ticket_id, sender_id, sender_type, message) VALUES (?, ?, ?, ?)',
      [ticketId, user_id, user_type, message]
    );

    res.status(200).json({ success: true, message: 'Reply sent' });
  } catch (err) {
    console.error('Error sending user reply:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSingleTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { user_id, user_type } = req.query;

  if (!user_id || !user_type) {
    return res.status(400).json({ success: false, message: 'Missing user_id or user_type in query' });
  }

  try {
    // Get the ticket
    const [ticketRows] = await db.query(
      'SELECT * FROM tbl_support_tickets WHERE id = ? AND user_id = ? AND user_type = ?',
      [ticketId, user_id, user_type]
    );

    if (ticketRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticket = ticketRows[0];

    // Get all messages for that ticket
    const [messageRows] = await db.query(
      'SELECT sender_type, message, created_at FROM tbl_support_messages WHERE ticket_id = ? ORDER BY created_at ASC',
      [ticketId]
    );

    ticket.messages = messageRows;

    res.status(200).json({ success: true, ticket });
  } catch (err) {
    console.error('Error fetching ticket:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.submitReview = async (req, res) => {
  const { user_id, user_type, name, review, rating } = req.body;

  try {
    await db.query(
      'INSERT INTO tbl_reviews (user_id, user_type, name, review, rating) VALUES (?, ?, ?, ?, ?)',
      [user_id, user_type, name, review, rating]
    );
    res.status(201).json({ message: 'Review submitted successfully, pending approval.' });
  } catch (err) {
    console.error('Submit Review Error:', err);
    res.status(500).json({ message: 'Error submitting review' });
  }
};

exports.getUserReviews = async (req, res) => {
  const { userId, userType } = req.params;

  try {
    const [reviews] = await db.execute(
      'SELECT * FROM tbl_reviews WHERE user_id = ? AND user_type = ? ORDER BY created_at DESC',
      [userId, userType]
    );

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Failed to fetch user reviews.' });
  }
};

exports.getApprovedReviews = async (req, res) => {
  try {
    const query = `
      SELECT r.*, 
             COALESCE(u.name, c.name) AS name, 
             COALESCE(u.profile_image, c.profile_image) AS profile_image 
      FROM tbl_reviews r
      LEFT JOIN tbl_users u ON r.user_type = 'user' AND r.user_id = u.id
      LEFT JOIN tbl_caregivers c ON r.user_type = 'caregiver' AND r.user_id = c.id
      WHERE r.is_approved = 1
      ORDER BY RAND()
      LIMIT 3
    `;
    const reviews = await db.query(query);
    res.status(200).json(reviews[0]);
  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    res.status(500).json({ message: 'Failed to load testimonials.' });
  }
};

// Payment Testing
exports.verifyPaystackPayment = async (req, res) => {
  const { reference, user_id, user_type, email } = req.body;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer sk_test_48c3d0ba847d7ea47302f8afc217834c382c93bd`, // 🔒 Replace with your actual secret key
      },
    });

    const data = response.data.data;

    if (data.status === 'success') {
      const { amount, currency, paid_at, status } = data;

      // Insert into database using PostgreSQL placeholders ($1, $2, ...)
      await db.query(
        `INSERT INTO tbl_payments 
        (user_id, user_type, email, amount, currency, reference, status, paid_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          user_type,
          email,
          amount,
          currency,
          reference,
          status,
          new Date(paid_at),
        ]
      );

      return res.status(200).json({ message: 'Payment verified and stored successfully.' });
    } else {
      return res.status(400).json({ message: 'Payment not successful.' });
    }
  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Verification failed.' });
  }
};

// Send Notification
exports.sendNotification = async (req, res) => {
  const { user_id, user_type, message, type } = req.body;

  try {
    await db.query(
      `INSERT INTO tbl_notifications (user_id, user_type, message, type) VALUES (?, ?, ?, ?)`,
      [user_id, user_type, message, type]
    );
    res.status(201).json({ message: 'Notification sent successfully.' });
  } catch (err) {
    console.error('Send Notification Error:', err);
    res.status(500).json({ message: 'Failed to send notification.' });
  }
};

// Get Notification
exports.getNotifications = async (req, res) => {
  const { userId, userType } = req.params;

  try {
    const [notifications] = await db.query(
      `SELECT * FROM tbl_notifications 
       WHERE user_id = ? AND user_type = ? 
       ORDER BY created_at DESC`,
      [userId, userType]
    );

    res.status(200).json({ data: notifications });
  } catch (err) {
    console.error('Get Notifications Error:', err);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
};

// Mark Notification as read
exports.markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    await db.query(
      `UPDATE tbl_notifications SET is_read = 1 WHERE id = ?`,
      [notificationId]
    );

    res.status(200).json({ message: 'Notification marked as read.' });
  } catch (err) {
    console.error('Mark Read Error:', err);
    res.status(500).json({ message: 'Failed to update notification status.' });
  }
};