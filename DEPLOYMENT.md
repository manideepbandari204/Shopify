# Deployment Guide

## Frontend Deployment (Vercel)

### Steps:
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select the `frontend` directory as the root directory
5. Add Environment Variables:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://shopify-backend.onrender.com/api`)
6. Click "Deploy"

### Configuration:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

---

## Backend Deployment (Render)

### Steps:
1. Go to [render.com](https://render.com) and sign up/login with GitHub
2. Click "New +" → "Web Service"
3. Select your GitHub repository
4. Configure the service:
   - **Name**: shopify-backend (or your preferred name)
   - **Branch**: main
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: production
6. Click "Create Web Service"

### MongoDB Setup:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user and get the connection string
4. Use this connection string in your Render environment variables

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopify?retryWrites=true&w=majority
NODE_ENV=production
```

### Frontend (.env.local for development)
```
VITE_API_URL=http://localhost:5000/api
```

### Frontend (Production on Vercel)
```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

---

## Deployment Checklist

- [ ] Git repository initialized and pushed to GitHub
- [ ] `.gitignore` file configured
- [ ] MongoDB Atlas cluster created
- [ ] Backend environment variables set in Render
- [ ] Frontend environment variables set in Vercel
- [ ] Backend deployment verified (test API endpoints)
- [ ] Frontend deployment verified (check API calls work)

---

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure your backend has the correct CORS configuration. Update `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### Build Failures
- Check that all dependencies are in `package.json`
- Ensure build commands are correct in Vercel configuration
- Check logs in Vercel/Render dashboards for specific errors

### API Connection Issues
- Verify the `VITE_API_URL` matches your backend URL exactly
- Check that backend is running and accessible
- Verify environment variables are set correctly

---

## Post-Deployment

1. Test all API endpoints in production
2. Monitor logs in Vercel and Render dashboards
3. Set up automatic deployments on git push
4. Consider adding error tracking (Sentry, LogRocket, etc.)
