const axios = require('axios');
const fs = require('fs');

async function uploadToGithub(tag, filePath) {
  const token = process.env.GITHUB_TOKEN;
  const repoOwner = process.env.REPO_OWNER;
  const repoName = process.env.REPO_NAME;
  if (!token || !repoOwner || !repoName) throw new Error('Missing GitHub env');

  const releaseRes = await axios.post(
    `https://api.github.com/repos/${repoOwner}/${repoName}/releases`,
    { tag_name: tag, name: tag },
    { headers: { Authorization: `token ${token}`, 'Accept': 'application/vnd.github+json' } }
  );

  let uploadUrl = releaseRes.data.upload_url.replace('{?name,label}', '');
  const file = fs.readFileSync(filePath);
  const fileName = filePath.split('/').pop();

  const uploadRes = await axios.post(
    `${uploadUrl}?name=${encodeURIComponent(fileName)}`,
    file,
    { headers: { Authorization: `token ${token}`, 'Content-Type': 'application/vnd.android.package-archive' } }
  );

  return uploadRes.data.browser_download_url;
}

module.exports = { uploadToGithub };
