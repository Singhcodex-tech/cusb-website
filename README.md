# CUSB Full-Stack University Website

## Project Structure

```
cusb-fullstack/
├── frontend/
│   ├── index.html        ← Original site (MODIFIED: api.js injected before main.js)
│   ├── styles.css        ← Original styles (UNCHANGED)
│   ├── main.js           ← Original JS (UNCHANGED)
│   ├── api.js            ← NEW: Backend bridge + dynamic content loader
│   └── admin.html        ← NEW: Full CMS Admin Dashboard
│
└── backend/
    ├── server.js         ← Express app entry point
    ├── .env              ← Environment variables (EDIT THIS)
    ├── package.json
    ├── config/
    │   ├── db.js         ← MongoDB connection
    │   └── seed.js       ← Database seeder (creates admin + sample data)
    ├── models/
    │   ├── Admin.js
    │   ├── Notice.js
    │   ├── Event.js
    │   ├── Faculty.js
    │   ├── Gallery.js
    │   ├── Homepage.js
    │   ├── Announcement.js
    │   └── Contact.js
    ├── controllers/      ← Business logic (one file per model)
    ├── routes/           ← REST API routes (one file per model)
    ├── middleware/
    │   ├── auth.js       ← JWT protect + authorize
    │   └── upload.js     ← Multer image/PDF handler
    └── uploads/
        ├── images/       ← Uploaded images stored here
        └── pdfs/         ← Uploaded PDFs stored here
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

### Step 1 — Install Dependencies
```bash
cd backend
npm install
```

---

### Step 2 — Configure Environment
Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/cusb_db   # or your Atlas URI
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
```

---

### Step 3 — Seed the Database
Creates default admin account + sample notices, events, announcements, homepage data.
```bash
cd backend
npm run seed
```
Default admin credentials:
- Email: `admin@cusb.ac.in`
- Password: `Admin@1234`

---

### Step 4 — Start the Backend
```bash
cd backend
npm run dev       # Development (nodemon auto-reload)
# or
npm start         # Production
```
Backend runs at: `http://localhost:5000`

---

### Step 5 — Open the Frontend
Open `frontend/index.html` in browser (or serve via VS Code Live Server / any static server).

Admin panel: Open `frontend/admin.html`

---

## API Endpoints

### Auth
| Method | Endpoint            | Auth | Description        |
|--------|---------------------|------|--------------------|
| POST   | /api/auth/login     | ✗    | Admin login        |
| GET    | /api/auth/me        | ✓    | Get current admin  |
| PUT    | /api/auth/password  | ✓    | Change password    |

### Notices
| Method | Endpoint             | Auth | Description         |
|--------|----------------------|------|---------------------|
| GET    | /api/notices         | ✗    | List (with filters) |
| GET    | /api/notices/:id     | ✗    | Single notice       |
| POST   | /api/notices         | ✓    | Create + PDF upload |
| PUT    | /api/notices/:id     | ✓    | Update              |
| DELETE | /api/notices/:id     | ✓    | Delete              |

### Events
| Method | Endpoint            | Auth | Description               |
|--------|---------------------|------|---------------------------|
| GET    | /api/events         | ✗    | List (?upcoming=true etc) |
| POST   | /api/events         | ✓    | Create + image upload     |
| PUT    | /api/events/:id     | ✓    | Update                    |
| DELETE | /api/events/:id     | ✓    | Delete                    |

### Faculty
| Method | Endpoint            | Auth | Description               |
|--------|---------------------|------|---------------------------|
| GET    | /api/faculty        | ✗    | List (?school= ?dept=)    |
| POST   | /api/faculty        | ✓    | Create + photo upload     |
| PUT    | /api/faculty/:id    | ✓    | Update                    |
| DELETE | /api/faculty/:id    | ✓    | Delete                    |

### Gallery
| Method | Endpoint            | Auth | Description         |
|--------|---------------------|------|---------------------|
| GET    | /api/gallery        | ✗    | List (?category=)   |
| POST   | /api/gallery        | ✓    | Upload image        |
| PUT    | /api/gallery/:id    | ✓    | Update metadata     |
| DELETE | /api/gallery/:id    | ✓    | Delete              |

### Announcements (Ticker)
| Method | Endpoint                | Auth | Description  |
|--------|-------------------------|------|--------------|
| GET    | /api/announcements      | ✗    | List active  |
| POST   | /api/announcements      | ✓    | Create       |
| PUT    | /api/announcements/:id  | ✓    | Update       |
| DELETE | /api/announcements/:id  | ✓    | Delete       |

### Homepage Sections
| Method | Endpoint               | Auth | Description             |
|--------|------------------------|------|-------------------------|
| GET    | /api/homepage          | ✗    | All sections            |
| GET    | /api/homepage/:section | ✗    | Single section          |
| PUT    | /api/homepage/:section | ✓    | Upsert section data     |

Sections: `hero`, `stats`, `about`

### Contact
| Method | Endpoint              | Auth | Description    |
|--------|-----------------------|------|----------------|
| GET    | /api/contact          | ✗    | All sections   |
| PUT    | /api/contact/:section | ✓    | Update section |

Sections: `main`, `social`

---

## How Frontend ↔ Backend Connects

### api.js is loaded in index.html:
```html
<!-- Added just before main.js in index.html -->
<script src="api.js"></script>
<script defer src="main.js"></script>
```

### What api.js does automatically on page load:
1. `loadTicker()` — Fetches `/api/announcements` → replaces `.ticker-track` content
2. `loadNotices()` — Fetches `/api/notices` → populates `.notices-dynamic-list` if present
3. `loadEvents()` — Fetches `/api/events?upcoming=true` → populates `.events-dynamic-list` if present
4. Patches `openInfoModal('notices')` and `openInfoModal('upcoming-events')` → injects live DB data into existing modals

### Admin panel (admin.html) — standalone file:
- Login with JWT stored in `localStorage`
- All CRUD via `fetch()` to `http://localhost:5000/api`
- File uploads via `FormData` (multipart)

---

## Admin Panel Features

| Section       | Create | Edit | Delete | Upload |
|---------------|--------|------|--------|--------|
| Notices       | ✓      | ✓    | ✓      | PDF    |
| Events        | ✓      | ✓    | ✓      | Image  |
| Announcements | ✓      | ✓    | ✓      | —      |
| Faculty       | ✓      | ✓    | ✓      | Photo  |
| Gallery       | ✓      | —    | ✓      | Image  |
| Homepage      | —      | ✓    | —      | —      |
| Contact       | —      | ✓    | —      | —      |
| Account       | —      | ✓    | —      | —      |

---

## Deployment Notes

### Backend (e.g. Render, Railway, VPS)
- Set all `.env` vars in platform dashboard
- Use MongoDB Atlas for cloud DB
- `npm start` as start command

### Frontend
- Change `API_BASE` in `api.js` line 8 and `API` in `admin.html` script to your deployed backend URL
- Can be hosted on Netlify, Vercel, or GitHub Pages

### Change API URL (one line each):
- `frontend/api.js` line 8: `const API_BASE = 'https://your-backend.com/api';`
- `frontend/admin.html` script line 2: `const API = 'https://your-backend.com/api';`
