const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure default admin user
function ensureUser() {
  if (!fs.existsSync(USERS_FILE)) {
    const adminPass = process.env.ADMIN_PASSWORD || '123456';
    const hashed = bcrypt.hashSync(adminPass, 8);
    const users = [{ id: 1, username: 'admin', password: hashed }];
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
}
ensureUser();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '8h' });
  res.json({ token });
});

module.exports = router;
