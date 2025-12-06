const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, '..', 'data', 'clicks.json');
if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, JSON.stringify([]));

router.post('/click', (req, res) => {
  const { landing_id, apk_url } = req.body;
  const logs = JSON.parse(fs.readFileSync(LOG_FILE));
  logs.push({ landing_id, apk_url, ts: new Date().toISOString() });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null,2));
  res.json({ success: true });
});

module.exports = router;
