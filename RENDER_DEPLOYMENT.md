# Cost of Travel - Single Server Render Deployment Guide

This guide details how to deploy both the Next.js frontend and Express backend on a single **Render Web Service (Node.js)** instance.

## Why a Single Server?
Render exposes a single port per Web Service. By turning Next.js into a static export (`output: 'export'`) and placing the build bundle in Express, we run the entire application cleanly off of one unified Node.js backend. This saves infrastructure costs and simplifies routing.

## 1. Create a New Web Service in Render
1. Go to the Render dashboard and create a new **Web Service**.
2. Connect your Git repository containing the `'CostOfTravel'` folder.
3. If your repository root is inside a folder, configure the **Root Directory** setting to the folder containing this `package.json` (e.g., `CostOfTravel/` or leave empty if `package.json` is at the repo root).

## 2. Configure Service Details
Set the following settings for the deployment environment:
* **Environment:** `Node`
* **Build Command:** `npm install && npm run build`
* **Start Command:** `npm start`

## 3. Environment Variables
Add the following in the **Environment** tab:
* `NODE_ENV` = `production`
* `PORT` = `10000` (Optional, Render automatically provides `$PORT`)
* Ensure any custom backend secrets (e.g., `.env` variable keys) are also mapped here.

## 4. How the Build Works
1. `npm install` installs dependencies in the root, `frontend`, and `backend` folders using the `prefix` arguments.
2. `npm run build` triggers two parallel builds:
   * Next.js compiles the frontend statically into `frontend/out`.
   * TypeScript compiles the backend into `backend/dist`.
3. `npm start` runs `node dist/index.js` in the backend. 
4. The Express server bootstraps, attaches API routes to `/api`, and then attaches standard Express Static serving to map `../frontend/out` to wildcard routes!

## 5. Deployment
Click **Save Changes** and monitor the build logs! Your site will now be fully operational on Render with zero CORS issues since the API and Frontend share the same origin.
