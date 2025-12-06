const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LAND_FILE = path.join(DATA_DIR, 'landings.json');
if (!fs.existsSync(LAND_FILE)) fs.writeFileSync(LAND_FILE, JSON.stringify([]));

router.post('/create', (req, res) => {
  const body = req.body;
  const id = uuid().slice(0,6);
  const templatePath = path.join(__dirname, '..', 'landing', 'templates', (body.theme || 'default') + '.html');
  let tpl = fs.readFileSync(templatePath, 'utf-8');

  const page = tpl
    .replace(/{{title}}/g, body.title || '')
    .replace(/{{subtitle}}/g, body.subtitle || '')
    .replace(/{{description}}/g, body.description || '')
    .replace(/{{icon}}/g, body.icon || '')
    .replace(/{{apk_url}}/g, body.apk_url || '')
    .replace(/{{button_text}}/g, body.button_text || 'Download')
    .replace(/{{screenshots}}/g, (body.screenshots||[]).map(s => `<img src="${s}" class="ss"/>`).join('\n'));

  const outDir = path.join(__dirname, '..', 'landing', 'dist', id);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), page);

  const records = JSON.parse(fs.readFileSync(LAND_FILE));
  const record = Object.assign({ id, created_at: new Date().toISOString() }, body);
  records.push(record);
  fs.writeFileSync(LAND_FILE, JSON.stringify(records, null, 2));

  res.json({ success: true, url: `/lp/${id}`, id });
});

router.get('/list', (req, res) => {
  const records = JSON.parse(fs.readFileSync(LAND_FILE));
  res.json(records);
});

module.exports = router;
