 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/app.js b/app.js
index 9efa8be2b8ba6210f5c950147e47393ec4a4b190..fcfcb1fee9b81b66988ec4c28badfeeb759df44d 100644
--- a/app.js
+++ b/app.js
@@ -1,180 +1,150 @@
-const state = {
-  user: null,
-  users: JSON.parse(localStorage.getItem('arena_users') || '[]'),
-  drafts: JSON.parse(localStorage.getItem('arena_drafts') || '[]')
-};
-
-const pages = document.querySelectorAll('.page');
-document.querySelectorAll('.nav-btn').forEach(btn => {
-  btn.addEventListener('click', () => {
-    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
-    btn.classList.add('active');
-    const page = btn.dataset.page;
-    pages.forEach(p => p.classList.toggle('active', p.id === page));
-  });
-});
+// Frontend auth UI logic with basic form validation and session-aware rendering.
+const formMessage = document.getElementById('formMessage');
+
+const loginSection = document.getElementById('loginSection');
+const signupSection = document.getElementById('signupSection');
+const dashboardSection = document.getElementById('dashboardSection');
+const navUser = document.getElementById('navUser');
 
 const loginForm = document.getElementById('loginForm');
 const signupForm = document.getElementById('signupForm');
-const profileSetupForm = document.getElementById('profileSetupForm');
 
-signupForm.addEventListener('submit', e => {
-  e.preventDefault();
-  const email = signupEmail.value.trim();
-  const password = signupPassword.value;
-  const username = signupUsername.value.trim();
-  const exists = state.users.find(u => u.email === email);
-  if (exists) return alert('Account already exists');
-  const user = {
-    id: crypto.randomUUID(),
-    email,
-    passwordHash: btoa(password),
-    username,
-    profile: {}
-  };
-  state.users.push(user);
-  localStorage.setItem('arena_users', JSON.stringify(state.users));
-  alert('Signup successful. Please complete profile setup.');
-  userId.value = user.id;
-  document.querySelector('[data-page="account"]').click();
-});
+const toggleLoginPassword = document.getElementById('toggleLoginPassword');
+const toggleSignupPassword = document.getElementById('toggleSignupPassword');
 
-loginForm.addEventListener('submit', e => {
-  e.preventDefault();
-  const email = loginEmail.value.trim();
-  const passwordHash = btoa(loginPassword.value);
-  const user = state.users.find(u => u.email === email && u.passwordHash === passwordHash);
-  if (!user) return alert('Invalid credentials');
-  state.user = user;
-  hydrateAccount(user);
-  alert('Logged in successfully');
-  document.querySelector('[data-page="home"]').click();
-});
+const toSignupLink = document.getElementById('toSignupLink');
+const toLoginLink = document.getElementById('toLoginLink');
+const forgotPasswordLink = document.getElementById('forgotPasswordLink');
+const logoutBtn = document.getElementById('logoutBtn');
 
-document.getElementById('forgotPassword').addEventListener('click', e => {
-  e.preventDefault();
-  alert('Password reset link UI triggered (connect to backend email function).');
-});
+function setMessage(text, isError = false) {
+  formMessage.textContent = text;
+  formMessage.style.color = isError ? '#ff8fa2' : '#9bb5ff';
+}
 
-profileSetupForm.addEventListener('submit', e => {
-  e.preventDefault();
-  if (!state.users.length) return alert('Signup first');
-  const latest = state.users[state.users.length - 1];
-  latest.profile = {
-    displayName: displayName.value,
-    bio: bio.value,
-    favoriteGames: favoriteGames.value,
-    socialLinks: socialLinks.value
-  };
-  localStorage.setItem('arena_users', JSON.stringify(state.users));
-  alert('Profile setup saved.');
-});
+function togglePassword(inputId, btn) {
+  const input = document.getElementById(inputId);
+  const showing = input.type === 'text';
+  input.type = showing ? 'password' : 'text';
+  btn.textContent = showing ? 'Show' : 'Hide';
+}
 
