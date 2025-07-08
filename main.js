// main.js for TeenWork

// Application Modal Logic
function openApplicationModal(title, company, location, pay) {
  document.getElementById('modalJobTitle').textContent = title;
  document.getElementById('modalCompany').textContent = 'Company: ' + company;
  document.getElementById('modalLocation').textContent = 'Location: ' + location;
  document.getElementById('modalPay').textContent = 'Pay: ' + pay;
  document.getElementById('applicationModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeApplicationModal() {
  document.getElementById('applicationModal').style.display = 'none';
  document.body.style.overflow = '';
}
function submitApplication(e) {
  e.preventDefault();
  closeApplicationModal();
  alert('Thank you for applying! This is a demo.');
}

// Contact form alert
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thanks for your message!');
    contactForm.reset();
  });
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
  });
}

// Modal close on outside click
window.onclick = function(event) {
  const modal = document.getElementById('applicationModal');
  if (event.target === modal) {
    closeApplicationModal();
  }
};

// --- Auth & Modal Logic ---
function showModal(id) {
  document.getElementById(id).style.display = 'block';
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}
// Modal open/close for login/signup
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const toSignup = document.getElementById('toSignup');
const toLogin = document.getElementById('toLogin');
const dashboardNav = document.getElementById('dashboardNav');

if (loginBtn) loginBtn.onclick = () => showModal('loginModal');
if (signupBtn) signupBtn.onclick = () => showModal('signupModal');
if (closeLoginModal) closeLoginModal.onclick = () => closeModal('loginModal');
if (closeSignupModal) closeSignupModal.onclick = () => closeModal('signupModal');
if (toSignup) toSignup.onclick = (e) => { e.preventDefault(); closeModal('loginModal'); showModal('signupModal'); };
if (toLogin) toLogin.onclick = (e) => { e.preventDefault(); closeModal('signupModal'); showModal('loginModal'); };
window.onclick = function(event) {
  if (event.target === loginModal) closeModal('loginModal');
  if (event.target === signupModal) closeModal('signupModal');
};

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
}
function logout() {
  localStorage.removeItem('currentUser');
  updateAuthUI();
}
if (logoutBtn) logoutBtn.onclick = logout;

function updateAuthUI() {
  const user = getCurrentUser();
  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = '';
    if (dashboardNav) dashboardNav.style.display = '';
  } else {
    if (loginBtn) loginBtn.style.display = '';
    if (signupBtn) signupBtn.style.display = '';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (dashboardNav) dashboardNav.style.display = 'none';
  }
}
updateAuthUI();

// Signup logic
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    let users = getUsers();
    if (users.find(u => u.username === username || u.email === email)) {
      alert('User already exists with that username or email.');
      return;
    }
    const user = { username, email, password, appliedJobs: [] };
    users.push(user);
    setUsers(users);
    setCurrentUser(user);
    closeModal('signupModal');
    updateAuthUI();
    alert('Signup successful!');
  };
}
// Login logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    let users = getUsers();
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    if (!user) {
      alert('Invalid credentials.');
      return;
    }
    setCurrentUser(user);
    closeModal('loginModal');
    updateAuthUI();
    alert('Login successful!');
  };
}

