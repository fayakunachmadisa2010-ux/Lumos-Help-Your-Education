/* =====================================================
   LUMOS — app.js
   Student Productivity Web App
   
   Structure:
   1. i18n (translations)
   2. Auth (register, login, logout)
   3. Navigation / page routing
   4. Dashboard (stats, progress, countdown)
   5. Tasks (add, delete, complete)
   6. Schedule (add, delete, render)
   7. Theme & Language toggles
   8. Init
   ===================================================== */

/* =====================================================
   1. TRANSLATIONS (i18n)
   ===================================================== */
const translations = {
  en: {
    loginTitle: "Welcome back",
    loginSub: "Sign in to your workspace",
    registerTitle: "Create account",
    registerSub: "Start your learning journey",
    labelIdentifier: "Username or Email",
    labelPassword: "Password",
    labelConfirm: "Confirm Password",
    labelUsername: "Username",
    labelEmail: "Email",
    btnLogin: "Sign In",
    btnRegister: "Create Account",
    noAccount: "Don't have an account? ",
    hasAccount: "Already have an account? ",
    navDashboard: "Dashboard",
    navTasks: "Tasks",
    navSchedule: "Schedule",
    btnLogout: "Logout",
    toggleTheme: "Theme",
    greetingSub: "Here's your study overview for today.",
    statTotal: "Total Tasks",
    statDone: "Completed",
    statPending: "Pending",
    progressLabel: "Overall Progress",
    upcomingDeadlines: "Upcoming Deadlines",
    noTasks: "No tasks yet. Add one in Tasks!",
    addTask: "Add New Task",
    taskTitle: "Title",
    taskSubject: "Subject",
    taskDeadline: "Deadline",
    taskTitlePlaceholder: "e.g. Math Assignment",
    taskSubjectPlaceholder: "e.g. Mathematics",
    btnAddTask: "Add Task",
    noTasksYet: "No tasks yet. Start adding some!",
    addActivity: "Add Activity",
    activityDay: "Day",
    activityName: "Activity",
    activityStart: "Start",
    activityEnd: "End",
    activityPlaceholder: "e.g. Physics Class",
    btnAddActivity: "Add Activity",
    monFri: "Mon–Fri",
    monSat: "Mon–Sat",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    today: "Today",
    daysShort: "d",
    hoursShort: "h",
    minutesShort: "m",
    secondsShort: "s",
    overdue: "Overdue",
    completed: "Completed ✓",
    errAllRequired: "All fields are required.",
    errPasswordMatch: "Passwords do not match.",
    errUsernameTaken: "Username already taken.",
    errEmailTaken: "Email already taken.",
    errInvalidLogin: "Invalid username/email or password.",
    errTaskTitle: "Please enter a task title.",
    errTaskDeadline: "Please set a deadline.",
    errActivityFields: "Please fill in all activity fields.",
    errTimeOrder: "End time must be after start time.",
  },
  id: {
    loginTitle: "Hei, selamat datang!",
    loginSub: "Masuk ke workspace kamu",
    registerTitle: "Buat akun",
    registerSub: "Yuk mulai belajar bareng Lumos",
    labelIdentifier: "Username atau Email",
    labelPassword: "Password",
    labelConfirm: "Konfirmasi Password",
    labelUsername: "Username",
    labelEmail: "Email",
    btnLogin: "Masuk",
    btnRegister: "Daftar Sekarang",
    noAccount: "Belum punya akun? ",
    hasAccount: "Udah punya akun? ",
    navDashboard: "Dashboard",
    navTasks: "Tugas",
    navSchedule: "Jadwal",
    btnLogout: "Keluar",
    toggleTheme: "Tema",
    greetingSub: "Ini ringkasan belajar kamu hari ini.",
    statTotal: "Total Tugas",
    statDone: "Selesai",
    statPending: "Belum Selesai",
    progressLabel: "Progress Keseluruhan",
    upcomingDeadlines: "Deadline Terdekat",
    noTasks: "Belum ada tugas. Tambahin di menu Tugas!",
    addTask: "Tambah Tugas Baru",
    taskTitle: "Judul",
    taskSubject: "Mata Pelajaran",
    taskDeadline: "Deadline",
    taskTitlePlaceholder: "cth. PR Matematika",
    taskSubjectPlaceholder: "cth. Matematika",
    btnAddTask: "Tambah Tugas",
    noTasksYet: "Belum ada tugas nih. Yuk tambah!",
    addActivity: "Tambah Kegiatan",
    activityDay: "Hari",
    activityName: "Kegiatan",
    activityStart: "Mulai",
    activityEnd: "Selesai",
    activityPlaceholder: "cth. Kelas Fisika",
    btnAddActivity: "Tambah Kegiatan",
    monFri: "Sen–Jum",
    monSat: "Sen–Sab",
    days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    today: "Hari ini",
    daysShort: "h",
    hoursShort: "j",
    minutesShort: "m",
    secondsShort: "d",
    overdue: "Lewat Deadline",
    completed: "Selesai ✓",
    errAllRequired: "Semua kolom wajib diisi.",
    errPasswordMatch: "Password tidak cocok.",
    errUsernameTaken: "Username sudah dipakai.",
    errEmailTaken: "Email sudah terdaftar.",
    errInvalidLogin: "Username/email atau password salah.",
    errTaskTitle: "Judul tugas harus diisi.",
    errTaskDeadline: "Deadline harus diisi.",
    errActivityFields: "Semua kolom kegiatan harus diisi.",
    errTimeOrder: "Waktu selesai harus setelah waktu mulai.",
  }
};

