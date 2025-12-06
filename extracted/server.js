const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// ensure directories
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// static
app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/lp', express.static(path.join(__dirname, 'landing', 'dist')));

// routes
app.use('/auth', require('./routes/auth'));
app.use('/apk', require('./routes/apk'));
app.use('/landing', require('./routes/landing'));
app.use('/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Backend running on port', PORT));
