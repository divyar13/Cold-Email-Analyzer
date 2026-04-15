# Cold Email Analyzer

AI-powered cold email scoring and feedback tool built with the MERN stack.

## Features

- **AI Scoring** — Paste any email → Gemini scores it across 5 dimensions (Personalization, Clarity, CTA, Tone, Red Flags)
- **Rewriter** — Automatically generates an improved version of every email
- **Compare Mode** — Paste two emails side by side, AI picks the winner and explains why
- **History** — Logged-in users get searchable/filterable analysis history
- **Sender Scores** — Tracks average email quality per company/sender
- **Hall of Shame** — Community-submitted terrible recruiter emails with reactions

## Setup

### 1. Clone and install

```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

### 2. Environment variables

```bash
cp .env.example server/.env
# Fill in all values in server/.env
```

Required values:
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Random secret for signing JWTs
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — From [Google Cloud Console](https://console.cloud.google.com/)
- `GEMINI_API_KEY` — From [Google AI Studio](https://aistudio.google.com/apikey)

### 3. Google OAuth setup

In Google Cloud Console:
1. Create a new project
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

### 4. Run

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

App runs at `http://localhost:5173`

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Tailwind CSS + Recharts |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | Passport.js Google OAuth + JWT |
| AI | Google Gemini 1.5 Flash |
