# CUSB Fullstack Deployment Guide

This guide provides step-by-step instructions to deploy the CUSB application to:
- **Frontend**: Netlify
- **Backend**: Render
- **Database**: MongoDB Atlas

## Prerequisites

- GitHub account (to push code)
- MongoDB Atlas account (free tier available)
- Netlify account
- Render account

---

## Step 1: Setup MongoDB Atlas Database

### 1.1 Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click "Create" → "New Project"
4. Name it "cusb-production" (or similar)
5. Click "Create Project"

### 1.2 Create a Cluster

1. Click "Create" → "Clusters" (choose Free tier M0)
2. Select provider region closest to your users
3. Click "Create Cluster"
4. Wait for cluster to initialize (~5 minutes)

### 1.3 Create Database User

1. Go to "Database Access" section
2. Click "Add New Database User"
3. Enter username: `cusb_admin`
4. Generate secure password (or use: `$(openssl rand -base64 32)`)
5. Set Database User Privileges to "Read and write to any database"
6. Click "Create Database User"
7. **Save the username and password** - you'll need it for connection string

### 1.4 Whitelist IP Address

1. Go to "Network Access"
2. Click "Add IP Address"
3. Add: `0.0.0.0/0` (allows access from anywhere - for Render)
   - Alternative: Add Render's IP after deployment
4. Click "Confirm"

### 1.5 Get Connection String

1. Go back to "Clusters"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js"
5. Copy the connection string
6. Replace `<username>` and `<password>` with your database user credentials
7. Replace `cusb_db` with your database name
8. **Save this connection string** - it looks like:
   ```
   mongodb+srv://cusb_admin:YourSecurePassword@cluster0.xxxxx.mongodb.net/cusb_db
   ```

---

## Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub

1. Create a new GitHub repository
2. Push your backend code:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin https://github.com/YOUR-USERNAME/cusb-backend.git
   git push -u origin main
   ```

### 2.2 Create Render Web Service

1. Go to [Render](https://render.com)
2. Sign up or log in
3. Click "New +" → "Web Service"
4. Connect your GitHub account
5. Select the `cusb-backend` repository
6. Fill in the form:
   - **Name**: `cusb-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or upgrade as needed)

### 2.3 Add Environment Variables

In Render's environment variables section, add:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://cusb_admin:YourSecurePassword@cluster0.xxxxx.mongodb.net/cusb_db
JWT_SECRET=<generate-strong-32-char-string>
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
CORS_ORIGIN=https://your-netlify-domain.netlify.app
```

**To generate JWT_SECRET**, run in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Once deployed, Render shows your backend URL like:
   ```
   https://cusb-backend.onrender.com
   ```
4. **Save this URL** - you'll need it for frontend configuration

### 2.5 Test Backend

Visit: `https://cusb-backend.onrender.com/api/health`

Should return: `{"status":"OK","time":"..."}`

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Update Frontend Configuration

In your `frontend/config.js`, ensure it has placeholders for environment variables. The build script will populate these.

### 3.2 Push Frontend Code

1. Create another GitHub repository for frontend:
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial frontend commit"
   git remote add origin https://github.com/YOUR-USERNAME/cusb-frontend.git
   git push -u origin main
   ```

### 3.3 Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your frontend repository
4. Fill in build settings:
   - **Build Command**: `node build-config.js`
   - **Publish Directory**: `frontend`

### 3.4 Add Environment Variables

In Netlify's environment variables, add:

```env
API_BASE_URL=https://cusb-backend.onrender.com/api
UPLOAD_BASE_URL=https://cusb-backend.onrender.com
```

### 3.5 Deploy

1. Click "Deploy site"
2. Wait for deployment (2-5 minutes)
3. Netlify generates a URL like:
   ```
   https://your-site-name.netlify.app
   ```

---

## Step 4: Update Backend CORS

Now that you have your Netlify frontend URL:

1. Go back to Render dashboard
2. Click your `cusb-backend` service
3. Go to Environment
4. Update `CORS_ORIGIN` to your Netlify URL:
   ```
   CORS_ORIGIN=https://your-site-name.netlify.app
   ```
5. Save and redeploy

---

## Step 5: Verify Deployment

### 5.1 Test Frontend

1. Visit your Netlify URL
2. Check browser console (F12) for any errors
3. Test API calls:
   - Try logging in with admin credentials
   - Check if notices/events load from backend
   - Upload a file and verify it appears

### 5.2 Test Backend

1. Visit `https://cusb-backend.onrender.com/api/health`
2. Should return status OK
3. Check Render logs for any errors:
   - Go to your service in Render
   - Click "Logs" tab
   - Look for errors

