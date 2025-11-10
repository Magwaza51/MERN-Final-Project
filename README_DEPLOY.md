# HealthTracker Deployment Guide

## Overview
This guide covers deploying the HealthTracker MERN stack application using:
- **Vercel** for React frontend
- **Render** for Node.js backend
- **PM2** for VPS deployment (alternative)

## Prerequisites
- GitHub account with this project repository
- Vercel account (free tier available)
- Render account (free tier available)
- MongoDB Atlas database
- VPS (for PM2 option) with SSH access

---

## Part 1: Deploy Backend on Render

### Step 1: Sign up and Create Web Service

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub account and select this repository
4. Configure service:
   - **Environment**: Node
   - **Region**: Choose closest to your users
   - **Branch**: main (or your default branch)
   - **Root Directory**: `backend` (if monorepo structure)

### Step 2: Configure Build Settings

Set these in the Render dashboard:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
node server.js
```

### Step 3: Set Environment Variables

In Render dashboard → Environment tab, add:

| Key | Value | Example |
|-----|-------|---------|
| `MONGO_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0.mongodb.net/healthtracker?retryWrites=true&w=majority` |
| `JWT_SECRET` | Random 32+ character string | `your_super_secret_jwt_key_here_32_chars_min` |
| `NODE_ENV` | production | `production` |
| `PORT` | (Optional - Render sets this automatically) | `5000` |

**Generate JWT Secret:**
```bash
# Use this command to generate a secure secret
openssl rand -hex 32
```

### Step 4: Deploy and Monitor

1. Click **"Create Web Service"**
2. Monitor the deploy logs in real-time
3. Once deployed, copy the service URL (e.g., `https://your-app-name.onrender.com`)

**Troubleshooting Common Issues:**
- **Build fails**: Check Node.js version in `package.json` engines field
- **MongoDB connection fails**: Verify connection string and IP whitelist in Atlas
- **App crashes**: Check Live Logs for detailed error messages

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Configure Environment Variables

Create `.env.local` in the `frontend/` directory:

```bash
# Frontend environment variables
REACT_APP_API_URL=https://your-backend-app.onrender.com
REACT_APP_SERVER_URL=https://your-backend-app.onrender.com
```

**Replace `your-backend-app.onrender.com` with your actual Render service URL**

### Step 4: Deploy to Vercel

Navigate to frontend directory and deploy:

```bash
cd frontend
vercel --prod
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No (for first deploy)
- **Project name**: healthtracker-frontend (or your preference)
- **Directory**: `./` (current directory)
- **Override settings**: No (unless you need custom build commands)

### Step 5: Set Environment Variables in Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the same variables from your `.env.local`:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://your-backend-app.onrender.com` |
| `REACT_APP_SERVER_URL` | `https://your-backend-app.onrender.com` |

5. Redeploy to apply the new environment variables:

```bash
vercel --prod
```

---

## Part 3: Alternative VPS Deployment with PM2

### Prerequisites
- VPS with Ubuntu/Debian (2GB+ RAM recommended)
- SSH access
- Domain name (optional)

### Step 1: Prepare VPS Environment

```bash
# SSH into your VPS
ssh username@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

# Verify installation
node --version
npm --version
```

### Step 2: Install PM2

```bash
sudo npm install -g pm2
```

### Step 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/your-repo-name.git /var/www/healthtracker
cd /var/www/healthtracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies and build
cd ../frontend
npm install
npm run build

# Copy built frontend to backend public folder (if serving from same server)
sudo cp -r build/* ../backend/public/
```

### Step 4: Configure Environment Variables

```bash
cd /var/www/healthtracker/backend

# Create .env file (never commit this!)
sudo nano .env
```

Add to `.env`:
```bash
MONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net/healthtracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_32_chars_min
NODE_ENV=production
PORT=5000
```

### Step 5: Start with PM2

Using the included `ecosystem.config.js`:

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Generate startup script
pm2 startup

# Run the generated command (it will show you the exact command to run)
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

### Step 6: Monitor Application

```bash
# Check application status
pm2 status

# View logs
pm2 logs mern-app

# Real-time monitoring
pm2 monit

# Restart application
pm2 restart mern-app
```

### Step 7: Configure Nginx (Optional - for HTTPS/Domain)

```bash
# Install Nginx
sudo apt install nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/healthtracker
```

Add to configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/healthtracker /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# Install SSL with Certbot (optional)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## Part 4: Testing Deployment

### End-to-End Testing Checklist

1. **Frontend Accessibility**
   - [ ] Vercel URL loads correctly
   - [ ] All pages navigate properly
   - [ ] UI components render correctly

2. **Backend Connectivity**
   - [ ] API endpoints respond
   - [ ] Database connections work
   - [ ] Authentication flow works

3. **Full Stack Integration**
   - [ ] User registration works
   - [ ] User login works
   - [ ] Health data CRUD operations work
   - [ ] Real-time features work (if applicable)

### Test Commands

```bash
# Test backend health endpoint
curl https://your-backend-app.onrender.com/api/health

# Test frontend build locally
cd frontend
npm run build
npx serve -s build

# Test API calls from frontend
# Open browser developer tools and check Network tab
```

### Common Issues and Solutions

**CORS Errors:**
- Ensure backend has proper CORS configuration for your Vercel domain
- Add Vercel domain to allowed origins in backend

**Environment Variables Not Working:**
- Verify variables are set in both local `.env.local` and Vercel dashboard
- Check variable names have `REACT_APP_` prefix for frontend

**Build Failures:**
- Check Node.js versions match between local and deployment
- Verify all dependencies are in `package.json`
- Check for missing environment variables during build

**Database Connection Issues:**
- Verify MongoDB Atlas connection string
- Check IP whitelist (0.0.0.0/0 for Render/Vercel)
- Ensure database user has proper permissions

---

## Production Optimization Tips

1. **Security:**
   - Use strong JWT secrets (32+ characters)
   - Enable HTTPS (automatic on Vercel/Render)
   - Implement rate limiting
   - Add helmet.js for security headers

2. **Performance:**
   - Enable Gzip compression
   - Use CDN for static assets
   - Implement caching strategies
   - Optimize database queries

3. **Monitoring:**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor application performance
   - Set up health checks
   - Configure alerts for downtime

4. **Scaling:**
   - Use Render's auto-scaling features
   - Implement database indexing
   - Consider Redis for session storage
   - Use load balancers for high traffic

---

## Deployment URLs Structure

After successful deployment, you'll have:

- **Frontend (Vercel)**: `https://your-app-name.vercel.app`
- **Backend (Render)**: `https://your-backend-app.onrender.com`
- **VPS (if used)**: `https://your-domain.com` or `http://your-server-ip:5000`

Remember to update all environment variables with the correct production URLs!