/* ---- Get current language ---- */
function getLang() {
  return localStorage.getItem('lumos_lang') || 'en';
}

/* ---- Get translation string ---- */
function t(key) {
  const lang = getLang();
  return translations[lang][key] || translations['en'][key] || key;
}

/* ---- Apply translations to all [data-i18n] elements ---- */
function applyTranslations() {
  const lang = getLang();
  document.documentElement.setAttribute('data-lang', lang);

  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = translations[lang][key];
    if (!val) return;

    // Special handling for links inside paragraphs
    if (el.tagName === 'P' && el.querySelector('a')) {
      const link = el.querySelector('a');
      const linkText = link.textContent;
      const linkId = link.id;
      el.textContent = val;
      // Re-append the link
      const newLink = document.createElement('a');
      newLink.href = '#';
      newLink.id = linkId;
      newLink.textContent = linkId === 'go-register'
        ? (lang === 'id' ? 'Daftar' : 'Register')
        : (lang === 'id' ? 'Masuk' : 'Sign In');
      el.appendChild(newLink);
      // Re-bind click (will be rebound at end of applyTranslations)
    } else {
      el.textContent = val;
    }
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = translations[lang][key];
    if (val) el.placeholder = val;
  });

  // Re-bind auth switch links
  const goReg = document.getElementById('go-register');
  const goLog = document.getElementById('go-login');
  if (goReg) goReg.onclick = (e) => { e.preventDefault(); showAuthPage('register'); };
  if (goLog) goLog.onclick = (e) => { e.preventDefault(); showAuthPage('login'); };

  // Update lang button label
  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.textContent = lang === 'en' ? 'ID' : 'EN';

  // Re-render schedule day select
  populateDaySelect();
}


/* =====================================================
   2. AUTH SYSTEM
   Stores users array & currentUser in localStorage
   ===================================================== */

/* ---- Get all users ---- */
function getUsers() {
  return JSON.parse(localStorage.getItem('lumos_users') || '[]');
}

/* ---- Save users array ---- */
function saveUsers(users) {
  localStorage.setItem('lumos_users', JSON.stringify(users));
}

/* ---- Get current logged-in user ---- */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('lumos_current') || 'null');
}

/* ---- Save current user to session ---- */
function setCurrentUser(user) {
  localStorage.setItem('lumos_current', JSON.stringify(user));
}

/* ---- REGISTER ---- */
function handleRegister() {
  const username = document.getElementById('reg-username').value.trim();
  const email    = document.getElementById('reg-email').value.trim().toLowerCase();
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;
  const errEl    = document.getElementById('register-error');

  errEl.classList.add('hidden');

  // Validation
  if (!username || !email || !password || !confirm) {
    return showError(errEl, t('errAllRequired'));
  }
  if (password !== confirm) {
    return showError(errEl, t('errPasswordMatch'));
  }

  const users = getUsers();

  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return showError(errEl, t('errUsernameTaken'));
  }
  if (users.find(u => u.email === email)) {
    return showError(errEl, t('errEmailTaken'));
  }

  // Create user
  const newUser = { username, email, password };
  users.push(newUser);
  saveUsers(users);

  // Auto-login
  setCurrentUser(newUser);
  startApp();
}

