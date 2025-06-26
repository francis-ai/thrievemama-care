const db = require('../config/db');
const bcrypt = require('bcryptjs');


// GET caregiver profile by ID
exports.getCaregiverProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM tbl_caregivers WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'caregiver not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching caregiver profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE caregiver profile
exports.updateProfile = async (req, res) => {
  const { name, phone, gender, address, caregiver_id } = req.body;
  const profile_image = req.file ? req.file.filename : null;

  if (!caregiver_id) {
    return res.status(400).json({ success: false, message: 'caregiver ID is required.' });
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

    params.push(caregiver_id); // Where clause value

    const [result] = await db.query(
      `UPDATE tbl_caregivers SET ${updateFields.join(', ')} WHERE id = ?`,
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
    const [caregivers] = await db.query('SELECT * FROM tbl_caregivers WHERE id = ?', [id]);

    if (caregivers.length === 0) {
      return res.status(404).json({ message: 'caregiver not found.' });
    }

    const caregiver = caregivers[0];

    const isMatch = await bcrypt.compare(currentPassword, caregiver.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE tbl_caregivers SET password = ? WHERE id = ?', [hashedPassword, id]);

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error while changing password.' });
  }
};

exports.getCaregiverKYCStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [kyc] = await db.query(
      `SELECT status FROM tbl_caregivers WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!kyc.length) {
      return res.status(200).json({ 
        success: true,
        status: 'Not Submitted'
      });
    }

    res.json({
      success: true,
      status: kyc[0].status,
      // lastUpdated: kyc[0].updated_at
    });

  } catch (error) {
    console.error('KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC status'
    });
  }
};

// Submit KYC
exports.submitKYC = async (req, res) => {
  const { caregiver_id } = req.body;
  
  if (!caregiver_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Caregiver ID is required' 
    });
  }

  try {
    // File paths from upload middleware
    const files = {
      id_card: req.files?.id_card?.[0]?.filename || null,
      proof_of_address: req.files?.proof_of_address?.[0]?.filename || null,
      guarantor1_doc: req.files?.guarantor1_doc?.[0]?.filename || null,
      guarantor2_doc: req.files?.guarantor2_doc?.[0]?.filename || null
    };

    // Prepare KYC data
    const kycData = {
      caregiver_id,
      home_address: req.body.home_address,
      nin: req.body.nin,
      id_card_path: files.id_card,
      proof_of_address_path: files.proof_of_address,
      guarantor1_name: req.body.guarantor1_name,
      guarantor1_phone: req.body.guarantor1_phone,
      guarantor1_email: req.body.guarantor1_email,
      guarantor1_relationship: req.body.guarantor1_relationship,
      guarantor1_document_path: files.guarantor1_doc,
      guarantor2_name: req.body.guarantor2_name,
      guarantor2_phone: req.body.guarantor2_phone,
      guarantor2_email: req.body.guarantor2_email,
      guarantor2_relationship: req.body.guarantor2_relationship,
      guarantor2_document_path: files.guarantor2_doc,
      status: 'Pending'
    };

    // Insert into database
    const [result] = await db.query(
      `INSERT INTO tbl_caregiver_kyc SET ?`,
      [kycData]
    );

    res.status(201).json({
      success: true,
      message: 'KYC submitted successfully',
      kyc_id: result.insertId
    });

  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit KYC'
    });
  }
};

// Get KYC 
exports.getKYCStatus = async (req, res) => {
  const { caregiver_id } = req.params;

  try {
    const [kyc] = await db.query(
      `SELECT status, admin_notes, created_at, updated_at 
       FROM tbl_caregiver_kyc 
       WHERE caregiver_id = ?`,
      [caregiver_id]
    );

    if (!kyc.length) {
      return res.status(404).json({
        success: false,
        message: 'No KYC record found'
      });
    }

    res.json({
      success: true,
      data: kyc[0]
    });

  } catch (error) {
    console.error('KYC fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC status'
    });
  }
};

exports.updateKYCByCaregiverId = async (req, res) => {
  const { caregiver_id } = req.params;
  const updates = req.body;

  try {
    // File handling
    if (req.files) {
      if (req.files.id_card) updates.id_card_path = req.files.id_card[0].filename;
      if (req.files.proof_of_address) updates.proof_of_address_path = req.files.proof_of_address[0].filename;
      if (req.files.guarantor1_doc) updates.guarantor1_document_path = req.files.guarantor1_doc[0].filename;
      if (req.files.guarantor2_doc) updates.guarantor2_document_path = req.files.guarantor2_doc[0].filename;
    }

    // Always set status to Pending when resubmitting
    updates.status = 'Pending';

    const [result] = await db.query(
      `UPDATE tbl_caregiver_kyc SET ? WHERE caregiver_id = ?`,
      [updates, caregiver_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No KYC record found for this caregiver'
      });
    }

    res.json({
      success: true,
      message: 'KYC resubmitted successfully'
    });

  } catch (error) {
    console.error('KYC update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update KYC'
    });
  }
};

// Get All Caregiver Request
exports.getAllRequests = async (req, res) => {
  try {
    const [requests] = await db.query(`
      SELECT cr.*, u.name 
      FROM tbl_caregiver_requests cr
      JOIN tbl_users u ON cr.user_id = u.id
      WHERE cr.status = 'Open'
      ORDER BY cr.created_at DESC
    `);
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching all caregiver requests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Show interest
exports.showInterest = async (req, res) => {
  const { caregiverId, requestId } = req.body;

  if (!caregiverId || !requestId) {
    return res.status(400).json({ success: false, message: 'Missing caregiverId or requestId' });
  }

  try {
    await db.query(`
      INSERT INTO tbl_caregiver_interests (caregiver_id, request_id, interested)
      VALUES (?, ?, TRUE)
      ON DUPLICATE KEY UPDATE interested = TRUE, updated_at = CURRENT_TIMESTAMP
    `, [caregiverId, requestId]);

    res.status(200).json({ success: true, message: 'Interest shown successfully' });
  } catch (error) {
    console.error('Error showing interest:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Unshow interest
exports.unshowInterest = async (req, res) => {
  const { caregiverId, requestId } = req.body;

  if (!caregiverId || !requestId) {
    return res.status(400).json({ success: false, message: 'Missing caregiverId or requestId' });
  }

  try {
    await db.query(`
      UPDATE tbl_caregiver_interests
      SET interested = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE caregiver_id = ? AND request_id = ?
    `, [caregiverId, requestId]);

    res.status(200).json({ success: true, message: 'Interest removed successfully' });
  } catch (error) {
    console.error('Error unshowing interest:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get caregiver's interested requests
exports.getMyInterests = async (req, res) => {
  const caregiverId = req.params.caregiverId;

  try {
    const [interests] = await db.query(`
      SELECT ci.*, cr.service, cr.duration, cr.offer_amount, cr.age_group, cr.address
      FROM tbl_caregiver_interests ci
      JOIN tbl_caregiver_requests cr ON ci.request_id = cr.id
      WHERE ci.caregiver_id = ? AND ci.interested = TRUE
    `, [caregiverId]);

    res.status(200).json({ success: true, interests });
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get All Reviews from users
exports.getAllReviewsForCaregiver = async (req, res) => {
  const { caregiverId } = req.params;

  try {
    const [reviews] = await db.query(`
      SELECT r.*, u.name AS user_name
      FROM tbl_caregiver_reviews r
      LEFT JOIN tbl_users u ON r.user_id = u.id
      WHERE caregiver_id = ?
      ORDER BY r.created_at DESC
    `, [caregiverId]);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching caregiver reviews:', error);
    res.status(500).json({ message: 'Server error fetching caregiver reviews' });
  }
};