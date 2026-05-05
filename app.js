const state = {
  user: null,
  users: JSON.parse(localStorage.getItem('arena_users') || '[]'),
  drafts: JSON.parse(localStorage.getItem('arena_drafts') || '[]')
};

const pages = document.querySelectorAll('.page');
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const page = btn.dataset.page;
    pages.forEach(p => p.classList.toggle('active', p.id === page));
  });
});

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const profileSetupForm = document.getElementById('profileSetupForm');

signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;
  const username = signupUsername.value.trim();
  const exists = state.users.find(u => u.email === email);
  if (exists) return alert('Account already exists');
  const user = {
    id: crypto.randomUUID(),
    email,
    passwordHash: btoa(password),
    username,
    profile: {}
  };
  state.users.push(user);
  localStorage.setItem('arena_users', JSON.stringify(state.users));
  alert('Signup successful. Please complete profile setup.');
  userId.value = user.id;
  document.querySelector('[data-page="account"]').click();
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = loginEmail.value.trim();
  const passwordHash = btoa(loginPassword.value);
  const user = state.users.find(u => u.email === email && u.passwordHash === passwordHash);
  if (!user) return alert('Invalid credentials');
  state.user = user;
  hydrateAccount(user);
  alert('Logged in successfully');
  document.querySelector('[data-page="home"]').click();
});

document.getElementById('forgotPassword').addEventListener('click', e => {
  e.preventDefault();
  alert('Password reset link UI triggered (connect to backend email function).');
});

profileSetupForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!state.users.length) return alert('Signup first');
  const latest = state.users[state.users.length - 1];
  latest.profile = {
    displayName: displayName.value,
    bio: bio.value,
    favoriteGames: favoriteGames.value,
    socialLinks: socialLinks.value
  };
  localStorage.setItem('arena_users', JSON.stringify(state.users));
  alert('Profile setup saved.');
});

document.getElementById('guestMode').addEventListener('click', () => {
  state.user = { id: 'guest', username: 'Guest' };
  alert('Guest browsing mode enabled.');
});

function fileToDataURL(file, cb) {
  const reader = new FileReader();
  reader.onload = () => cb(reader.result);
  reader.readAsDataURL(file);
}

profilePic.addEventListener('change', e => {
  if (!e.target.files[0] || !state.user) return;
  fileToDataURL(e.target.files[0], data => {
    state.user.profilePic = data;
  });
});
bannerPic.addEventListener('change', e => {
  if (!e.target.files[0] || !state.user) return;
  fileToDataURL(e.target.files[0], data => {
    state.user.banner = data;
  });
});

accentColor.addEventListener('input', e => {
  document.documentElement.style.setProperty('--accent', e.target.value);
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  const p = document.createElement('p');
  p.innerHTML = `<strong>You:</strong> ${text} ✅ delivered`;
  chatWindow.appendChild(p);
  messageInput.value = '';
});

const dropZone = document.getElementById('dropZone');
let selectedVideo = null;

['dragenter', 'dragover'].forEach(evt => dropZone.addEventListener(evt, e => {
  e.preventDefault();
  dropZone.style.borderColor = 'var(--accent)';
}));
['dragleave', 'drop'].forEach(evt => dropZone.addEventListener(evt, e => {
  e.preventDefault();
  dropZone.style.borderColor = '#3d4570';
}));

dropZone.addEventListener('drop', e => {
  selectedVideo = e.dataTransfer.files[0];
  dropZone.textContent = selectedVideo ? `Selected: ${selectedVideo.name}` : 'Drop video file here';
});

videoFile.addEventListener('change', e => selectedVideo = e.target.files[0]);

uploadForm.addEventListener('submit', e => {
  e.preventDefault();
  const file = selectedVideo || videoFile.files[0];
  if (!file) return alert('Please choose a local video file.');

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    uploadProgress.value = progress;
    if (progress >= 100) {
      clearInterval(interval);
      alert('Video published successfully (UI simulation; connect storage backend).');
      addTrending(videoTitle.value || file.name);
      document.querySelector('[data-page="video-player"]').click();
    }
  }, 150);
});

saveDraft.addEventListener('click', () => {
  const draft = {
    title: videoTitle.value,
    description: videoDescription.value,
    tags: videoTags.value,
    category: videoCategory.value,
    visibility: videoVisibility.value,
    schedule: scheduleUpload.value
  };
  state.drafts.push(draft);
  localStorage.setItem('arena_drafts', JSON.stringify(state.drafts));
  alert('Draft saved.');
});

speed.addEventListener('change', e => {
  player.playbackRate = Number(e.target.value);
});

function hydrateAccount(user) {
  username.value = user.username || '';
  userId.value = user.id;
  about.value = user.profile?.bio || '';
  favGames.value = user.profile?.favoriteGames || '';
  social.value = user.profile?.socialLinks || '';
}

function addTrending(title) {
  const li = document.createElement('li');
  li.textContent = title;
  trendingList.prepend(li);
}

['Championship Finals Highlights', 'Top 10 Clutches', 'Insane Boss Speedrun'].forEach(addTrending);
