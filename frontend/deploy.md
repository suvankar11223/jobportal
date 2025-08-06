# Quick Deployment Commands

## 🚀 Ready to Deploy? Follow These Steps:

### 1. Backend Deployment (Railway - Recommended)

1. **Visit Railway**: https://railway.app
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub**
4. **Select** your repository
5. **Choose** the `backend` folder
6. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET_KEY=your_secret_key_32_chars_minimum
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
7. **Deploy** and **copy the URL**

### 2. Frontend Deployment (Vercel - Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend** and **deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Follow the prompts**:
   - Connect to GitHub
   - Set project name
   - Add environment variable: `VITE_API_BASE_URL=your_backend_url`

### 3. Alternative: Netlify for Frontend

1. **Visit**: https://app.netlify.com
2. **New site from Git**
3. **Choose repository**
4. **Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `frontend`
5. **Environment variables**: `VITE_API_BASE_URL=your_backend_url`

### 4. Update Backend CORS

After frontend deployment, add this to your backend environment:
```
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## ✅ Your app is now live!

Test all features:
- User registration/login
- Job posting
- Job applications
- File uploads

## 🔧 Need Help?

Check the full `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