/* ---- LOGIN ---- */
function handleLogin() {
  const identifier = document.getElementById('login-identifier').value.trim().toLowerCase();
  const password   = document.getElementById('login-password').value;
  const errEl      = document.getElementById('login-error');

  errEl.classList.add('hidden');

  if (!identifier || !password) {
    return showError(errEl, t('errAllRequired'));
  }

  const users = getUsers();
  // Match by username OR email
  const user = users.find(u =>
    u.username.toLowerCase() === identifier || u.email === identifier
  );

  if (!user || user.password !== password) {
    return showError(errEl, t('errInvalidLogin'));
  }

  setCurrentUser(user);
  startApp();
}

/* ---- LOGOUT ---- */
function handleLogout() {
  localStorage.removeItem('lumos_current');
  stopCountdownInterval();
  showAuthPage('login');
  document.getElementById('auth-wrapper').classList.remove('hidden');
  document.getElementById('app-wrapper').classList.add('hidden');
}

/* ---- Show error message ---- */
function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
}

/* ---- Show auth page (login or register) ---- */
function showAuthPage(page) {
  document.getElementById('page-login').classList.toggle('hidden', page !== 'login');
  document.getElementById('page-register').classList.toggle('hidden', page !== 'register');
  // Clear inputs
  ['login-identifier', 'login-password', 'reg-username', 'reg-email', 'reg-password', 'reg-confirm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['login-error', 'register-error'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
}


/* =====================================================
   3. NAVIGATION / PAGE ROUTING
   ===================================================== */

/* ---- Show a page by name ---- */
function showPage(pageName) {
  // Deactivate all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Deactivate all nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Activate target page
  const pageEl = document.getElementById('page-' + pageName);
  if (pageEl) pageEl.classList.add('active');

  // Activate nav item
  const navEl = document.querySelector(`.nav-item[data-page="${pageName}"]`);
  if (navEl) navEl.classList.add('active');

  // Refresh page-specific content
  if (pageName === 'dashboard') refreshDashboard();
  if (pageName === 'tasks') renderTasks();
  if (pageName === 'schedule') renderSchedule();

  // Close mobile sidebar
  closeMobileSidebar();
}

/* ---- Bind nav items ---- */
function bindNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(item.getAttribute('data-page'));
    });
  });
}


/* =====================================================
   4. DASHBOARD
   ===================================================== */

let countdownInterval = null;

/* ---- Stop the countdown interval ---- */
function stopCountdownInterval() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

/* ---- Refresh all dashboard data ---- */
function refreshDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  // Greeting
  const lang = getLang();
  const greeting = lang === 'id' ? `Halo, ${user.username}!` : `Hello, ${user.username}!`;
  document.getElementById('greeting-text').textContent = greeting;

  // Date badge
  const now = new Date();
  const dateStr = now.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
  document.getElementById('date-badge').textContent = dateStr;

  // Task stats
  const tasks = getTasks();
  const total   = tasks.length;
  const done    = tasks.filter(t => t.completed).length;
  const pending = total - done;

  document.getElementById('stat-total').textContent   = total;
  document.getElementById('stat-done').textContent    = done;
  document.getElementById('stat-pending').textContent = pending;

  // Progress bar
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent  = pct + '%';

  // Start countdown
  stopCountdownInterval();
  renderCountdowns();
  countdownInterval = setInterval(renderCountdowns, 1000);
}

