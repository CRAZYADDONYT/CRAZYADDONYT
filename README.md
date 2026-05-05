# AuthFlow Login System

Simple, clean, and secure full-stack login system with a modern dark UI.

## Features

- Login page
  - Username/Email
  - Password + show/hide button
  - Remember me checkbox
  - Login button
  - Forgot password link
  - Link to sign up
- Sign up page
  - Username
  - Email
  - Password
  - Confirm password
  - Create account button
- Validation
  - No empty fields
  - Email format check
  - Minimum 8-char password
  - Confirm password must match
- Authenticated dashboard state
  - Redirect to dashboard after login
  - Navbar profile avatar + username
  - Logout button
- Secure backend auth
  - SQLite database user storage
  - Password hashing with bcrypt
  - Session-based login persistence with `express-session`
- Mobile-friendly responsive UI
- Dark theme and smooth UI transitions

## Folder Structure

```
.
├── app.js                 # Frontend auth flow + validation + session check
├── index.html             # Login, sign-up, and dashboard UI
├── styles.css             # Responsive dark theme styles
└── backend
    ├── package.json       # Backend dependencies and scripts
    ├── auth.db            # Created automatically for user accounts
    ├── sessions.db        # Created automatically for sessions
    └── src
        └── server.js      # Express API, bcrypt hashing, and sessions
```

## Run Locally

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Start server:
   ```bash
   npm start
   ```
3. Open in browser:
   - `http://localhost:3000`

## Notes

- This project is intentionally lightweight and easy to edit.
- Code includes clear inline comments, especially in auth/session logic.
- For production, use a strong `SESSION_SECRET` and enable secure cookies over HTTPS.