// --- Job Filtering Logic ---
const jobsData = [
  {title:'Retail Assistant', company:'Tesco', location:'Manchester', pay:8.5, payDisplay:'£8.50/hr', minAge:16, rating:3.2},
  {title:'Ice Cream Server', company:'Scoop & Swirl', location:'Brighton', pay:7.0, payDisplay:'£7.00/hr', minAge:13, rating:4.8},
  {title:'Lifeguard', company:'Splash Leisure Centre', location:'Birmingham', pay:10.5, payDisplay:'£10.50/hr', minAge:18, rating:4.6},
  {title:'Dog Walker', company:'Happy Paws', location:'Leeds', pay:6.5, payDisplay:'£6.50/hr', minAge:13, rating:4.9},
  {title:'Barista', company:'Costa Coffee', location:'London', pay:9.0, payDisplay:'£9.00/hr', minAge:16, rating:3.7},
  {title:'Library Assistant', company:'Manchester City Library', location:'Manchester', pay:7.5, payDisplay:'£7.50/hr', minAge:16, rating:4.5},
  {title:'Camp Counsellor', company:'SummerFun Camps', location:'Bristol', pay:8.0, payDisplay:'£8.00/hr', minAge:16, rating:4.9},
  {title:'Shop Assistant', company:'WHSmith', location:'Liverpool', pay:7.8, payDisplay:'£7.80/hr', minAge:16, rating:2.8},
  {title:'Gardener', company:'GreenThumb', location:'Oxford', pay:8.2, payDisplay:'£8.20/hr', minAge:16, rating:4.2},
  {title:'Theme Park Attendant', company:'Alton Towers', location:'Staffordshire', pay:9.5, payDisplay:'£9.50/hr', minAge:16, rating:4.7},
  {title:'Waiter/Waitress', company:'Pizza Express', location:'York', pay:8.0, payDisplay:'£8.00/hr', minAge:16, rating:2.5},
  {title:'Farm Helper', company:'Sunny Fields', location:'Somerset', pay:7.2, payDisplay:'£7.20/hr', minAge:13, rating:1.8},
  {title:'Receptionist', company:'Fit4All Gym', location:'Newcastle', pay:8.8, payDisplay:'£8.80/hr', minAge:16, rating:4.0},
  {title:'Pet Sitter', company:'PetPal', location:'Sheffield', pay:6.8, payDisplay:'£6.80/hr', minAge:13, rating:5.0},
  {title:'Tour Guide', company:'CityWalks', location:'Edinburgh', pay:10.0, payDisplay:'£10.00/hr', minAge:18, rating:4.4},
  {title:'Bookshop Assistant', company:'Waterstones', location:'Cambridge', pay:7.9, payDisplay:'£7.90/hr', minAge:16, rating:4.6},
  {title:'Kitchen Porter', company:'The Green Spoon', location:'Bath', pay:7.5, payDisplay:'£7.50/hr', minAge:16, rating:0.5},
  {title:'Childcare Assistant', company:'Little Stars Nursery', location:'Cardiff', pay:8.1, payDisplay:'£8.10/hr', minAge:16, rating:3.9},
  {title:'Warehouse Operative', company:'Amazon', location:'Milton Keynes', pay:9.2, payDisplay:'£9.20/hr', minAge:18, rating:1.2},
  {title:'Sports Coach', company:'ActiveTeens', location:'Glasgow', pay:10.0, payDisplay:'£10.00/hr', minAge:18, rating:4.8},
  {title:'Event Helper', company:'City Events', location:'London', pay:8.3, payDisplay:'£8.30/hr', minAge:16, rating:4.3},
  {title:'Delivery Cyclist', company:'Deliveroo', location:'Bristol', pay:9.0, payDisplay:'£9.00/hr', minAge:16, rating:2.2},
  {title:'Amusement Arcade Attendant', company:'FunZone', location:'Blackpool', pay:7.6, payDisplay:'£7.60/hr', minAge:16, rating:3.0},
  {title:'Ice Rink Assistant', company:'WinterWorld', location:'Nottingham', pay:8.4, payDisplay:'£8.40/hr', minAge:16, rating:4.1},
  {title:'Fruit Picker', company:'BerryBest Farms', location:'Kent', pay:7.1, payDisplay:'£7.10/hr', minAge:13, rating:1.5},
  {title:'Junior IT Assistant', company:'ByteTech', location:'Reading', pay:9.5, payDisplay:'£9.50/hr', minAge:16, rating:4.7},
  {title:'Park Cleaner', company:'CleanGreen', location:'Leicester', pay:7.0, payDisplay:'£7.00/hr', minAge:13, rating:0.8},
  {title:'Junior Photographer', company:'SnapShots', location:'London', pay:8.9, payDisplay:'£8.90/hr', minAge:16, rating:4.9},
  {title:'Swimming Pool Attendant', company:'AquaCentre', location:'Southampton', pay:8.2, payDisplay:'£8.20/hr', minAge:16, rating:3.6},
  {title:'Junior Baker', company:'Sweet Treats', location:'Norwich', pay:7.8, payDisplay:'£7.80/hr', minAge:16, rating:3.3},
  {title:'Car Wash Attendant', company:'ShinyCars', location:'Derby', pay:7.3, payDisplay:'£7.30/hr', minAge:13, rating:1.0},
  {title:'Junior Barista', company:'Brew Crew', location:'London', pay:8.6, payDisplay:'£8.60/hr', minAge:16, rating:3.8},
  {title:'Shop Floor Assistant', company:'Primark', location:'Birmingham', pay:7.9, payDisplay:'£7.90/hr', minAge:16, rating:2.7},
  {title:'Junior Chef', company:'Bella Italia', location:'Glasgow', pay:8.7, payDisplay:'£8.70/hr', minAge:16, rating:2.0},
  {title:'Ticket Seller', company:'Odeon Cinemas', location:'Liverpool', pay:7.6, payDisplay:'£7.60/hr', minAge:16, rating:3.5},
  {title:'Junior Web Assistant', company:'WebGen', location:'London', pay:9.1, payDisplay:'£9.10/hr', minAge:16, rating:4.6},
  {title:'Playground Supervisor', company:'PlaySafe', location:'Newcastle', pay:7.4, payDisplay:'£7.40/hr', minAge:13, rating:3.9},
  {title:'Junior Cashier', company:"Sainsbury's", location:'London', pay:8.1, payDisplay:'£8.10/hr', minAge:16, rating:2.3},
  {title:'Junior Waiter', company:"Nando's", location:'Cardiff', pay:7.8, payDisplay:'£7.80/hr', minAge:16, rating:2.9},
  {title:'Junior Sales Assistant', company:'JD Sports', location:'Manchester', pay:8.2, payDisplay:'£8.20/hr', minAge:16, rating:2.6},
  {title:'Junior Lifeguard', company:'SwimSafe', location:'Brighton', pay:8.5, payDisplay:'£8.50/hr', minAge:16, rating:4.5},
  {title:'Junior Receptionist', company:'City Spa', location:'Bath', pay:8.0, payDisplay:'£8.00/hr', minAge:16, rating:3.4},
  {title:'Junior Event Helper', company:'EventEase', location:'London', pay:8.6, payDisplay:'£8.60/hr', minAge:16, rating:4.2},
  {title:'Junior Dog Walker', company:'Walkies', location:'Bristol', pay:7.2, payDisplay:'£7.20/hr', minAge:13, rating:4.8},
  {title:'Junior Shop Assistant', company:'Boots', location:'London', pay:8.3, payDisplay:'£8.30/hr', minAge:16, rating:2.1},
  {title:'Junior Library Assistant', company:'City Library', location:'Liverpool', pay:7.6, payDisplay:'£7.60/hr', minAge:16, rating:4.4},
  {title:'Junior Farm Helper', company:'Green Acres', location:'York', pay:7.1, payDisplay:'£7.10/hr', minAge:13, rating:1.2},
  {title:'Junior Park Cleaner', company:'ParkCare', location:'Sheffield', pay:7.0, payDisplay:'£7.00/hr', minAge:13, rating:0.5},
  {title:'Junior Kitchen Porter', company:'The Blue Plate', location:'Oxford', pay:7.5, payDisplay:'£7.50/hr', minAge:16, rating:1.7},
  {title:'Junior Playground Supervisor', company:'PlayMore', location:'Cambridge', pay:7.4, payDisplay:'£7.40/hr', minAge:13, rating:3.6},
  {title:'Junior Event Helper', company:'EventEase', location:'London', pay:8.6, payDisplay:'£8.60/hr', minAge:16, rating:4.3},
  // --- Additional jobs for 50+ total ---
  {title:'Social Media Assistant', company:'InstaTeens', location:'London', pay:8.5, payDisplay:'£8.50/hr', minAge:16, rating:4.7},
  {title:'Museum Guide', company:'History House', location:'Manchester', pay:7.9, payDisplay:'£7.90/hr', minAge:16, rating:4.3},
  {title:'Café Server', company:'Bean There', location:'Bristol', pay:7.2, payDisplay:'£7.20/hr', minAge:16, rating:3.5},
  {title:'Youth Club Helper', company:'Bright Futures', location:'Leeds', pay:6.9, payDisplay:'£6.90/hr', minAge:13, rating:4.6},
  {title:'Cinema Usher', company:'CineWorld', location:'Liverpool', pay:7.5, payDisplay:'£7.50/hr', minAge:16, rating:3.2},
  {title:'Dog Grooming Assistant', company:'Paws & Claws', location:'Sheffield', pay:7.0, payDisplay:'£7.00/hr', minAge:13, rating:4.8},
  {title:'Ice Cream Vendor', company:'Frosty Treats', location:'Brighton', pay:7.1, payDisplay:'£7.10/hr', minAge:13, rating:4.5},
  {title:'Book Fair Helper', company:'BookFest', location:'Cambridge', pay:7.3, payDisplay:'£7.30/hr', minAge:16, rating:4.2},
  {title:'Junior Graphic Designer', company:'Pixel Teens', location:'London', pay:9.0, payDisplay:'£9.00/hr', minAge:16, rating:4.9},
  {title:'Junior Data Entry', company:'QuickInput', location:'Manchester', pay:8.0, payDisplay:'£8.00/hr', minAge:16, rating:3.1},
  {title:'Junior Lab Assistant', company:'BioTeens', location:'Oxford', pay:8.7, payDisplay:'£8.70/hr', minAge:16, rating:4.4},
  {title:'Junior Tour Host', company:'CityTours', location:'Edinburgh', pay:8.5, payDisplay:'£8.50/hr', minAge:16, rating:4.6},
  {title:'Junior Florist', company:'Bloom', location:'Bristol', pay:7.8, payDisplay:'£7.80/hr', minAge:16, rating:4.3},
  {title:'Junior Event Planner', company:'PlanIt', location:'London', pay:9.2, payDisplay:'£9.20/hr', minAge:16, rating:4.7},
  {title:'Junior Copywriter', company:'WriteNow', location:'Manchester', pay:8.9, payDisplay:'£8.90/hr', minAge:16, rating:4.5},
  {title:'Junior Social Worker', company:'Care4Teens', location:'Liverpool', pay:8.2, payDisplay:'£8.20/hr', minAge:18, rating:4.1},
  {title:'Junior Receptionist', company:'Smile Dental', location:'Leeds', pay:7.7, payDisplay:'£7.70/hr', minAge:16, rating:3.8},
  {title:'Junior Waiter', company:'Bella Italia', location:'Birmingham', pay:7.9, payDisplay:'£7.90/hr', minAge:16, rating:2.7},
  {title:'Junior Lifeguard', company:'WavePool', location:'Brighton', pay:8.4, payDisplay:'£8.40/hr', minAge:16, rating:4.2},
  {title:'Junior Cashier', company:'Co-op', location:'Manchester', pay:7.8, payDisplay:'£7.80/hr', minAge:16, rating:2.9},
  {title:'Junior Shop Assistant', company:'WHSmith', location:'Oxford', pay:7.6, payDisplay:'£7.60/hr', minAge:16, rating:2.5},
  {title:'Junior Barista', company:'Starbucks', location:'London', pay:8.7, payDisplay:'£8.70/hr', minAge:16, rating:3.6},
  {title:'Junior Event Helper', company:'EventEase', location:'Manchester', pay:8.2, payDisplay:'£8.20/hr', minAge:16, rating:4.1},
  {title:'Junior Dog Walker', company:'Paws Patrol', location:'Liverpool', pay:7.0, payDisplay:'£7.00/hr', minAge:13, rating:4.7},
  {title:'Junior Library Assistant', company:'City Library', location:'Bristol', pay:7.5, payDisplay:'£7.50/hr', minAge:16, rating:4.2},
  {title:'Junior Farm Helper', company:'Green Acres', location:'Oxford', pay:7.2, payDisplay:'£7.20/hr', minAge:13, rating:1.5},
  {title:'Junior Park Cleaner', company:'ParkCare', location:'London', pay:7.0, payDisplay:'£7.00/hr', minAge:13, rating:0.7},
  {title:'Junior Kitchen Porter', company:'The Blue Plate', location:'Manchester', pay:7.5, payDisplay:'£7.50/hr', minAge:16, rating:1.9},
  {title:'Junior Playground Supervisor', company:'PlayMore', location:'Cambridge', pay:7.4, payDisplay:'£7.40/hr', minAge:13, rating:3.7},
  {title:'Junior Event Helper', company:'EventEase', location:'London', pay:8.6, payDisplay:'£8.60/hr', minAge:16, rating:4.3},
];

