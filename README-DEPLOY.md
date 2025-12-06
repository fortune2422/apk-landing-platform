# Deploy instructions (short)

1. Create a GitHub repo and push this project.
2. Backend (Render Web Service):
   - Build command: `npm install`
   - Start command: `node server.js`
   - ENV: `GITHUB_TOKEN`, `REPO_OWNER`, `REPO_NAME`, `JWT_SECRET`, `ADMIN_PASSWORD`
3. Landing (Render Static Site):
   - Point to `landing/dist`
