 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/app.js b/app.js
index fb552b3aaf24e971ef048d0c634e616112c35a8a..ca76b5e6ae5fa296ae596ad084d30fdadb4568c9 100644
--- a/app.js
+++ b/app.js
@@ -1,313 +1,148 @@
- (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
-diff --git a/app.js b/app.js
-index 9efa8be2b8ba6210f5c950147e47393ec4a4b190..fcfcb1fee9b81b66988ec4c28badfeeb759df44d 100644
---- a/app.js
-+++ b/app.js
-@@ -1,180 +1,150 @@
--const state = {
--  user: null,
--  users: JSON.parse(localStorage.getItem('arena_users') || '[]'),
--  drafts: JSON.parse(localStorage.getItem('arena_drafts') || '[]')
--};
--
--const pages = document.querySelectorAll('.page');
--document.querySelectorAll('.nav-btn').forEach(btn => {
--  btn.addEventListener('click', () => {
--    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
--    btn.classList.add('active');
--    const page = btn.dataset.page;
--    pages.forEach(p => p.classList.toggle('active', p.id === page));
--  });
--});
-+// Frontend auth UI logic with basic form validation and session-aware rendering.
-+const formMessage = document.getElementById('formMessage');
-+
-+const loginSection = document.getElementById('loginSection');
-+const signupSection = document.getElementById('signupSection');
-+const dashboardSection = document.getElementById('dashboardSection');
-+const navUser = document.getElementById('navUser');
- 
- const loginForm = document.getElementById('loginForm');
- const signupForm = document.getElementById('signupForm');
--const profileSetupForm = document.getElementById('profileSetupForm');
- 
--signupForm.addEventListener('submit', e => {
--  e.preventDefault();
--  const email = signupEmail.value.trim();
--  const password = signupPassword.value;
--  const username = signupUsername.value.trim();
--  const exists = state.users.find(u => u.email === email);
--  if (exists) return alert('Account already exists');
--  const user = {
--    id: crypto.randomUUID(),
--    email,
--    passwordHash: btoa(password),
--    username,
--    profile: {}
--  };
--  state.users.push(user);
--  localStorage.setItem('arena_users', JSON.stringify(state.users));
--  alert('Signup successful. Please complete profile setup.');
--  userId.value = user.id;
--  document.querySelector('[data-page="account"]').click();
--});
-+const toggleLoginPassword = document.getElementById('toggleLoginPassword');
-+const toggleSignupPassword = document.getElementById('toggleSignupPassword');
- 
--loginForm.addEventListener('submit', e => {
--  e.preventDefault();
--  const email = loginEmail.value.trim();
--  const passwordHash = btoa(loginPassword.value);
--  const user = state.users.find(u => u.email === email && u.passwordHash === passwordHash);
--  if (!user) return alert('Invalid credentials');
--  state.user = user;
--  hydrateAccount(user);
--  alert('Logged in successfully');
--  document.querySelector('[data-page="home"]').click();
--});
-+const toSignupLink = document.getElementById('toSignupLink');
-+const toLoginLink = document.getElementById('toLoginLink');
-+const forgotPasswordLink = document.getElementById('forgotPasswordLink');
-+const logoutBtn = document.getElementById('logoutBtn');
- 
--document.getElementById('forgotPassword').addEventListener('click', e => {
--  e.preventDefault();
--  alert('Password reset link UI triggered (connect to backend email function).');
--});
-+function setMessage(text, isError = false) {
-+  formMessage.textContent = text;
-+  formMessage.style.color = isError ? '#ff8fa2' : '#9bb5ff';
-+}
- 
--profileSetupForm.addEventListener('submit', e => {
--  e.preventDefault();
--  if (!state.users.length) return alert('Signup first');
--  const latest = state.users[state.users.length - 1];
--  latest.profile = {
--    displayName: displayName.value,
--    bio: bio.value,
--    favoriteGames: favoriteGames.value,
--    socialLinks: socialLinks.value
--  };
--  localStorage.setItem('arena_users', JSON.stringify(state.users));
--  alert('Profile setup saved.');
--});
-+function togglePassword(inputId, btn) {
-+  const input = document.getElementById(inputId);
-+  const showing = input.type === 'text';
-+  input.type = showing ? 'password' : 'text';
-+  btn.textContent = showing ? 'Show' : 'Hide';
-+}
- 
--document.getElementById('guestMode').addEventListener('click', () => {
--  state.user = { id: 'guest', username: 'Guest' };
--  alert('Guest browsing mode enabled.');
--});
-+function showLogin() {
-+  loginSection.classList.remove('hidden');
-+  signupSection.classList.add('hidden');
-+  dashboardSection.classList.add('hidden');
-+}
- 
--function fileToDataURL(file, cb) {
--  const reader = new FileReader();
--  reader.onload = () => cb(reader.result);
--  reader.readAsDataURL(file);
-+function showSignup() {
-+  signupSection.classList.remove('hidden');
-+  loginSection.classList.add('hidden');
-+  dashboardSection.classList.add('hidden');
- }
- 
--profilePic.addEventListener('change', e => {
--  if (!e.target.files[0] || !state.user) return;
--  fileToDataURL(e.target.files[0], data => {
--    state.user.profilePic = data;
--  });
--});
--bannerPic.addEventListener('change', e => {
--  if (!e.target.files[0] || !state.user) return;
--  fileToDataURL(e.target.files[0], data => {
--    state.user.banner = data;
--  });
--});
-+function showDashboard(user) {
-+  loginSection.classList.add('hidden');
-+  signupSection.classList.add('hidden');
-+  dashboardSection.classList.remove('hidden');
-+  navUser.classList.remove('hidden');
- 
--accentColor.addEventListener('input', e => {
--  document.documentElement.style.setProperty('--accent', e.target.value);
--});
-+  document.getElementById('userName').textContent = user.username;
-+  document.getElementById('userAvatar').textContent = user.username[0].toUpperCase();
-+  document.getElementById('dashboardText').textContent = `Welcome, ${user.username}! You are signed in.`;
-+}
- 
--messageForm.addEventListener('submit', e => {
--  e.preventDefault();
--  const text = messageInput.value.trim();
--  if (!text) return;
--  const p = document.createElement('p');
--  p.innerHTML = `<strong>You:</strong> ${text} ✅ delivered`;
--  chatWindow.appendChild(p);
--  messageInput.value = '';
--});
-+function validateEmail(email) {
-+  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
-+}
- 
--const dropZone = document.getElementById('dropZone');
--let selectedVideo = null;
-+async function api(path, options = {}) {
-+  const response = await fetch(path, {
-+    credentials: 'include',
-+    headers: { 'Content-Type': 'application/json' },
-+    ...options
-+  });
-+  const data = await response.json();
-+  if (!response.ok) throw new Error(data.error || 'Request failed');
-+  return data;
-+}
- 
--['dragenter', 'dragover'].forEach(evt => dropZone.addEventListener(evt, e => {
--  e.preventDefault();
--  dropZone.style.borderColor = 'var(--accent)';
--}));
--['dragleave', 'drop'].forEach(evt => dropZone.addEventListener(evt, e => {
-+loginForm.addEventListener('submit', async (e) => {
-   e.preventDefault();
--  dropZone.style.borderColor = '#3d4570';
--}));
--
--dropZone.addEventListener('drop', e => {
--  selectedVideo = e.dataTransfer.files[0];
--  dropZone.textContent = selectedVideo ? `Selected: ${selectedVideo.name}` : 'Drop video file here';
-+  const identifier = document.getElementById('loginIdentifier').value.trim();
-+  const password = document.getElementById('loginPassword').value;
-+  const rememberMe = document.getElementById('rememberMe').checked;
-+
-+  if (!identifier || !password) return setMessage('All login fields are required.', true);
-+  if (password.length < 8) return setMessage('Password must be at least 8 characters.', true);
-+
-+  try {
-+    const result = await api('/api/auth/login', {
-+      method: 'POST',
-+      body: JSON.stringify({ identifier, password, rememberMe })
-+    });
-+    setMessage('Login successful. Redirecting...');
-+    showDashboard(result.user);
-+  } catch (error) {
-+    setMessage(error.message, true);
-+  }
- });
- 
--videoFile.addEventListener('change', e => selectedVideo = e.target.files[0]);
--
--uploadForm.addEventListener('submit', e => {
-+signupForm.addEventListener('submit', async (e) => {
-   e.preventDefault();
--  const file = selectedVideo || videoFile.files[0];
--  if (!file) return alert('Please choose a local video file.');
--
--  let progress = 0;
--  const interval = setInterval(() => {
--    progress += 10;
--    uploadProgress.value = progress;
--    if (progress >= 100) {
--      clearInterval(interval);
--      alert('Video published successfully (UI simulation; connect storage backend).');
--      addTrending(videoTitle.value || file.name);
--      document.querySelector('[data-page="video-player"]').click();
--    }
--  }, 150);
-+  const username = document.getElementById('signupUsername').value.trim();
-+  const email = document.getElementById('signupEmail').value.trim();
-+  const password = document.getElementById('signupPassword').value;
-+  const confirmPassword = document.getElementById('confirmPassword').value;
-+
-+  if (!username || !email || !password || !confirmPassword) return setMessage('All sign up fields are required.', true);
-+  if (!validateEmail(email)) return setMessage('Please provide a valid email address.', true);
-+  if (password.length < 8) return setMessage('Password must be at least 8 characters.', true);
-+  if (password !== confirmPassword) return setMessage('Confirm password must match password.', true);
-+
-+  try {
-+    await api('/api/auth/signup', {
-+      method: 'POST',
-+      body: JSON.stringify({ username, email, password })
-+    });
-+    setMessage('Account created. You can now log in.');
-+    signupForm.reset();
-+    showLogin();
-+  } catch (error) {
-+    setMessage(error.message, true);
-+  }
- });
- 
--saveDraft.addEventListener('click', () => {
--  const draft = {
--    title: videoTitle.value,
--    description: videoDescription.value,
--    tags: videoTags.value,
--    category: videoCategory.value,
--    visibility: videoVisibility.value,
--    schedule: scheduleUpload.value
--  };
--  state.drafts.push(draft);
--  localStorage.setItem('arena_drafts', JSON.stringify(state.drafts));
--  alert('Draft saved.');
-+logoutBtn.addEventListener('click', async () => {
-+  try {
-+    await api('/api/auth/logout', { method: 'POST' });
-+    navUser.classList.add('hidden');
-+    showLogin();
-+    setMessage('Logged out successfully.');
-+  } catch (error) {
-+    setMessage(error.message, true);
-+  }
- });
- 
--speed.addEventListener('change', e => {
--  player.playbackRate = Number(e.target.value);
--});
-+toggleLoginPassword.addEventListener('click', () => togglePassword('loginPassword', toggleLoginPassword));
-+toggleSignupPassword.addEventListener('click', () => togglePassword('signupPassword', toggleSignupPassword));
- 
--function hydrateAccount(user) {
--  username.value = user.username || '';
--  userId.value = user.id;
--  about.value = user.profile?.bio || '';
--  favGames.value = user.profile?.favoriteGames || '';
--  social.value = user.profile?.socialLinks || '';
--}
-+toSignupLink.addEventListener('click', (e) => { e.preventDefault(); showSignup(); });
-+toLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLogin(); });
- 
--function addTrending(title) {
--  const li = document.createElement('li');
--  li.textContent = title;
--  trendingList.prepend(li);
--}
-+forgotPasswordLink.addEventListener('click', (e) => {
-+  e.preventDefault();
-+  setMessage('Forgot password flow placeholder: connect your email reset endpoint.');
-+});
- 
--['Championship Finals Highlights', 'Top 10 Clutches', 'Insane Boss Speedrun'].forEach(addTrending);
-+// Check session on first load so remembered users stay signed in.
-+(async function bootstrapSession() {
-+  try {
-+    const result = await api('/api/auth/session');
-+    if (result.user) {
-+      showDashboard(result.user);
-+      return;
-+    }
-+  } catch (_) {
-+    // Session check failed or no active session; default to login view.
-+  }
-+  showLogin();
-+})();
- 
-EOF
-)
+const categories = ['Gaming', 'Music', 'Sports', 'Anime', 'Live', 'Technology', 'Trending', 'New'];
+const allowedExt = ['mp4', 'mov', 'avi'];
+const maxVideoBytes = 500 * 1024 * 1024;
+
+const categoryBar = document.getElementById('categoryBar');
+const grid = document.getElementById('videoGrid');
+const searchInput = document.getElementById('searchInput');
+const uploadDialog = document.getElementById('uploadDialog');
+const uploadForm = document.getElementById('uploadForm');
+const uploadProgress = document.getElementById('uploadProgress');
+const uploadError = document.getElementById('uploadError');
+const uploadStatus = document.getElementById('uploadStatus');
+const videoFileInput = document.getElementById('videoFile');
+const thumbnailInput = document.getElementById('thumbnailFile');
+const dropZone = document.getElementById('dropZone');
+const preview = document.getElementById('videoPreview');
+const channelLabel = document.getElementById('channelLabel');
+
+let selectedVideo = null;
+
+const setError = (msg = '') => {
+  uploadError.textContent = msg;
+  uploadError.classList.toggle('hidden', !msg);
+};
+
+const validateVideo = (file) => {
+  if (!file) return 'Please choose a video file.';
+  const ext = file.name.split('.').pop()?.toLowerCase();
+  if (!allowedExt.includes(ext)) return 'Only MP4, MOV, and AVI are allowed.';
+  if (file.size > maxVideoBytes) return 'File exceeds 500MB limit.';
+  return '';
+};
+
+function setSelectedVideo(file) {
+  const error = validateVideo(file);
+  if (error) {
+    selectedVideo = null;
+    preview.classList.add('hidden');
+    preview.removeAttribute('src');
+    setError(error);
+    return;
+  }
+
+  selectedVideo = file;
+  setError('');
+  preview.src = URL.createObjectURL(file);
+  preview.classList.remove('hidden');
+  uploadStatus.textContent = `Ready: ${file.name}`;
+}
+
+categories.forEach((c) => {
+  const b = document.createElement('button');
+  b.className = 'cat';
+  b.textContent = c;
+  b.onclick = () => loadVideos(c);
+  categoryBar.appendChild(b);
+  document.getElementById('categoryInput').innerHTML += `<option>${c}</option>`;
+});
+
+function fmtViews(v) { return `${Number(v).toLocaleString()} views`; }
+
+async function refreshAccount() {
+  const res = await fetch('/api/account/session');
+  const data = await res.json();
+  channelLabel.textContent = data.channelName;
+}
+
+async function loadVideos(category = '') {
+  const query = new URLSearchParams({ q: searchInput.value, category }).toString();
+  const res = await fetch(`/api/videos?${query}`);
+  const videos = await res.json();
+  grid.innerHTML = videos.map((v) => `<article class="card" onclick="location.href='/player.html?id=${v.id}'"><div class="thumb-wrap"><img src="${v.thumbnail_url}" alt="thumbnail" /><span class="duration">${v.duration_label || '--:--'}</span></div><div class="card-body"><div class="title">${v.title}</div><div class="muted">${v.channel_name}</div><div class="muted">${fmtViews(v.views)} • ${v.time_ago}</div></div></article>`).join('');
+}
+
+searchInput.addEventListener('input', () => loadVideos());
+document.getElementById('openUploadBtn').onclick = () => uploadDialog.showModal();
+document.getElementById('closeUploadBtn').onclick = () => uploadDialog.close();
+
+document.getElementById('profileBtn').onclick = async () => {
+  const channelName = prompt('Enter your channel name');
+  if (!channelName) return;
+  const res = await fetch('/api/account/channel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ channelName }) });
+  if (!res.ok) return alert('Could not save channel');
+  await refreshAccount();
+};
+
+videoFileInput.addEventListener('change', () => setSelectedVideo(videoFileInput.files[0]));
+
+dropZone.addEventListener('click', () => videoFileInput.click());
+dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragging'); });
+dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
+dropZone.addEventListener('drop', (e) => {
+  e.preventDefault();
+  dropZone.classList.remove('dragging');
+  setSelectedVideo(e.dataTransfer.files[0]);
+});
+
+function uploadWithProgress(formData) {
+  return new Promise((resolve, reject) => {
+    const xhr = new XMLHttpRequest();
+    xhr.open('POST', '/api/videos/upload');
+    xhr.upload.onprogress = (e) => {
+      if (!e.lengthComputable) return;
+      uploadProgress.value = Math.round((e.loaded / e.total) * 100);
+      uploadStatus.textContent = `Uploading... ${uploadProgress.value}%`;
+    };
+    xhr.onload = () => {
+      if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
+      else reject(new Error(JSON.parse(xhr.responseText).error || 'Upload failed'));
+    };
+    xhr.onerror = () => reject(new Error('Network error during upload.'));
+    xhr.send(formData);
+  });
+}
+
+uploadForm.addEventListener('submit', async (e) => {
+  e.preventDefault();
+  setError('');
+  uploadProgress.value = 0;
+
+  const fileError = validateVideo(selectedVideo);
+  if (fileError) return setError(fileError);
+  if (!thumbnailInput.files[0]) return setError('Please add a thumbnail image.');
+
+  const fd = new FormData();
+  fd.append('videoFile', selectedVideo);
+  fd.append('thumbnailFile', thumbnailInput.files[0]);
+  fd.append('titleInput', document.getElementById('titleInput').value.trim());
+  fd.append('descriptionInput', document.getElementById('descriptionInput').value.trim());
+  fd.append('categoryInput', document.getElementById('categoryInput').value);
+
+  try {
+    await uploadWithProgress(fd);
+    uploadStatus.textContent = 'Upload complete!';
+    uploadForm.reset();
+    selectedVideo = null;
+    preview.classList.add('hidden');
+    preview.removeAttribute('src');
+    setTimeout(() => { uploadDialog.close(); uploadProgress.value = 0; uploadStatus.textContent = ''; }, 700);
+    await loadVideos();
+  } catch (err) {
+    setError(err.message);
+    uploadStatus.textContent = '';
+  }
+});
+
+refreshAccount();
+loadVideos();
 
EOF
)