function renderJobs() {
  const jobsGrid = document.getElementById('jobsGrid');
  if (!jobsGrid) return;
  const search = (document.querySelector('.search-input')?.value || '').toLowerCase();
  const age = document.getElementById('ageFilter')?.value;
  const pay = document.getElementById('payFilter')?.value;
  const location = document.getElementById('locationFilter')?.value;

  let filtered = jobsData.filter(job => {
    if (search && !(
      job.title.toLowerCase().includes(search) ||
      job.company.toLowerCase().includes(search) ||
      job.location.toLowerCase().includes(search)
    )) return false;
    if (age && job.minAge < parseInt(age)) return false;
    if (location && job.location !== location) return false;
    if (pay) {
      if (pay === '5-7' && (job.pay < 5 || job.pay > 7)) return false;
      if (pay === '8-10' && (job.pay < 8 || job.pay > 10)) return false;
      if (pay === '10+' && job.pay < 10) return false;
    }
    return true;
  });

  jobsGrid.innerHTML = filtered.map(job => `
    <div class="job-card">
      <div class="job-rating">${renderStars(job.rating)}</div>
      <h2>${job.title}</h2>
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Pay:</strong> ${job.payDisplay}</p>
      <p><strong>Minimum Age:</strong> ${job.minAge}+</p>
      <button class="btn btn-apply" onclick="openApplicationModal('${job.title.replace(/'/g,"&#39;")}', '${job.company.replace(/'/g,"&#39;")}', '${job.location.replace(/'/g,"&#39;")}', '${job.payDisplay}')">Apply Now</button>
    </div>
  `).join('');
}

