 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 5e755a33a55a1d1bc2084c83f69ace0c44f0917a..ca9a6aa3ed2765eeb7dc96b890a4b1e8933619f0 100644
--- a/README.md
+++ b/README.md
@@ -1,89 +1,24 @@
- (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
-diff --git a/README.md b/README.md
-index 28b0b3261effce6b441142ec2958d46653822e55..707799747c156b935d7be19d7af30571606b2d2d 100644
---- a/README.md
-+++ b/README.md
-@@ -1,16 +1,69 @@
--# ArenaOnly
-+# AuthFlow Login System
- 
--Modern dark-themed gaming streaming UI built with HTML/CSS/JavaScript and a Supabase-compatible backend schema.
-+Simple, clean, and secure full-stack login system with a modern dark UI.
- 
--## Structure
--- `index.html` - multi-section app pages (home, auth, account, friends, messages, upload, watch, channel, search)
--- `styles.css` - responsive dark theme
--- `app.js` - navigation, auth mock flow, profile and upload interactions
--- `backend/supabase_schema.sql` - SQL schema for auth-adjacent app tables
-+## Features
- 
--## Run
--Open `index.html` in a browser.
-+- Login page
-+  - Username/Email
-+  - Password + show/hide button
-+  - Remember me checkbox
-+  - Login button
-+  - Forgot password link
-+  - Link to sign up
-+- Sign up page
-+  - Username
-+  - Email
-+  - Password
-+  - Confirm password
-+  - Create account button
-+- Validation
-+  - No empty fields
-+  - Email format check
-+  - Minimum 8-char password
-+  - Confirm password must match
-+- Authenticated dashboard state
-+  - Redirect to dashboard after login
-+  - Navbar profile avatar + username
-+  - Logout button
-+- Secure backend auth
-+  - SQLite database user storage
-+  - Password hashing with bcrypt
-+  - Session-based login persistence with `express-session`
-+- Mobile-friendly responsive UI
-+- Dark theme and smooth UI transitions
-+
-+## Folder Structure
-+
-+```
-+.
-+├── app.js                 # Frontend auth flow + validation + session check
-+├── index.html             # Login, sign-up, and dashboard UI
-+├── styles.css             # Responsive dark theme styles
-+└── backend
-+    ├── package.json       # Backend dependencies and scripts
-+    ├── auth.db            # Created automatically for user accounts
-+    ├── sessions.db        # Created automatically for sessions
-+    └── src
-+        └── server.js      # Express API, bcrypt hashing, and sessions
-+```
-+
-+## Run Locally
-+
-+1. Install backend dependencies:
-+   ```bash
-+   cd backend
-+   npm install
-+   ```
-+2. Start server:
-+   ```bash
-+   npm start
-+   ```
-+3. Open in browser:
-+   - `http://localhost:3000`
- 
- ## Notes
--- Auth and upload are secure-flow UI simulations in frontend (designed to connect to Supabase/Firebase SDK).
--- Upload flows only use direct local device files (input/drag-and-drop), no URL uploads.
-+
-+- This project is intentionally lightweight and easy to edit.
-+- Code includes clear inline comments, especially in auth/session logic.
-+- For production, use a strong `SESSION_SECRET` and enable secure cookies over HTTPS.
- 
-EOF
-)
+# XXG's - YouTube-style Homepage
+
+Modern dark-themed video platform with:
+- Top navbar, sidebar, category pills
+- Responsive video feed cards with hover animation
+- Device-file video + thumbnail uploads with progress bar
+- Video player page with Like / Comment / Subscribe actions
+- SQLite-backed data storage and view tracking
+
+## Run
+```bash
+cd backend
+npm install
+npm start
+```
+Open: `http://localhost:3000`
+
+## Structure
+- `index.html` Homepage UI
+- `player.html` Video player page
+- `styles.css` Shared modern dark UI styles
+- `app.js` Homepage feed/upload logic
+- `player.js` Video player interactions
+- `backend/src/server.js` Express + SQLite API/storage
 
EOF
)
