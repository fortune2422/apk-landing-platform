const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const { uploadToGithub } = require('../services/githubUpload');

const DATA_DIR = path.join(__dirname, '..', 'data');
const APKS_FILE = path.join(DATA_DIR, 'apks.json');
if (!fs.existsSync(APKS_FILE)) fs.writeFileSync(APKS_FILE, JSON.stringify([]));

router.post('/upload', async (req, res) => {
  const form = formidable({ multiples: false, uploadDir: path.join(__dirname, '..', 'public', 'uploads'), keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload error' });
    if (!files.apk) return res.status(400).json({ error: 'No apk uploaded' });
    const file = files.apk;
    const filename = path.basename(file.path);

    const apks = JSON.parse(fs.readFileSync(APKS_FILE));
    const id = 'apk_' + Date.now();
    const record = {
      id,
      name: fields.name || filename,
      channel: fields.channel || 'default',
      local_path: `/uploads/${filename}`,
      github_url: null,
      version: fields.version || '',
      uploaded_at: new Date().toISOString()
    };

    if (process.env.GITHUB_TOKEN && process.env.REPO_OWNER && process.env.REPO_NAME) {
      try {
        const tag = fields.tag || ('v' + Date.now());
        const browserUrl = await uploadToGithub(tag, file.path);
        record.github_url = browserUrl;
      } catch (e) {
        console.error('Github upload failed', e.message);
      }
    }

    apks.push(record);
    fs.writeFileSync(APKS_FILE, JSON.stringify(apks, null, 2));
    res.json({ success: true, apk: record });
  });
});

router.get('/list', (req, res) => {
  const apks = JSON.parse(fs.readFileSync(APKS_FILE));
  res.json(apks);
});

module.exports = router;