### 5.3 Test Database

1. In MongoDB Atlas, go to "Collections"
2. Should see your database with tables:
   - `admins`
   - `events`
   - `notices`
   - `faculty`
   - `gallery`
   - `announcements`
   - `contacts`

---

## Troubleshooting

### Frontend shows "Cannot reach API"

- Check that `API_BASE_URL` in Netlify matches your Render backend URL
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for CORS errors
- Verify `CORS_ORIGIN` in Render matches your Netlify URL

### Uploads don't persist

- Render's free tier has ephemeral storage (files deleted on restart)
- Consider upgrading to Render's paid tier or using cloud storage (AWS S3, Cloudinary)
- For now, uploads will persist until the service restarts

### MongoDB connection fails

- Verify connection string in Render's environment variables
- Check that IP address is whitelisted in MongoDB Atlas
- Verify username and password are correct
- Ensure database name matches (cusb_db)

### Build fails

- Check Render/Netlify logs for specific error messages
- Ensure all dependencies are listed in `package.json`
- Verify environment variables are set correctly

---

## Environment Variables Reference

### Backend (.env for Render)

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `production` | Deployment environment |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster...` | MongoDB Atlas connection |
| `JWT_SECRET` | `abc123xyz...` | 32-character random string |
| `JWT_EXPIRE` | `7d` | Token expiration time |
| `UPLOAD_PATH` | `./uploads` | Local uploads directory |
| `MAX_FILE_SIZE` | `10485760` | Max file size (10MB) |
| `CORS_ORIGIN` | `https://your-site.netlify.app` | Allowed frontend domain |

### Frontend (Netlify environment)

| Variable | Example | Description |
|----------|---------|-------------|
| `API_BASE_URL` | `https://cusb-backend.onrender.com/api` | Backend API base URL |
| `UPLOAD_BASE_URL` | `https://cusb-backend.onrender.com` | Backend upload base URL |

---

## Scaling & Upgrades

### When to Upgrade

- **Render**: Upgrade from Free to Starter if backend needs persistence
- **MongoDB**: Upgrade from Free M0 to M2 for more storage/performance
- **Netlify**: Usually free tier is sufficient; upgrade for team features

### Domain Setup

1. Buy a domain (GoDaddy, Namecheap, etc.)
2. **For Netlify**: Add domain in Netlify → Domain settings → Add domain
3. **For Render**: Update backend domain settings

---

## Useful Commands

```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test backend locally
npm start

# Test frontend locally
# Open frontend/index.html in browser with http-server
npx http-server frontend

# View Render logs
# Use Render dashboard Logs tab

# View Netlify logs
# Use Netlify dashboard Deploys section
```

---

## Security Best Practices

✅ **Done**
- JWT_SECRET is random and secure
- CORS restricted to specific frontend domain
- MongoDB user has limited permissions
- Environment variables don't commit to git

⚠️ **Consider**
- Use HTTPS only (both platforms do this by default)
- Regularly rotate JWT_SECRET
- Monitor upload file types and sizes
- Implement rate limiting for API
- Use environment-specific database backups

---

## Support & Documentation

- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Express.js Docs](https://expressjs.com)

---

## Next Steps

1. ✅ Complete all deployment steps above
2. ✅ Test all functionality on production
3. ✅ Monitor logs for any issues
4. ⏳ Set up regular MongoDB backups
5. ⏳ Consider implementing analytics/monitoring
6. ⏳ Plan for scaling as traffic grows
