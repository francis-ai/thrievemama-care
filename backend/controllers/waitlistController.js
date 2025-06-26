const db = require('../config/db');

exports.joinWaitlist = async (req, res) => {
  const { name, email } = req.body;

  try {
    const sql = 'INSERT INTO tbl_waiting_list (name, email) VALUES (?, ?)';
    await db.query(sql, [name, email]);

    res.status(201).json({ message: 'Successfully joined the waitlist' });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
