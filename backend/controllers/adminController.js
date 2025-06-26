// controllers/adminController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin Registration
exports.adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if admin already exists
    const [existing] = await db.query('SELECT * FROM tbl_admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO tbl_admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [adminResult] = await db.query('SELECT * FROM tbl_admins WHERE email = ?', [email]);
    const admin = adminResult[0];
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful', token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addSocialLink = async (req, res) => {
  try {
    const { platform, url } = req.body;

    const insertQuery = "INSERT INTO tbl_social_links (platform, url) VALUES (?, ?)";
    await db.execute(insertQuery, [platform, url]);

    res.status(201).json({ message: 'Social media link added successfully.' }); // ✅ Response
  } catch (error) {
    console.error("Error adding social media link:", error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

exports.getSocialLinks = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tbl_social_links');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch social links.' });
  }
};

exports.updateSocialLink = async (req, res) => {
  const { id } = req.params;
  const { platform, url } = req.body;

  const query = 'UPDATE tbl_social_links SET platform = ?, url = ? WHERE id = ?';

  try {
    const [result] = await db.query(query, [platform, url, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Social link not found' });
    }

    return res.status(200).json({ message: 'Social link updated successfully' });
  } catch (err) {
    console.error('Update Error:', err);
    return res.status(500).json({ error: 'Update failed' });
  }
};

// ADD About Entry
exports.addAboutUs = async (req, res) => {
  const { title, content } = req.body;
  const about_image = req.file ? req.file.filename : null;

  try {
    const [existing] = await db.query('SELECT * FROM tbl_about_us LIMIT 1');

    if (existing.length > 0) {
      // Update the existing record
      const [update] = await db.query(
        'UPDATE tbl_about_us SET title = ?, content = ?, about_image = ? WHERE id = ?',
        [title, content, about_image || existing[0].about_image, existing[0].id]
      );
      return res.json({ message: 'About Us updated successfully' });
    } else {
      // Insert new if none exists
      const [insert] = await db.query(
        'INSERT INTO tbl_about_us (title, content, about_image) VALUES (?, ?, ?)',
        [title, content, about_image]
      );
      return res.json({ message: 'About Us created successfully' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET All About Entries
exports.getAboutUs = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tbl_about_us');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// Add or Update Our Story
exports.addOurStory = async (req, res) => {
  const { title, content } = req.body;
  const story_image = req.file ? req.file.filename : null;

  try {
    const [existing] = await db.query('SELECT * FROM tbl_our_story LIMIT 1');

    if (existing.length > 0) {
      await db.query(
        'UPDATE tbl_our_story SET title = ?, content = ?, story_image = ? WHERE id = ?',
        [title, content, story_image || existing[0].story_image, existing[0].id]
      );
      return res.json({ message: 'Our Story updated successfully' });
    } else {
      await db.query(
        'INSERT INTO tbl_our_story (title, content, story_image) VALUES (?, ?, ?)',
        [title, content, story_image]
      );
      return res.json({ message: 'Our Story created successfully' });
    }
  } catch (err) {
    console.error('Our Story Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get Our Story
exports.getOurStory = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tbl_our_story');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// Add or Update Meet Our Founder
exports.addFounder = async (req, res) => {
  const { title, content } = req.body;
  const founder_image = req.file ? req.file.filename : null;

  try {
    const [existing] = await db.query('SELECT * FROM tbl_meet_founder LIMIT 1');

    if (existing.length > 0) {
      await db.query(
        'UPDATE tbl_meet_founder SET title = ?, content = ?, founder_image = ? WHERE id = ?',
        [title, content, founder_image || existing[0].founder_image, existing[0].id]
      );
      return res.json({ message: 'Founder section updated successfully' });
    } else {
      await db.query(
        'INSERT INTO tbl_meet_founder (title, content, founder_image) VALUES (?, ?, ?)',
        [title, content, founder_image]
      );
      return res.json({ message: 'Founder section created successfully' });
    }
  } catch (err) {
    console.error('Founder Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get Meet Our Founder
exports.getFounder = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tbl_meet_founder');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
};


// ADD or UPDATE Website Settings
exports.saveWebsiteSettings = async (req, res) => {
  const {
    site_name,
    caption,
    tagline, // formerly 'description'
  } = req.body;

  const logo = req.files?.logo?.[0]?.filename || null;
  const banner1 = req.files?.banner1?.[0]?.filename || null;
  const banner2 = req.files?.banner2?.[0]?.filename || null;
  const banner3 = req.files?.banner3?.[0]?.filename || null;

  try {
    const [existing] = await db.query('SELECT * FROM tbl_website_identity LIMIT 1');

    if (existing.length > 0) {
      const existingData = existing[0];

      await db.query(
        `UPDATE tbl_website_identity 
         SET site_name = ?, caption = ?, tagline = ?,
             logo = ?, banner1 = ?, banner2 = ?, banner3 = ?
         WHERE id = ?`,
        [
          site_name,
          caption,
          tagline,
          logo || existingData.logo,
          banner1 || existingData.banner1,
          banner2 || existingData.banner2,
          banner3 || existingData.banner3,
          existingData.id,
        ]
      );

      return res.json({ message: 'Website settings updated successfully' });
    } else {
      await db.query(
        `INSERT INTO tbl_website_identity 
         (site_name, caption, tagline, logo, banner1, banner2, banner3)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [site_name, caption, tagline, logo, banner1, banner2, banner3]
      );

      return res.json({ message: 'Website settings saved successfully' });
    }
  } catch (err) {
    console.error('Settings Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET Website Settings
exports.getWebsiteSettings = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tbl_website_identity LIMIT 1');
    res.status(200).json(rows[0] || {});
  } catch (err) {
    console.error('Fetch Settings Error:', err);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};


// Get all registered users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM tbl_users ORDER BY created_at DESC');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all registered caregivers
exports.getAllCaregivers = async (req, res) => {
  try {
    const [caregivers] = await db.query('SELECT * FROM tbl_caregivers ORDER BY created_at DESC');
    res.status(200).json(caregivers);
  } catch (err) {
    console.error('Error fetching caregivers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateCaregiverStatus = async (req, res) => {
  const { caregiverId, status } = req.body;

  try {
    await db.query('UPDATE tbl_caregivers SET status = ? WHERE id = ?', [status, caregiverId]);
    res.status(200).json({ message: 'Caregiver status updated successfully.' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Failed to update status.' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await db.query('DELETE FROM tbl_users WHERE id = ?', [userId]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Delete Caregiver
exports.deleteCaregiver = async (req, res) => {
  const caregiverId = req.params.id;
  try {
    await db.query('DELETE FROM tbl_caregivers WHERE id = ?', [caregiverId]);
    res.status(200).json({ message: 'Caregiver deleted successfully' });
  } catch (error) {
    console.error('Delete caregiver error:', error);
    res.status(500).json({ message: 'Failed to delete caregiver' });
  }
};

// Get All Kyc 
exports.getAllKYC = async (req, res) => {
  try {
    const [kycRecords] = await db.query(`
      SELECT 
        k.id, 
        k.status,
        k.created_at,
        c.name AS caregiver_name,
        c.email AS caregiver_email
      FROM tbl_caregiver_kyc k
      JOIN tbl_caregivers c ON k.caregiver_id = c.id
      ORDER BY k.created_at DESC
    `);

    res.json({
      success: true,
      data: kycRecords
    });

  } catch (error) {
    console.error('Error fetching KYC records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC records'
    });
  }
};

// Get Kyc details for a caregiver
exports.getKYCDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [kyc] = await db.query(`
      SELECT 
        k.*,
        c.name AS caregiver_name,
        c.email AS caregiver_email,
        c.phone AS caregiver_phone
      FROM tbl_caregiver_kyc k
      JOIN tbl_caregivers c ON k.caregiver_id = c.id
      WHERE k.id = ?
    `, [id]);

    if (!kyc.length) {
      return res.status(404).json({
        success: false,
        message: 'KYC record not found'
      });
    }

    res.json({
      success: true,
      data: kyc[0]
    });

  } catch (error) {
    console.error('Error fetching KYC details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC details'
    });
  }
};

// Update Kyc status and admin Note.
exports.updateKYCStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const [result] = await db.query(`
      UPDATE tbl_caregiver_kyc 
      SET 
        status = ?,
        admin_notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, admin_notes || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'KYC record not found'
      });
    }

    // TODO: Send notification to caregiver here

    res.json({
      success: true,
      message: 'KYC status updated successfully'
    });

  } catch (error) {
    console.error('Error updating KYC status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update KYC status'
    });
  }
};

// Get a caregiver Request
exports.getAllCaregiverRequests = async (req, res) => {
  try {
    const [requests] = await db.query(`
      SELECT cr.*, u.name 
      FROM tbl_caregiver_requests cr
      JOIN tbl_users u ON cr.user_id = u.id
      ORDER BY cr.created_at DESC
    `);
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching all caregiver requests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all support tickets with messages
exports.getAllSupportTickets = async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id AS ticket_id,
        t.subject,
        t.status,
        t.type,
        t.user_type,
        t.user_id,
        t.created_at AS ticket_created_at,
        m.id AS message_id,
        m.message,
        m.sender_type,
        m.created_at AS message_created_at,
        u.name AS user_name,
        c.name AS caregiver_name
      FROM tbl_support_tickets t
      LEFT JOIN tbl_users u ON t.user_type = 'user' AND t.user_id = u.id
      LEFT JOIN tbl_caregivers c ON t.user_type = 'caregiver' AND t.user_id = c.id
      LEFT JOIN tbl_support_messages m ON t.id = m.ticket_id
      ORDER BY t.created_at DESC, m.created_at ASC
    `;

    const [rows] = await db.query(query);

    const ticketsMap = {};

    for (const row of rows) {
      const ticketId = row.ticket_id;

      if (!ticketsMap[ticketId]) {
        const name = row.user_type === 'user' ? row.user_name : row.caregiver_name;
        const displayName = name ? `${name} (${row.user_id})` : `ID ${row.user_id}`;

        ticketsMap[ticketId] = {
          id: ticketId,
          subject: row.subject,
          status: row.status,
          type: row.type,
          user_type: row.user_type,
          user_id: row.user_id,
          user_display: displayName,
          created_at: row.ticket_created_at,
          messages: [],
        };
      }

      if (row.message_id) {
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
    console.error('Error fetching tickets:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Respond to a support ticket
exports.respondToTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { message } = req.body;

  // TEMP: You can replace this with req.admin.id if using auth
  const adminId = 1;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    const insertMessage = `
      INSERT INTO tbl_support_messages (ticket_id, message, sender_type, sender_id)
      VALUES (?, ?, 'admin', ?)
    `;
    await db.query(insertMessage, [ticketId, message, adminId]);

    res.status(201).json({ success: true, message: 'Response sent successfully' });
  } catch (error) {
    console.error('Error responding to ticket:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update ticket status
exports.updateTicketStatus = async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;

  const validStatuses = ['Open', 'Resolved', 'Closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  try {
    const updateQuery = `UPDATE tbl_support_tickets SET status = ? WHERE id = ?`;
    await db.query(updateQuery, [status, ticketId]);
    res.status(200).json({ success: true, message: 'Ticket status updated' });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id AS review_id,
        r.user_id,
        r.user_type,
        r.name,
        r.review,
        r.rating,
        r.is_approved,
        r.created_at,
        u.name AS user_name,
        u.profile_image AS user_image,
        c.name AS caregiver_name,
        c.profile_image AS caregiver_image
      FROM tbl_reviews r
      LEFT JOIN tbl_users u ON r.user_type = 'user' AND r.user_id = u.id
      LEFT JOIN tbl_caregivers c ON r.user_type = 'caregiver' AND r.user_id = c.id
      ORDER BY r.created_at DESC
    `;

    const [rows] = await db.query(query); // 🛠️ FIX: Use array destructuring

    const reviews = rows.map((row) => {
      const name = row.user_type === 'user' ? row.user_name : row.caregiver_name;
      const profile_image = row.user_type === 'user' ? row.user_image : row.caregiver_image;

      return {
        id: row.review_id,
        user_id: row.user_id,
        user_type: row.user_type,
        name: name || row.name,
        review: row.review,
        rating: row.rating,
        is_approved: row.is_approved,
        created_at: row.created_at,
        profile_image,
      };
    });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.approveReview = async (req, res) => {
  const { id } = req.params;
  const { is_approved } = req.body;

  try {
    await db.query(
      'UPDATE tbl_reviews SET is_approved = ? WHERE id = ?',
      [is_approved, id]
    );
    res.status(200).json({ message: 'Review approval updated.' });
  } catch (error) {
    console.error('Error updating review approval:', error);
    res.status(500).json({ message: 'Failed to update review approval.' });
  }
};
