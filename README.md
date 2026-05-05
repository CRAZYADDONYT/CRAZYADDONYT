# XXG's - YouTube-style Homepage

Modern dark-themed video platform with:
- Top navbar, sidebar, category pills
- Responsive video feed cards with hover animation
- Device-file video + thumbnail uploads with progress bar
- Video player page with Like / Comment / Subscribe actions
- SQLite-backed data storage and view tracking

## Run
```bash
cd backend
npm install
npm start
```
Open: `http://localhost:3000`

## Structure
- `index.html` Homepage UI
- `player.html` Video player page
- `styles.css` Shared modern dark UI styles
- `app.js` Homepage feed/upload logic
- `player.js` Video player interactions
- `backend/src/server.js` Express + SQLite API/storage
