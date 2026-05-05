// Frontend auth UI logic with basic form validation and session-aware rendering.
const formMessage = document.getElementById('formMessage');

const loginSection = document.getElementById('loginSection');
const signupSection = document.getElementById('signupSection');
const dashboardSection = document.getElementById('dashboardSection');
const navUser = document.getElementById('navUser');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const toggleSignupPassword = document.getElementById('toggleSignupPassword');

const toSignupLink = document.getElementById('toSignupLink');
const toLoginLink = document.getElementById('toLoginLink');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const logoutBtn = document.getElementById('logoutBtn');

function setMessage(text, isError = false) {
  formMessage.textContent = text;
  formMessage.style.color = isError ? '#ff8fa2' : '#9bb5ff';
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  btn.textContent = showing ? 'Show' : 'Hide';
}

function showLogin() {
  loginSection.classList.remove('hidden');
  signupSection.classList.add('hidden');
  dashboardSection.classList.add('hidden');
}

function showSignup() {
  signupSection.classList.remove('hidden');
  loginSection.classList.add('hidden');
  dashboardSection.classList.add('hidden');
}

function showDashboard(user) {
  loginSection.classList.add('hidden');
  signupSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');
  navUser.classList.remove('hidden');

  document.getElementById('userName').textContent = user.username;
  document.getElementById('userAvatar').textContent = user.username[0].toUpperCase();
  document.getElementById('dashboardText').textContent = `Welcome, ${user.username}! You are signed in.`;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const identifier = document.getElementById('loginIdentifier').value.trim();
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  if (!identifier || !password) return setMessage('All login fields are required.', true);
  if (password.length < 8) return setMessage('Password must be at least 8 characters.', true);

  try {
    const result = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password, rememberMe })
    });
    setMessage('Login successful. Redirecting...');
    showDashboard(result.user);
  } catch (error) {
    setMessage(error.message, true);
  }
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!username || !email || !password || !confirmPassword) return setMessage('All sign up fields are required.', true);
  if (!validateEmail(email)) return setMessage('Please provide a valid email address.', true);
  if (password.length < 8) return setMessage('Password must be at least 8 characters.', true);
  if (password !== confirmPassword) return setMessage('Confirm password must match password.', true);

  try {
    await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
    setMessage('Account created. You can now log in.');
    signupForm.reset();
    showLogin();
  } catch (error) {
    setMessage(error.message, true);
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await api('/api/auth/logout', { method: 'POST' });
    navUser.classList.add('hidden');
    showLogin();
    setMessage('Logged out successfully.');
  } catch (error) {
    setMessage(error.message, true);
  }
});

toggleLoginPassword.addEventListener('click', () => togglePassword('loginPassword', toggleLoginPassword));
toggleSignupPassword.addEventListener('click', () => togglePassword('signupPassword', toggleSignupPassword));

toSignupLink.addEventListener('click', (e) => { e.preventDefault(); showSignup(); });
toLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLogin(); });

forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  setMessage('Forgot password flow placeholder: connect your email reset endpoint.');
});

// Check session on first load so remembered users stay signed in.
(async function bootstrapSession() {
  try {
    const result = await api('/api/auth/session');
    if (result.user) {
      showDashboard(result.user);
      return;
    }
  } catch (_) {
    // Session check failed or no active session; default to login view.
  }
  showLogin();
})();
