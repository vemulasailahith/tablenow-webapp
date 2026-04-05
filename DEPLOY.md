# Deploy Both Frontend and Backend

## Architecture

This project deploys as one full-stack app:

- `frontend/` contains the React + Vite frontend
- `backend/` contains the Express backend
- `dist/` contains the built frontend files

In production:

1. Vite builds the frontend into `dist/`
2. The Express backend serves the frontend from `dist/`
3. The same backend process also handles `/api/*` routes

That means you do not need two separate deployments unless you want to split them later.

## Required environment variables

Set these in your deployment platform:

- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `APP_URL`
- `NODE_ENV=production`

Use the real deployed base URL for `APP_URL`, for example:

`https://your-app-domain.com`

Do not use a route like `/login` for `APP_URL`.

## Local development

1. Install dependencies:
   `npm install`
2. Create `.env` from `.env.example`
3. Start the app:
   `npm run dev`
4. Open:
   `http://localhost:3000`

## How frontend deployment works

The frontend is built with:

`npm run build`

That command:

- uses Vite with `frontend/` as the app root
- reads static assets from `frontend/public`
- writes the production frontend bundle into `dist/`

After the build, the frontend is ready to be served by the backend.

## How backend deployment works

The backend entry file is:

`backend/server.ts`

In development, it starts Vite middleware.
In production, when `NODE_ENV=production`, it serves the built frontend from `dist/`.

So the backend is responsible for:

- API routes
- MongoDB connection
- auth and booking endpoints
- serving the frontend app

## Deploy both together

Recommended deployment flow:

1. Install dependencies:
   `npm install`
2. Set production environment variables
3. Build frontend:
   `npm run build`
4. Start backend in production:
   `npx tsx backend/server.ts`

This runs both backend and frontend together, because the backend serves the built frontend files.

## Render deployment

This repo now includes [render.yaml](/c:/Users/vemul/OneDrive/Desktop/sailahith/tablenow/render.yaml), so you can deploy it on Render as a single web service.

On Render:

1. Create a new Blueprint or Web Service from your GitHub repo
2. Use the existing `render.yaml`
3. Set the secret environment variables:
   `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, and `APP_URL`
4. Deploy

Render will:

- run `npm install && npm run build`
- start the app with `npm run start`
- inject `PORT` automatically

The backend already supports Render's dynamic port with:

`const PORT = Number(process.env.PORT) || 3000;`

## Recommended production commands

Build command:

`npm install && npm run build`

Start command:

`npx tsx backend/server.ts`

## Pre-deployment checklist

- `npm run lint` passes
- `npm run build` passes
- `MONGODB_URI` works from the hosted environment
- `JWT_SECRET` is set in secrets
- `GEMINI_API_KEY` is set in secrets
- `APP_URL` is the real production base URL
- `.env` is not committed

## If you want separate frontend and backend deployments later

You would need to:

- deploy the frontend independently
- point frontend API calls to the backend domain
- enable CORS for that frontend origin
- stop serving `dist/` from the backend as the primary frontend delivery path

For the current codebase, a single combined deployment is the simplest option.

## Deploy frontend on Vercel and backend on Render

Yes, you can deploy the frontend on Vercel and keep the backend on Render.

For that setup:

- Render hosts the Express backend
- Vercel hosts the Vite frontend
- the frontend must call the Render backend URL instead of `/api`

This repo now supports that with:

- `VITE_API_URL` for the frontend

Set this in Vercel:

`VITE_API_URL=https://your-render-service.onrender.com/api`

### What to deploy to Vercel

You can connect the same GitHub repo to Vercel.
Vercel only needs the frontend build output, but it can still build from the full repo.

Recommended Vercel settings:

- Framework Preset: `Vite`
- Root Directory: repo root
- Build Command: `npm run build`
- Output Directory: `dist`

### What about the other files

These are fine to keep in the same repo:

- `backend/`
- `render.yaml`
- `DEPLOY.md`
- `firestore.rules`
- config files at the repo root

Vercel does not need to run the backend files for the frontend deployment.
They can stay in the repo without a problem.

### One more thing for split deployment

If your backend is on Render and frontend is on Vercel, the backend should allow requests from your Vercel frontend domain.

Right now the backend uses open CORS:

`app.use(cors());`

That works for testing, but for production you may later want to restrict it to your Vercel domain.
