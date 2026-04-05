# Deployment Guide

## Overview

This project is split into:

- `frontend/`: React + Vite app
- `backend/`: Express API server
- `dist/`: Production frontend build output

In development, the Express server starts Vite in middleware mode.
In production, the Express server serves the built files from `dist/`.

## Required environment variables

Set these in your deployment platform's environment or secrets manager:

- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `APP_URL`
- `NODE_ENV=production`

Use `.env.example` as the template for local development.

## Local verification

1. Install dependencies:
   `npm install`
2. Create `.env` from `.env.example`
3. Start the app:
   `npm run dev`
4. Open:
   `http://localhost:3000`

## Production build

1. Install dependencies:
   `npm install`
2. Build the frontend:
   `npm run build`
3. Confirm the build output exists in `dist/`

## Production start

The production server entry is:

`backend/server.ts`

Because the repo uses TypeScript directly at runtime in development, your deployment should do one of these:

1. Run the server with `tsx`
2. Or add a compile step for the backend and run compiled JavaScript

The simplest current option is to start with:

`npx tsx backend/server.ts`

Make sure `NODE_ENV=production` is set so Express serves `dist/` instead of starting Vite middleware.

## Recommended deployment flow

1. `npm install`
2. Set environment variables
3. `npm run build`
4. Start the server with:
   `npx tsx backend/server.ts`

## Platform notes

- The app listens on port `3000` in the current code.
- Some platforms provide their own `PORT` value. If you deploy to one of those, update the server to read `process.env.PORT` before deploying.
- `APP_URL` should be the base deployed URL, for example:
  `https://your-domain.com`
- Do not set `APP_URL` to a route like `/login`.

## Pre-deploy checklist

- `npm run lint` passes
- `npm run build` passes
- MongoDB allows connections from your deployment environment
- `JWT_SECRET` is a strong production secret
- `APP_URL` is your real production base URL
- `.env` is not committed with real secrets

## Current limitation

The backend currently hardcodes:

`const PORT = 3000;`

For wider deployment compatibility, update it to something like:

`const PORT = Number(process.env.PORT) || 3000;`

That change is recommended before deploying to platforms like Render, Railway, or Cloud Run.