-document.getElementById('guestMode').addEventListener('click', () => {
-  state.user = { id: 'guest', username: 'Guest' };
-  alert('Guest browsing mode enabled.');
-});
+function showLogin() {
+  loginSection.classList.remove('hidden');
+  signupSection.classList.add('hidden');
+  dashboardSection.classList.add('hidden');
+}
 
-function fileToDataURL(file, cb) {
-  const reader = new FileReader();
-  reader.onload = () => cb(reader.result);
-  reader.readAsDataURL(file);
+function showSignup() {
+  signupSection.classList.remove('hidden');
+  loginSection.classList.add('hidden');
+  dashboardSection.classList.add('hidden');
 }
 
-profilePic.addEventListener('change', e => {
-  if (!e.target.files[0] || !state.user) return;
-  fileToDataURL(e.target.files[0], data => {
-    state.user.profilePic = data;
-  });
-});
-bannerPic.addEventListener('change', e => {
-  if (!e.target.files[0] || !state.user) return;
-  fileToDataURL(e.target.files[0], data => {
-    state.user.banner = data;
-  });
-});
+function showDashboard(user) {
+  loginSection.classList.add('hidden');
+  signupSection.classList.add('hidden');
+  dashboardSection.classList.remove('hidden');
+  navUser.classList.remove('hidden');
 
-accentColor.addEventListener('input', e => {
-  document.documentElement.style.setProperty('--accent', e.target.value);
-});
+  document.getElementById('userName').textContent = user.username;
+  document.getElementById('userAvatar').textContent = user.username[0].toUpperCase();
+  document.getElementById('dashboardText').textContent = `Welcome, ${user.username}! You are signed in.`;
+}
 
-messageForm.addEventListener('submit', e => {
-  e.preventDefault();
-  const text = messageInput.value.trim();
-  if (!text) return;
-  const p = document.createElement('p');
-  p.innerHTML = `<strong>You:</strong> ${text} ✅ delivered`;
-  chatWindow.appendChild(p);
-  messageInput.value = '';
-});
+function validateEmail(email) {
+  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
+}
 
-const dropZone = document.getElementById('dropZone');
-let selectedVideo = null;
+async function api(path, options = {}) {
+  const response = await fetch(path, {
+    credentials: 'include',
+    headers: { 'Content-Type': 'application/json' },
+    ...options
+  });
+  const data = await response.json();
+  if (!response.ok) throw new Error(data.error || 'Request failed');
+  return data;
+}
 
-['dragenter', 'dragover'].forEach(evt => dropZone.addEventListener(evt, e => {
-  e.preventDefault();
-  dropZone.style.borderColor = 'var(--accent)';
-}));
-['dragleave', 'drop'].forEach(evt => dropZone.addEventListener(evt, e => {
+loginForm.addEventListener('submit', async (e) => {
   e.preventDefault();
-  dropZone.style.borderColor = '#3d4570';
-}));
-
-dropZone.addEventListener('drop', e => {
-  selectedVideo = e.dataTransfer.files[0];
-  dropZone.textContent = selectedVideo ? `Selected: ${selectedVideo.name}` : 'Drop video file here';
+  const identifier = document.getElementById('loginIdentifier').value.trim();
+  const password = document.getElementById('loginPassword').value;
+  const rememberMe = document.getElementById('rememberMe').checked;
+
+  if (!identifier || !password) return setMessage('All login fields are required.', true);
+  if (password.length < 8) return setMessage('Password must be at least 8 characters.', true);
+
+  try {
+    const result = await api('/api/auth/login', {
+      method: 'POST',
+      body: JSON.stringify({ identifier, password, rememberMe })
+    });
+    setMessage('Login successful. Redirecting...');
+    showDashboard(result.user);
+  } catch (error) {
+    setMessage(error.message, true);
+  }
 });
 
-videoFile.addEventListener('change', e => selectedVideo = e.target.files[0]);
-
-uploadForm.addEventListener('submit', e => {
+signupForm.addEventListener('submit', async (e) => {
   e.preventDefault();
-  const file = selectedVideo || videoFile.files[0];
-  if (!file) return alert('Please choose a local video file.');
-
-  let progress = 0;
-  const interval = setInterval(() => {
-    progress += 10;
-    uploadProgress.value = progress;
-    if (progress >= 100) {
-      clearInterval(interval);
-      alert('Video published successfully (UI simulation; connect storage backend).');
-      addTrending(videoTitle.value || file.name);
-      document.querySelector('[data-page="video-player"]').click();
-    }
-  }, 150);
+  const username = document.getElementById('signupUsername').value.trim();
+  const email = document.getElementById('signupEmail').value.trim();
+  const password = document.getElementById('signupPassword').value;
+  const confirmPassword = document.getElementById('confirmPassword').value;
+
+  if (!username || !email || !password || !confirmPassword) return setMessage('All sign up fields are required.', true);
+  if (!validateEmail(email)) return setMessage('Please provide a valid email address.', true);
+  if (password.length < 8) return setMessage('Password must be at least 8 characters.', true);
+  if (password !== confirmPassword) return setMessage('Confirm password must match password.', true);
+
+  try {
+    await api('/api/auth/signup', {
+      method: 'POST',
+      body: JSON.stringify({ username, email, password })
+    });
+    setMessage('Account created. You can now log in.');
+    signupForm.reset();
+    showLogin();
+  } catch (error) {
+    setMessage(error.message, true);
+  }
 });
 
-saveDraft.addEventListener('click', () => {
-  const draft = {
-    title: videoTitle.value,
-    description: videoDescription.value,
-    tags: videoTags.value,
-    category: videoCategory.value,
-    visibility: videoVisibility.value,
-    schedule: scheduleUpload.value
-  };
-  state.drafts.push(draft);
-  localStorage.setItem('arena_drafts', JSON.stringify(state.drafts));
-  alert('Draft saved.');
+logoutBtn.addEventListener('click', async () => {
+  try {
+    await api('/api/auth/logout', { method: 'POST' });
+    navUser.classList.add('hidden');
+    showLogin();
+    setMessage('Logged out successfully.');
+  } catch (error) {
+    setMessage(error.message, true);
+  }
 });
 
-speed.addEventListener('change', e => {
-  player.playbackRate = Number(e.target.value);
-});
+toggleLoginPassword.addEventListener('click', () => togglePassword('loginPassword', toggleLoginPassword));
+toggleSignupPassword.addEventListener('click', () => togglePassword('signupPassword', toggleSignupPassword));
 
-function hydrateAccount(user) {
-  username.value = user.username || '';
-  userId.value = user.id;
-  about.value = user.profile?.bio || '';
-  favGames.value = user.profile?.favoriteGames || '';
-  social.value = user.profile?.socialLinks || '';
-}
+toSignupLink.addEventListener('click', (e) => { e.preventDefault(); showSignup(); });
+toLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLogin(); });
 
-function addTrending(title) {
-  const li = document.createElement('li');
-  li.textContent = title;
-  trendingList.prepend(li);
-}
+forgotPasswordLink.addEventListener('click', (e) => {
+  e.preventDefault();
+  setMessage('Forgot password flow placeholder: connect your email reset endpoint.');
+});
 
-['Championship Finals Highlights', 'Top 10 Clutches', 'Insane Boss Speedrun'].forEach(addTrending);
+// Check session on first load so remembered users stay signed in.
+(async function bootstrapSession() {
+  try {
+    const result = await api('/api/auth/session');
+    if (result.user) {
+      showDashboard(result.user);
+      return;
+    }
+  } catch (_) {
+    // Session check failed or no active session; default to login view.
+  }
+  showLogin();
+})();
 
EOF
)
