# Job Portal Deployment Guide

This guide will help you deploy your full-stack job portal application to production.

## Prerequisites

1. **GitHub Account** - To store your code
2. **MongoDB Atlas Account** - For cloud database
3. **Cloudinary Account** - For image uploads
4. **Deployment Accounts** - Choose from:
   - **Vercel** (frontend) + **Railway** (backend) ✅ Recommended
   - **Netlify** (frontend) + **Render** (backend)
   - **Heroku** (full-stack)

## Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Push to GitHub**:
```bash
git remote add origin https://github.com/yourusername/jobportal.git
git push -u origin main
```

## Step 2: Set Up Database (MongoDB Atlas)

1. **Create MongoDB Atlas Account**: https://www.mongodb.com/atlas
2. **Create a Cluster** (free tier available)
3. **Create Database User**:
   - Go to Database Access → Add New Database User
   - Choose username/password authentication
   - Save credentials for later
4. **Configure Network Access**:
   - Go to Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere) for production
5. **Get Connection String**:
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Step 3: Deploy Backend

### Option A: Railway (Recommended)

1. **Visit**: https://railway.app
2. **Sign up** with GitHub
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select your repository** → **Select backend folder**
5. **Configure Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET_KEY=your_super_secret_jwt_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
6. **Deploy** and **copy the deployment URL**

### Option B: Render

1. **Visit**: https://render.com
2. **Sign up** with GitHub
3. **New Web Service** → **Connect GitHub repo**
4. **Configure**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. **Add Environment Variables** (same as above)
6. **Deploy** and **copy the deployment URL**

## Step 4: Configure Frontend for Production

1. **Update environment variables**:
   - Create `.env.production` in frontend directory:
   ```
   VITE_API_BASE_URL=https://your-backend-deployment-url.railway.app
   ```

2. **Rebuild frontend**:
```bash
cd frontend
npm run build
```

## Step 5: Deploy Frontend

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel --prod
```

3. **Follow prompts**:
   - Connect to GitHub
   - Configure project settings
   - Set environment variables in Vercel dashboard

### Option B: Netlify

1. **Visit**: https://www.netlify.com
2. **Sign up** with GitHub
3. **New site from Git** → **Choose repository**
4. **Configure**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. **Set Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-deployment-url
   ```

### Option C: Manual Deployment

1. **Build the frontend**:
```bash
cd frontend
npm run build
```

2. **Upload `dist` folder** to any static hosting service:
   - **GitHub Pages**
   - **Firebase Hosting**
   - **AWS S3 + CloudFront**

## Step 6: Update CORS Configuration

Once your frontend is deployed, update your backend's CORS configuration:

1. **Set FRONTEND_URL environment variable** in your backend deployment:
   ```
   FRONTEND_URL=https://your-frontend-deployment-url.vercel.app
   ```

2. **Or update the CORS code** in `backend/index.js` to include your specific domain.

## Step 7: Test Your Deployment

1. **Visit your frontend URL**
2. **Test key functionality**:
   - User registration/login
   - Job posting (admin)
   - Job application
   - File uploads
   - All API endpoints

## Environment Variables Summary

### Backend (.env)
```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal
JWT_SECRET_KEY=your_super_secret_jwt_key_minimum_32_characters
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env.production)
```
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure FRONTEND_URL is set correctly in backend
   - Check CORS configuration in `backend/index.js`

2. **API Connection Issues**:
   - Verify VITE_API_BASE_URL in frontend
   - Check if backend is running and accessible

3. **Database Connection**:
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas

4. **Environment Variables**:
   - Ensure all required variables are set
   - Check variable names (case-sensitive)

5. **File Upload Issues**:
   - Verify Cloudinary credentials
   - Check file size limits

## Security Checklist

- [ ] Change default JWT secret
- [ ] Restrict CORS to specific domains
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Use HTTPS for production
- [ ] Validate and sanitize user inputs
- [ ] Implement rate limiting
- [ ] Keep dependencies updated

## Performance Optimization

- [ ] Enable compression in backend
- [ ] Implement caching strategies
- [ ] Optimize database queries
- [ ] Use CDN for static assets
- [ ] Implement lazy loading in frontend
- [ ] Minify and compress assets

## Monitoring and Maintenance

1. **Set up monitoring**:
   - Application performance monitoring
   - Error tracking (e.g., Sentry)
   - Database monitoring

2. **Regular maintenance**:
   - Update dependencies
   - Monitor resource usage
   - Backup database regularly
   - Monitor application logs

## Scaling Considerations

- **Database**: Consider MongoDB Atlas clusters for scaling
- **Backend**: Use load balancers and multiple instances
- **Frontend**: Use CDN for global distribution
- **Images**: Optimize Cloudinary settings
- **Caching**: Implement Redis for session storage

---

🎉 **Congratulations!** Your job portal is now deployed and ready for production use.

For support or questions, refer to the documentation of each service used in your deployment.