/* ---- Render countdown list ---- */
function renderCountdowns() {
  const container = document.getElementById('countdown-list');
  if (!container) return;

  const tasks = getTasks().filter(t => !t.completed && t.deadline);
  tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  // Show max 5 upcoming
  const upcoming = tasks.slice(0, 5);

  if (upcoming.length === 0) {
    container.innerHTML = `<p class="empty-state">${t('noTasks')}</p>`;
    return;
  }

  container.innerHTML = upcoming.map(task => {
    const diff = new Date(task.deadline) - new Date();
    let timeStr = '';
    let warnClass = '';

    if (diff <= 0) {
      timeStr = t('overdue');
      warnClass = 'warn-red';
    } else {
      const totalSecs = Math.floor(diff / 1000);
      const days  = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const mins  = Math.floor((totalSecs % 3600) / 60);
      const secs  = totalSecs % 60;

      if (days > 0) {
        timeStr = `${days}${t('daysShort')} ${hours}${t('hoursShort')} ${mins}${t('minutesShort')}`;
      } else {
        timeStr = `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
      }

      // Warning classes
      const hours_total = diff / 1000 / 3600;
      if (hours_total < 3) warnClass = 'warn-red';
      else if (hours_total < 24) warnClass = 'warn-yellow';
    }

    return `
      <div class="countdown-item ${warnClass}">
        <div class="countdown-task-info">
          <div class="countdown-task-title">${escapeHtml(task.title)}</div>
          <div class="countdown-task-subject">${escapeHtml(task.subject || '—')}</div>
        </div>
        <div class="countdown-time">${timeStr}</div>
      </div>
    `;
  }).join('');
}


/* =====================================================
   5. TASKS
   ===================================================== */

/* ---- Get tasks for current user ---- */
function getTasks() {
  const user = getCurrentUser();
  if (!user) return [];
  const key = `lumos_tasks_${user.username}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

/* ---- Save tasks for current user ---- */
function saveTasks(tasks) {
  const user = getCurrentUser();
  if (!user) return;
  const key = `lumos_tasks_${user.username}`;
  localStorage.setItem(key, JSON.stringify(tasks));
}

/* ---- Add a new task ---- */
function handleAddTask() {
  const title    = document.getElementById('task-title').value.trim();
  const subject  = document.getElementById('task-subject').value.trim();
  const deadline = document.getElementById('task-deadline').value;

  if (!title) return alert(t('errTaskTitle'));
  if (!deadline) return alert(t('errTaskDeadline'));

  const tasks = getTasks();
  tasks.push({
    id: Date.now().toString(),
    title,
    subject,
    deadline,
    completed: false,
    createdAt: new Date().toISOString()
  });
  saveTasks(tasks);

  // Clear form
  document.getElementById('task-title').value    = '';
  document.getElementById('task-subject').value  = '';
  document.getElementById('task-deadline').value = '';

  renderTasks();
}

/* ---- Toggle task completion ---- */
function toggleTask(id) {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks(tasks);
  renderTasks();
}

/* ---- Delete a task ---- */
function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
  renderTasks();
}

/* ---- Render task list ---- */
function renderTasks() {
  const container = document.getElementById('task-list');
  if (!container) return;

  const tasks = getTasks();
  if (tasks.length === 0) {
    container.innerHTML = `<p class="empty-state">${t('noTasksYet')}</p>`;
    return;
  }

  // Sort: pending first, then by deadline
  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  container.innerHTML = sorted.map(task => {
    const diff = task.deadline ? new Date(task.deadline) - new Date() : Infinity;
    const hours_total = diff / 1000 / 3600;

    let deadlineClass = '';
    if (!task.completed && diff > 0) {
      if (hours_total < 3) deadlineClass = 'warn-red';
      else if (hours_total < 24) deadlineClass = 'warn-yellow';
    }

    // Format deadline display
    const deadlineStr = task.deadline
      ? new Date(task.deadline).toLocaleString(getLang() === 'id' ? 'id-ID' : 'en-US', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
      : '—';

    return `
      <div class="task-item ${task.completed ? 'done' : ''}">
        <div class="task-check ${task.completed ? 'checked' : ''}" onclick="toggleTask('${task.id}')">
          ${task.completed ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
        </div>
        <div class="task-info">
          <div class="task-title">${escapeHtml(task.title)}</div>
          <div class="task-meta">
            ${task.subject ? `<span class="task-subject-badge">${escapeHtml(task.subject)}</span>` : ''}
            <span class="task-deadline ${task.completed ? '' : deadlineClass}">${deadlineStr}</span>
          </div>
        </div>
        <div class="task-actions">
          <button class="task-del-btn" onclick="deleteTask('${task.id}')" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}


/* =====================================================
   6. SCHEDULE
   ===================================================== */

// Day names index mapping
const DAY_INDICES = [0, 1, 2, 3, 4, 5]; // Mon=0 ... Sat=5
// JS Date: 0=Sun, 1=Mon ... 6=Sat → convert: Mon=0
function getTodayIndex() {
  const jsDay = new Date().getDay(); // 0=Sun
  if (jsDay === 0) return -1; // Sunday = not in schedule
  return jsDay - 1; // Mon=0, Tue=1, ..., Sat=5
}

/* ---- Get current schedule mode (5 or 6) ---- */
function getSchedMode() {
  const user = getCurrentUser();
  if (!user) return 5;
  return parseInt(localStorage.getItem(`lumos_schedmode_${user.username}`) || '5');
}

/* ---- Save schedule mode ---- */
function saveSchedMode(mode) {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem(`lumos_schedmode_${user.username}`, mode);
}

/* ---- Get schedules for current user ---- */
function getSchedules() {
  const user = getCurrentUser();
  if (!user) return [];
  const key = `lumos_schedule_${user.username}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

/* ---- Save schedules for current user ---- */
function saveSchedules(schedules) {
  const user = getCurrentUser();
  if (!user) return;
  const key = `lumos_schedule_${user.username}`;
  localStorage.setItem(key, JSON.stringify(schedules));
}

/* ---- Populate day <select> ---- */
function populateDaySelect() {
  const select = document.getElementById('activity-day');
  if (!select) return;
  const mode = getSchedMode();
  const dayNames = t('days');
  select.innerHTML = '';
  for (let i = 0; i < mode; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = dayNames[i];
    select.appendChild(opt);
  }
}

/* ---- Add an activity ---- */
function handleAddActivity() {
  const dayIndex = parseInt(document.getElementById('activity-day').value);
  const name     = document.getElementById('activity-name').value.trim();
  const start    = document.getElementById('activity-start').value;
  const end      = document.getElementById('activity-end').value;

  if (!name || !start || !end) return alert(t('errActivityFields'));
  if (start >= end) return alert(t('errTimeOrder'));

  const schedules = getSchedules();
  schedules.push({ id: Date.now().toString(), dayIndex, name, start, end });
  saveSchedules(schedules);

  document.getElementById('activity-name').value = '';
  document.getElementById('activity-start').value = '08:00';
  document.getElementById('activity-end').value = '10:00';

  renderSchedule();
}

/* ---- Delete an activity ---- */
function deleteActivity(id) {
  const schedules = getSchedules().filter(s => s.id !== id);
  saveSchedules(schedules);
  renderSchedule();
}

/* ---- Render schedule grid ---- */
function renderSchedule() {
  const grid = document.getElementById('schedule-grid');
  if (!grid) return;

  const mode      = getSchedMode();
  const schedules = getSchedules();
  const todayIdx  = getTodayIndex();
  const dayNames  = t('days');
  const todayStr  = t('today');

  grid.innerHTML = '';

  for (let i = 0; i < mode; i++) {
    const isToday = i === todayIdx;
    const dayActivities = schedules
      .filter(s => s.dayIndex === i)
      .sort((a, b) => a.start.localeCompare(b.start));

    const activitiesHtml = dayActivities.length === 0
      ? `<div class="day-empty">—</div>`
      : dayActivities.map(act => `
          <div class="activity-item">
            <span class="activity-time">${act.start} – ${act.end}</span>
            <span class="activity-name">${escapeHtml(act.name)}</span>
            <button class="activity-del" onclick="deleteActivity('${act.id}')" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        `).join('');

    const col = document.createElement('div');
    col.className = `day-column ${isToday ? 'today' : ''}`;
    col.innerHTML = `
      <div class="day-header">
        <span>${dayNames[i]}</span>
        ${isToday ? `<span class="day-today-badge">${todayStr}</span>` : ''}
      </div>
      <div class="day-activities">${activitiesHtml}</div>
    `;
    grid.appendChild(col);
  }
}


/* =====================================================
   7. THEME & LANGUAGE
   ===================================================== */

/* ---- Toggle dark/light mode ---- */
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('lumos_theme', next);
  updateThemeIcons(next);
}

/* ---- Update sun/moon icon visibility ---- */
function updateThemeIcons(theme) {
  const isDark = theme === 'dark';
  document.getElementById('icon-moon')?.classList.toggle('hidden', isDark);
  document.getElementById('icon-sun')?.classList.toggle('hidden', !isDark);
  document.getElementById('mobile-icon-moon')?.classList.toggle('hidden', isDark);
  document.getElementById('mobile-icon-sun')?.classList.toggle('hidden', !isDark);
}

/* ---- Toggle language ---- */
function toggleLanguage() {
  const current = getLang();
  const next = current === 'en' ? 'id' : 'en';
  localStorage.setItem('lumos_lang', next);
  applyTranslations();
  // Refresh current page
  const activePage = document.querySelector('.page.active');
  if (activePage) {
    const pageName = activePage.id.replace('page-', '');
    if (pageName === 'dashboard') refreshDashboard();
    if (pageName === 'tasks') renderTasks();
    if (pageName === 'schedule') renderSchedule();
  }
}


/* =====================================================
   MOBILE SIDEBAR
   ===================================================== */
function openMobileSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.remove('hidden');
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.add('hidden');
}


/* =====================================================
   UTILITIES
   ===================================================== */

/* ---- Escape HTML to prevent XSS ---- */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* =====================================================
   8. INIT — App startup
   ===================================================== */

/* ---- Start the main app after login ---- */
function startApp() {
  // Hide auth, show app
  document.getElementById('auth-wrapper').classList.add('hidden');
  document.getElementById('app-wrapper').classList.remove('hidden');

  // Show dashboard
  showPage('dashboard');

  // Apply saved theme
  const savedTheme = localStorage.getItem('lumos_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  // Apply translations
  applyTranslations();
}

/* ---- Main init on DOM ready ---- */
document.addEventListener('DOMContentLoaded', () => {

  // --- Apply saved theme immediately to avoid flash ---
  const savedTheme = localStorage.getItem('lumos_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  // --- Apply saved language ---
  applyTranslations();

  // --- Check session ---
  const currentUser = getCurrentUser();
  if (currentUser) {
    startApp();
  } else {
    document.getElementById('auth-wrapper').classList.remove('hidden');
    showAuthPage('login');
  }

  // --- AUTH Buttons ---
  document.getElementById('btn-login').addEventListener('click', handleLogin);
  document.getElementById('btn-register').addEventListener('click', handleRegister);

  // Also allow Enter key on auth inputs
  document.querySelectorAll('#page-login input').forEach(input => {
    input.addEventListener('keypress', e => { if (e.key === 'Enter') handleLogin(); });
  });
  document.querySelectorAll('#page-register input').forEach(input => {
    input.addEventListener('keypress', e => { if (e.key === 'Enter') handleRegister(); });
  });

  // Auth page links
  document.getElementById('go-register').addEventListener('click', e => {
    e.preventDefault(); showAuthPage('register');
  });
  document.getElementById('go-login').addEventListener('click', e => {
    e.preventDefault(); showAuthPage('login');
  });

  // --- Logout ---
  document.getElementById('btn-logout').addEventListener('click', handleLogout);

  // --- Navigation ---
  bindNav();

  // --- Theme Toggles ---
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('mobile-theme-toggle').addEventListener('click', toggleTheme);

  // --- Language Toggle ---
  document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);

  // --- Task form ---
  document.getElementById('btn-add-task').addEventListener('click', handleAddTask);
  document.getElementById('task-title').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleAddTask();
  });

  // --- Schedule mode toggle ---
  document.getElementById('sched-5').addEventListener('click', () => {
    saveSchedMode(5);
    document.getElementById('sched-5').classList.add('active');
    document.getElementById('sched-6').classList.remove('active');
    populateDaySelect();
    renderSchedule();
  });
  document.getElementById('sched-6').addEventListener('click', () => {
    saveSchedMode(6);
    document.getElementById('sched-6').classList.add('active');
    document.getElementById('sched-5').classList.remove('active');
    populateDaySelect();
    renderSchedule();
  });

  // Set active pill based on saved mode
  const savedMode = getSchedMode();
  if (savedMode === 6) {
    document.getElementById('sched-6').classList.add('active');
    document.getElementById('sched-5').classList.remove('active');
  }

  // --- Schedule add activity ---
  document.getElementById('btn-add-activity').addEventListener('click', handleAddActivity);

  // --- Mobile sidebar ---
  document.getElementById('mobile-menu-btn').addEventListener('click', openMobileSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', closeMobileSidebar);

  // Populate day select on load
  populateDaySelect();
});