function renderStars(rating) {
  if (!rating) return '';
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '★';
  if (half) stars += '⯪'; // Unicode left half black star (U+2BEA)
  for (let i = full + half; i < 5; i++) stars += '☆';
  // If half, replace the first empty star after the half with an empty outline (so half+empty = 1 star visually)
  if (half && stars.length < 5) {
    stars = stars.slice(0, full + 1) + '☆' + stars.slice(full + 1);
    stars = stars.slice(0, 5); // Ensure only 5 symbols
  }
  return `<span class='stars'>${stars}</span>`;
}

function requireLoginForApply(jobTitle, company, location, pay) {
  const user = getCurrentUser();
  if (!user) {
    alert('Please log in to apply for jobs.');
    if (typeof showModal === 'function') showModal('loginModal');
    return;
  }
  let users = getUsers();
  let idx = users.findIndex(u => u.username === user.username);
  if (idx !== -1) {
    if (!users[idx].appliedJobs) users[idx].appliedJobs = [];
    if (!users[idx].appliedJobs.find(j => j.title === jobTitle && j.company === company)) {
      users[idx].appliedJobs.push({ title: jobTitle, company, location, pay, date: new Date().toISOString() });
      setUsers(users);
      setCurrentUser(users[idx]);
      alert('Application submitted!');
    } else {
      alert('You have already applied for this job.');
    }
  }
}

if (document.getElementById('jobsGrid')) {
  renderJobs();
  document.querySelector('.search-input').addEventListener('input', renderJobs);
  document.getElementById('ageFilter').addEventListener('change', renderJobs);
  document.getElementById('payFilter').addEventListener('change', renderJobs);
  document.getElementById('locationFilter').addEventListener('change', renderJobs);
} 