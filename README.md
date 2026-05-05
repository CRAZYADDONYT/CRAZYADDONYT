# ArenaOnly

Modern dark-themed gaming streaming UI built with HTML/CSS/JavaScript and a Supabase-compatible backend schema.

## Structure
- `index.html` - multi-section app pages (home, auth, account, friends, messages, upload, watch, channel, search)
- `styles.css` - responsive dark theme
- `app.js` - navigation, auth mock flow, profile and upload interactions
- `backend/supabase_schema.sql` - SQL schema for auth-adjacent app tables

## Run
Open `index.html` in a browser.

## Notes
- Auth and upload are secure-flow UI simulations in frontend (designed to connect to Supabase/Firebase SDK).
- Upload flows only use direct local device files (input/drag-and-drop), no URL uploads.
