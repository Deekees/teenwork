// main.js for TeenWork

// Application Modal Logic
function openApplicationModal(title, company, location, pay) {
  document.getElementById('modalJobTitle').textContent = title;
  document.getElementById('modalCompany').textContent = 'Company: ' + company;
  document.getElementById('modalLocation').textContent = 'Location: ' + location;
  document.getElementById('modalPay').textContent = 'Pay: ' + pay;
  document.getElementById('applicationModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeApplicationModal() {
  document.getElementById('applicationModal').classList.remove('active');
  document.body.style.overflow = '';
}
function submitApplication(e) {
  e.preventDefault();
  closeApplicationModal();
  showApplicationSuccessModal();
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
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
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
  window.location.href = 'index.html';
}
if (logoutBtn) logoutBtn.onclick = logout;

function updateAuthUI() {
  const user = getCurrentUser();
  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = '';
    // Hide dashboardNav for admin users
    if (dashboardNav) {
      if (user.role === 'admin') {
        dashboardNav.style.display = 'none';
      } else {
        dashboardNav.style.display = '';
        if (user.role === 'employer') {
          dashboardNav.querySelector('a').setAttribute('href', 'employer-dashboard.html');
          dashboardNav.querySelector('a').textContent = 'Employer Dashboard';
        } else {
          dashboardNav.querySelector('a').setAttribute('href', 'dashboard.html');
          dashboardNav.querySelector('a').textContent = 'Dashboard';
        }
      }
    }
  } else {
    if (loginBtn) loginBtn.style.display = '';
    if (signupBtn) signupBtn.style.display = '';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (dashboardNav) dashboardNav.style.display = 'none';
  }
}
updateAuthUI();

const adminNav = document.getElementById('adminNav');
const user = getCurrentUser();
if (adminNav) {
  if (user && user.username === 'admin') {
    adminNav.style.display = '';
    // Ensure admin user has role 'admin'
    let users = getUsers();
    let idx = users.findIndex(u => u.username === 'admin');
    if (idx !== -1 && users[idx].role !== 'admin') {
      users[idx].role = 'admin';
      setUsers(users);
    }
  } else {
    adminNav.style.display = 'none';
  }
}

// Signup logic
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    let users = getUsers();
    if (users.find(u => u.username === username || u.email === email)) {
      alert('User already exists with that username or email.');
      return;
    }
    const user = { name, username, email, password, appliedJobs: [], createdAt: new Date().toISOString() };
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
    // No popup on login
    // Redirect to respective dashboard
    if (user.role === 'admin') {
      window.location.href = 'admin.html';
    } else if (user.role === 'employer') {
      window.location.href = 'employer-dashboard.html';
    } else {
      window.location.href = 'dashboard.html';
    }
  };
}

// --- Job Filtering Logic ---
const jobsData = [];

// --- Job Storage Logic ---
function getAllJobs() {
  // Merge default jobsData with jobs in localStorage (avoiding duplicates by title+company)
  let stored = JSON.parse(localStorage.getItem('allJobs') || '[]');
  // Avoid duplicate jobs (by title+company)
  const merged = [...jobsData];
  stored.forEach(job => {
    if (!merged.some(j => j.title === job.title && j.company === job.company)) {
      merged.push(job);
    }
  });
  return merged;
}
function setAllJobs(jobs) {
  // Only store jobs not in jobsData (i.e., employer-created)
  const toStore = jobs.filter(j => !jobsData.some(dj => dj.title === j.title && dj.company === j.company));
  localStorage.setItem('allJobs', JSON.stringify(toStore));
}

// --- Employer Dashboard Logic ---
if (document.getElementById('createJobForm')) {
  window.editingJobIndex = null;
  let jobToRemoveIdx = null;
  document.getElementById('createJobForm').onsubmit = function(e) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user || user.role !== 'employer') {
      alert('Only employers can create jobs.');
      return;
    }
    const title = document.getElementById('jobTitle').value.trim();
    const company = user.company || '';
    const location = document.getElementById('jobLocation').value.trim();
    let payRaw = document.getElementById('jobPay').value.trim();
    let payNum = parseFloat(payRaw.replace(/[^\d.]/g, ''));
    let payDisplay = payRaw.match(/\d/) ? payRaw : '';
    if (!payDisplay && !isNaN(payNum)) payDisplay = `£${payNum.toFixed(2)}/hr`;
    const minAge = parseInt(document.getElementById('jobMinAge').value);
    const closingDate = document.getElementById('jobClosingDate').value;
    const description = document.getElementById('jobDescription').value.trim();
    if (!title || !company || !location || isNaN(payNum) || !payDisplay || !minAge || !closingDate || !description) {
      alert('Please fill in all fields with valid values.');
      return;
    }
    let jobs = getAllJobs();
    if (editingJobIndex !== null) {
      // Update existing job
      let job = jobs[editingJobIndex];
      job.title = title;
      job.company = company;
      job.location = location;
      job.pay = payNum;
      job.payDisplay = payDisplay;
      job.minAge = minAge;
      job.closingDate = closingDate;
      job.description = description;
      job.updatedAt = new Date().toISOString();
      jobs[editingJobIndex] = job;
      setAllJobs(jobs);
      editingJobIndex = null;
      document.getElementById('createJobForm').reset();
      document.getElementById('createJobForm').querySelector('button[type="submit"]').textContent = 'Create Job';
      renderEmployerJobs();
      if (typeof renderJobs === 'function') renderJobs();
      showJobCreatedModal();
      return;
    }
    // Create new job
    const newJob = {
      title,
      company,
      location,
      pay: payNum,
      payDisplay,
      minAge,
      closingDate,
      description,
      createdBy: user.username,
      createdAt: new Date().toISOString(),
    };
    jobs.push(newJob);
    setAllJobs(jobs);
    document.getElementById('createJobForm').reset();
    renderEmployerJobs();
    if (typeof renderJobs === 'function') renderJobs();
    showJobCreatedModal();
  };
  function renderEmployerJobs() {
    const user = getCurrentUser();
    if (!user) return;
    let jobs = getAllJobs();
    let myJobs = jobs.map((j, idx) => ({...j, _idx: idx})).filter(j => j.createdBy === user.username);
    const list = document.getElementById('employerJobsList');
    if (!list) return;
    if (myJobs.length === 0) {
      list.innerHTML = '<p style="color:#888;">No job listings yet. Jobs you create will appear here.</p>';
    } else {
      list.innerHTML = myJobs.map(j => `
        <div class="job-card" style="margin-bottom:1.5em; cursor:pointer;${isJobClosed(j) ? 'opacity:0.6;' : ''}" onclick="viewApplicantsForJob(${j._idx})">
          <h3>${j.title}</h3>
          <p><strong>Company:</strong> ${j.company}</p>
          <p><strong>Location:</strong> ${j.location}</p>
          <p><strong>Pay:</strong> ${j.payDisplay}</p>
          <p><strong>Minimum Age:</strong> ${j.minAge}+</p>
          <p><strong>Closing Date:</strong> ${j.closingDate ? j.closingDate : '<span style=\'color:#aaa\'>(not set)</span>'}${isJobClosed(j) ? ' <span style=\'color:#e74c3c; font-weight:600;\'>(Closed)</span>' : ''}</p>
          <p>${j.description}</p>
          <p style=\"color:#aaa;font-size:0.95em;\">Created: ${new Date(j.createdAt).toLocaleString()}${j.updatedAt ? '<br>Updated: ' + new Date(j.updatedAt).toLocaleString() : ''}</p>
          <button class='btn' onclick='event.stopPropagation(); window.editEmployerJob(${j._idx})' style='margin-right:0.7em;'>Edit</button>
          <button class='btn' style='background:#e74c3c; color:#fff;' onclick='event.stopPropagation(); deleteEmployerJob(${j._idx})'>Delete</button>
        </div>
      `).join('');
    }
  }
  window.renderEmployerJobs = renderEmployerJobs;
  renderEmployerJobs();

  // --- Edit Job Logic ---
  window.editEmployerJob = function(idx) {
    const jobs = getAllJobs();
    const job = jobs[idx];
    if (!job) return;
    window.editingJobIndex = idx;
    document.getElementById('editJobTitle').value = job.title;
    document.getElementById('editJobCompany').value = job.company;
    document.getElementById('editJobLocation').value = job.location;
    document.getElementById('editJobPay').value = job.payDisplay;
    document.getElementById('editJobMinAge').value = job.minAge;
    document.getElementById('editJobClosingDate').value = job.closingDate || '';
    document.getElementById('editJobDescription').value = job.description;
    document.getElementById('editJobModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  // --- Applicants Modal Logic ---
  window.viewApplicantsForJob = function(idx) {
    const jobs = getAllJobs();
    const job = jobs[idx];
    if (!job) return;
    // For demo: assume job.applicants is an array of usernames
    const applicants = job.applicants || [];
    const users = getUsers();
    const applicantList = document.getElementById('applicantList');
    const applicantProfile = document.getElementById('applicantProfile');
    if (!applicantList || !applicantProfile) return;
    if (applicants.length === 0) {
      applicantList.innerHTML = '<li style="color:#888;">No applicants yet.</li>';
      applicantProfile.innerHTML = '';
    } else {
      applicantList.innerHTML = applicants.map((username, i) => {
        const user = users.find(u => u.username === username);
        return `<li style='cursor:pointer; padding:0.5em 0.7em; border-radius:8px; background:#fff; box-shadow:0 2px 8px #e3f1fa;' onclick='selectApplicantForJob(${idx},${i})'>${user ? user.name || user.username : username}</li>`;
      }).join('');
      window.selectApplicantForJob = function(jobIdx, applicantIdx) {
        const jobs = getAllJobs();
        const job = jobs[jobIdx];
        const applicants = job.applicants || [];
        const users = getUsers();
        const username = applicants[applicantIdx];
        const user = users.find(u => u.username === username);
        if (!user) {
          applicantProfile.innerHTML = '<p style="color:#888;">Applicant profile not found.</p>';
          return;
        }
        applicantProfile.innerHTML = `
          <h3 style='color:#3bb4e5; margin-bottom:0.7em;'>${user.name || user.username}</h3>
          <p><strong>Username:</strong> ${user.username}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Age:</strong> ${user.age ? user.age : '<span style=\'color:#aaa\'>(not set)</span>'}</p>
          <p><strong>Location:</strong> ${user.location ? user.location : '<span style=\'color:#aaa\'>(not set)</span>'}</p>
          <p><strong>About Me:</strong><br>${user.about ? user.about : '<span style=\'color:#aaa\'>(not set)</span>'}</p>
          <p><strong>Skills:</strong> ${user.skills ? user.skills : '<span style=\'color:#aaa\'>(not set)</span>'}</p>
          <p><strong>Interests:</strong> ${user.interests ? user.interests : '<span style=\'color:#aaa\'>(not set)</span>'}</p>
          <p><strong>Education:</strong> ${user.education ? user.education : '<span style=\'color:#aaa\'>(not set)</span>'}</p>
          <p><strong>Achievements:</strong> ${user.achievements ? user.achievements : '<span style=\'color:#aaa\'>(not set)</span>'}</p>
        `;
      };
      // Show first applicant by default
      window.selectApplicantForJob(idx, 0);
    }
    document.getElementById('viewApplicantsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  if (document.getElementById('closeViewApplicantsModal')) {
    document.getElementById('closeViewApplicantsModal').onclick = function() {
      document.getElementById('viewApplicantsModal').classList.remove('active');
      document.body.style.overflow = '';
    };
  }
  // Modal close logic
  if (document.getElementById('closeEditJobModal')) {
    document.getElementById('closeEditJobModal').onclick = function() {
      document.getElementById('editJobModal').classList.remove('active');
      document.body.style.overflow = '';
      editingJobIndex = null;
    };
  }
  // Modal form submit logic
  if (document.getElementById('editJobForm')) {
    document.getElementById('editJobForm').onsubmit = function(e) {
      e.preventDefault();
      const user = getCurrentUser();
      if (!user || user.role !== 'employer') {
        alert('Only employers can edit jobs.');
        return;
      }
      const title = document.getElementById('editJobTitle').value.trim();
      const company = document.getElementById('editJobCompany').value.trim();
      const location = document.getElementById('editJobLocation').value.trim();
      const pay = document.getElementById('editJobPay').value.trim();
      const minAge = parseInt(document.getElementById('editJobMinAge').value);
      const closingDate = document.getElementById('editJobClosingDate').value;
      const description = document.getElementById('editJobDescription').value.trim();
      if (!title || !company || !location || !pay || !minAge || !closingDate || !description) {
        alert('Please fill in all fields.');
        return;
      }
      let jobs = getAllJobs();
      if (editingJobIndex !== null) {
        // Update existing job
        let job = jobs[editingJobIndex];
        job.title = title;
        job.company = company;
        job.location = location;
        job.pay = parseFloat(pay.replace(/[^\d.]/g, ''));
        job.payDisplay = pay;
        job.minAge = minAge;
        job.closingDate = closingDate;
        job.description = description;
        job.updatedAt = new Date().toISOString();
        if (!job.createdBy) job.createdBy = user.username; // Ensure createdBy is always set
        jobs[editingJobIndex] = job;
        setAllJobs(jobs);
        editingJobIndex = null;
        renderEmployerJobs();
        if (typeof renderJobs === 'function') renderJobs();
        document.getElementById('editJobModal').classList.remove('active');
        document.body.style.overflow = '';
        alert('Job updated!');
        return;
      }
    };
  }
  window.deleteEmployerJob = function(idx) {
    jobToRemoveIdx = idx;
    document.getElementById('removeEmployerJobModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  if (document.getElementById('closeRemoveEmployerJobModal')) {
    document.getElementById('closeRemoveEmployerJobModal').onclick = function() {
      document.getElementById('removeEmployerJobModal').classList.remove('active');
      document.body.style.overflow = '';
      jobToRemoveIdx = null;
    };
  }
  if (document.getElementById('cancelRemoveEmployerJobBtn')) {
    document.getElementById('cancelRemoveEmployerJobBtn').onclick = function() {
      document.getElementById('removeEmployerJobModal').classList.remove('active');
      document.body.style.overflow = '';
      jobToRemoveIdx = null;
    };
  }
  if (document.getElementById('confirmRemoveEmployerJobBtn')) {
    document.getElementById('confirmRemoveEmployerJobBtn').onclick = function() {
      if (jobToRemoveIdx !== null) {
        let jobs = getAllJobs();
        const removedJob = jobs[jobToRemoveIdx];
        jobs.splice(jobToRemoveIdx, 1);
        setAllJobs(jobs);
        // Remove from all users' appliedJobs
        let users = getUsers();
        let changed = false;
        users.forEach(u => {
          if (u.appliedJobs) {
            const before = u.appliedJobs.length;
            u.appliedJobs = u.appliedJobs.filter(j => !(j.title === removedJob.title && j.company === removedJob.company));
            if (u.appliedJobs.length !== before) changed = true;
          }
        });
        if (changed) setUsers(users);
        // Update currentUser if needed
        let currentUser = getCurrentUser();
        if (currentUser && currentUser.appliedJobs) {
          const before = currentUser.appliedJobs.length;
          currentUser.appliedJobs = currentUser.appliedJobs.filter(j => !(j.title === removedJob.title && j.company === removedJob.company));
          if (currentUser.appliedJobs.length !== before) setCurrentUser(currentUser);
        }
        renderEmployerJobs();
        if (typeof renderJobs === 'function') renderJobs();
        // Reload dashboard if on it
        if (window.location.pathname.endsWith('dashboard.html')) {
          setTimeout(() => window.location.reload(), 500);
        }
      }
      document.getElementById('removeEmployerJobModal').classList.remove('active');
      document.body.style.overflow = '';
      jobToRemoveIdx = null;
    };
  }
}

// --- Pagination for Jobs Page ---
let jobsCurrentPage = 1;
const jobsPerPage = 9;
function renderJobsPagination(totalJobs) {
  const pagination = document.getElementById('jobsPagination');
  if (!pagination) return;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  let html = '';
  if (jobsCurrentPage > 1) {
    html += `<button class='btn' onclick='changeJobsPage(${jobsCurrentPage - 1})'>&laquo; Prev</button>`;
  }
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class='btn${i === jobsCurrentPage ? ' btn-primary' : ''}' onclick='changeJobsPage(${i})'>${i}</button>`;
  }
  if (jobsCurrentPage < totalPages) {
    html += `<button class='btn' onclick='changeJobsPage(${jobsCurrentPage + 1})'>Next &raquo;</button>`;
  }
  pagination.innerHTML = html;
}
window.changeJobsPage = function(page) {
  jobsCurrentPage = page;
  renderJobs();
};
// --- Update renderJobs to use pagination ---
function renderJobs() {
  const jobsGrid = document.getElementById('jobsGrid');
  if (!jobsGrid) return;
  const search = (document.querySelector('.search-input')?.value || '').toLowerCase();
  const age = document.getElementById('ageFilter')?.value;
  const minPay = parseFloat(document.getElementById('minPayInput')?.value);
  const sort = document.getElementById('sortFilter')?.value;

  let filtered = getAllJobs().filter(job => {
    if (isJobClosed(job)) return false;
    if (search && !(
      job.title.toLowerCase().includes(search) ||
      job.company.toLowerCase().includes(search) ||
      (job.location && job.location.toLowerCase().includes(search))
    )) return false;
    if (age && job.minAge < parseInt(age)) return false;
    if (!isNaN(minPay)) {
      let payNum = typeof job.pay === 'number' ? job.pay : parseFloat((job.payDisplay||'').replace(/[^\d.]/g, ''));
      if (isNaN(payNum) || payNum < minPay) return false;
    }
    return true;
  });

  // Sort logic (same as before)
  if (sort) {
    filtered = filtered.slice(); // copy array
    switch (sort) {
      case 'alpha-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'alpha-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'pay-desc':
        filtered.sort((a, b) => (b.pay || 0) - (a.pay || 0));
        break;
      case 'pay-asc':
        filtered.sort((a, b) => (a.pay || 0) - (b.pay || 0));
        break;
      case 'age-asc':
        filtered.sort((a, b) => (a.minAge || 0) - (b.minAge || 0));
        break;
      case 'age-desc':
        filtered.sort((a, b) => (b.minAge || 0) - (a.minAge || 0));
        break;
    }
  }

  // Pagination logic
  const totalJobs = filtered.length;
  renderJobsPagination(totalJobs);
  const startIdx = (jobsCurrentPage - 1) * jobsPerPage;
  const endIdx = startIdx + jobsPerPage;
  const jobsToShow = filtered.slice(startIdx, endIdx);

  const user = getCurrentUser();
  jobsGrid.innerHTML = jobsToShow.length > 0 ? jobsToShow.map((job, idx) => {
    let alreadyApplied = false;
    if (user && user.appliedJobs) {
      alreadyApplied = user.appliedJobs.some(j => j.title === job.title && j.company === job.company);
    }
    let buttonHtml = '';
    if (user && user.role === 'admin') {
      buttonHtml = `<button class="btn btn-apply" style="background:#e74c3c; color:#fff; margin-right:0.7em;" onclick="event.stopPropagation(); window.deleteJobPost('${job.title.replace(/'/g, "&#39;")}', '${job.company.replace(/'/g, "&#39;")}')">Delete</button>`;
    } else if (user && user.role === 'employer') {
      buttonHtml = '<button class="btn btn-apply" style="background:#bfc9d1; color:#fff; box-shadow:none; cursor:not-allowed; opacity:0.7;" disabled>Not available for your role</button>';
    } else if (user) {
      if (alreadyApplied) {
        buttonHtml = '<button class="btn btn-apply" style="background:#bfc9d1; color:#fff; box-shadow:none; cursor:not-allowed; opacity:0.7;" disabled>Already Applied</button>';
      } else {
        buttonHtml = `<button class="btn btn-apply" onclick="requireLoginForApply('${job.title.replace(/'/g,"&#39;")}', '${job.company.replace(/'/g,"&#39;")}', '${job.location.replace(/'/g,"&#39;")}', '${job.payDisplay}')">Apply Now</button>`;
      }
    } else {
      buttonHtml = `<button class="btn btn-apply" onclick="requireLoginForApply('${job.title.replace(/'/g,"&#39;")}', '${job.company.replace(/'/g,"&#39;")}', '${job.location.replace(/'/g,"&#39;")}', '${job.payDisplay}')">Apply Now</button>`;
    }
    // Use data-job-idx for reliable event delegation
    return `
      <div class="job-card" style="cursor:pointer;" data-job-idx="${jobsToShow.indexOf(job)}">
        <h2>${job.title}</h2>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Pay:</strong> ${job.payDisplay}</p>
        <p><strong>Minimum Age:</strong> ${job.minAge}+</p>
        <p><strong>Closing Date:</strong> ${job.closingDate ? job.closingDate : '<span style=\'color:#aaa\'>(not set)</span>'}</p>
        ${buttonHtml}
      </div>
    `;
  }).join('') : '<div style="text-align:center; color:#888; font-size:1.15em; margin:2.5em 0;">No jobs found matching your search or filters.<br>Try adjusting your search or check back later for new opportunities!</div>';
  // Store jobsToShow for modal access
  window._jobsToShow = jobsToShow;
  // Update filters dynamically
  updateJobFilters(getAllJobs());
}
// Delegated click event for job cards
const jobsGrid = document.getElementById('jobsGrid');
if (jobsGrid) {
  jobsGrid.addEventListener('click', function(e) {
    const card = e.target.closest('.job-card');
    if (!card || e.target.classList.contains('btn-apply')) return;
    const idx = card.getAttribute('data-job-idx');
    if (window._jobsToShow && window._jobsToShow[idx]) {
      openJobDescriptionModal(window._jobsToShow[idx]);
    }
  });
}
window.openJobDescriptionModal = function(job) {
  document.getElementById('modalJobDescTitle').textContent = job.title;
  document.getElementById('modalJobDescCompany').textContent = job.company;
  document.getElementById('modalJobDescText').innerHTML = `
    <p><strong>Location:</strong> ${job.location}</p>
    <p><strong>Pay:</strong> ${job.payDisplay}</p>
    <p><strong>Minimum Age:</strong> ${job.minAge}+</p>
    <p><strong>Closing Date:</strong> ${job.closingDate ? job.closingDate : '<span style=\'color:#aaa\'>(not set)</span>'}</p>
    <div style="margin-top:1em; text-align:left;"><strong>Description:</strong><br>${job.description || 'No description provided.'}</div>
  `;
  // Render Apply Now button
  const user = getCurrentUser();
  let buttonHtml = '';
  if (user && (user.role === 'employer' || user.role === 'admin')) {
    buttonHtml = '<button class="btn btn-apply" style="background:#bfc9d1; color:#fff; box-shadow:none; cursor:not-allowed; opacity:0.7;" disabled>Not available for your role</button>';
  } else if (user) {
    let alreadyApplied = user.appliedJobs && user.appliedJobs.some(j => j.title === job.title && j.company === job.company);
    if (alreadyApplied) {
      buttonHtml = '<button class="btn btn-apply" style="background:#bfc9d1; color:#fff; box-shadow:none; cursor:not-allowed; opacity:0.7;" disabled>Already Applied</button>';
    } else {
      buttonHtml = `<button class="btn btn-apply" id="modalApplyBtn">Apply Now</button>`;
    }
  } else {
    buttonHtml = `<button class="btn btn-apply" id="modalApplyBtn">Apply Now</button>`;
  }
  document.getElementById('modalJobDescApplyBtn').innerHTML = buttonHtml;
  // Add event for Apply Now
  const applyBtn = document.getElementById('modalApplyBtn');
  if (applyBtn) {
    applyBtn.onclick = function() {
      requireLoginForApply(job.title, job.company, job.location, job.payDisplay);
      closeJobDescriptionModal();
    };
  }
  document.getElementById('jobDescriptionModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeJobDescriptionModal() {
  document.getElementById('jobDescriptionModal').classList.remove('active');
  document.body.style.overflow = '';
}
if (document.getElementById('closeJobDescriptionModal')) {
  document.getElementById('closeJobDescriptionModal').onclick = closeJobDescriptionModal;
}
if (document.getElementById('closeJobDescriptionBtn')) {
  document.getElementById('closeJobDescriptionBtn').onclick = closeJobDescriptionModal;
}

function showApplicationSuccessModal() {
  document.getElementById('applicationSuccessModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeApplicationSuccessModal() {
  document.getElementById('applicationSuccessModal').classList.remove('active');
  document.body.style.overflow = '';
}
// Add event listeners for modal close
if (document.getElementById('closeApplicationSuccessModal')) {
  document.getElementById('closeApplicationSuccessModal').onclick = closeApplicationSuccessModal;
}
if (document.getElementById('closeApplicationSuccessBtn')) {
  document.getElementById('closeApplicationSuccessBtn').onclick = closeApplicationSuccessModal;
}

function requireLoginForApply(jobTitle, company, location, pay) {
  const user = getCurrentUser();
  if (!user) {
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
      // --- Add applicant to job's applicants array ---
      let jobs = getAllJobs();
      let jobIdx = jobs.findIndex(j => j.title === jobTitle && j.company === company);
      if (jobIdx !== -1) {
        if (!jobs[jobIdx].applicants) jobs[jobIdx].applicants = [];
        if (!jobs[jobIdx].applicants.includes(user.username)) {
          jobs[jobIdx].applicants.push(user.username);
          setAllJobs(jobs);
        }
      }
      showApplicationSuccessModal();
      if (typeof renderJobs === 'function') renderJobs();
      if (typeof updateBestRatedJobButtons === 'function') updateBestRatedJobButtons();
      // Force dashboard reload if on dashboard page
      if (window.location.pathname.endsWith('dashboard.html')) {
        setTimeout(() => window.location.reload(), 500);
      }
      if (window.location.pathname.endsWith('employer-dashboard.html')) {
        setTimeout(() => window.location.reload(), 500);
      }
    } else {
      alert('You have already applied for this job.');
    }
  }
}

if (document.getElementById('jobsGrid')) {
  renderJobs();
  document.querySelector('.search-input').addEventListener('input', renderJobs);
  document.getElementById('ageFilter').addEventListener('change', renderJobs);
  document.getElementById('minPayInput').addEventListener('input', renderJobs);
  const sortFilter = document.getElementById('sortFilter');
  if (sortFilter) sortFilter.addEventListener('change', renderJobs);
} 

// --- HERO SLIDER LOGIC ---
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  const dotsContainer = document.getElementById('heroDots');
  let current = 0;
  let autoSlideTimer = null;
  if (!slides.length) return;

  // Create dots
  function renderDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'hero-slider-dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
    current = idx;
    renderDots();
  }

  function goToSlide(idx) {
    showSlide(idx);
    resetAutoSlide();
  }

  function nextSlide() {
    let idx = (current + 1) % slides.length;
    showSlide(idx);
    resetAutoSlide();
  }

  function prevSlide() {
    let idx = (current - 1 + slides.length) % slides.length;
    showSlide(idx);
    resetAutoSlide();
  }

  function resetAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, 6000);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Touch swipe support
  let startX = null;
  slides.forEach(slide => {
    slide.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });
    slide.addEventListener('touchend', e => {
      if (startX === null) return;
      let endX = e.changedTouches[0].clientX;
      if (endX - startX > 50) prevSlide();
      else if (startX - endX > 50) nextSlide();
      startX = null;
    });
  });

  showSlide(0);
  resetAutoSlide();
})(); 

function showJobCreatedModal() {
  document.getElementById('jobCreatedModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeJobCreatedModal() {
  document.getElementById('jobCreatedModal').classList.remove('active');
  document.body.style.overflow = '';
}
if (document.getElementById('closeJobCreatedModal')) {
  document.getElementById('closeJobCreatedModal').onclick = closeJobCreatedModal;
}
if (document.getElementById('closeJobCreatedBtn')) {
  document.getElementById('closeJobCreatedBtn').onclick = closeJobCreatedModal;
} 

function updateJobFilters(jobs) {} 

let adminDeleteJob = null;
window.deleteJobPost = function(title, company) {
  adminDeleteJob = { title, company };
  document.getElementById('adminDeleteJobModal').classList.add('active');
  document.body.style.overflow = 'hidden';
};
function closeAdminDeleteJobModal() {
  document.getElementById('adminDeleteJobModal').classList.remove('active');
  document.body.style.overflow = '';
  adminDeleteJob = null;
}
if (document.getElementById('closeAdminDeleteJobModal')) {
  document.getElementById('closeAdminDeleteJobModal').onclick = closeAdminDeleteJobModal;
}
if (document.getElementById('cancelAdminDeleteJobBtn')) {
  document.getElementById('cancelAdminDeleteJobBtn').onclick = closeAdminDeleteJobModal;
}
if (document.getElementById('confirmAdminDeleteJobBtn')) {
  document.getElementById('confirmAdminDeleteJobBtn').onclick = function() {
    if (!adminDeleteJob) return;
    let jobs = getAllJobs();
    let idx = jobs.findIndex(j => j.title === adminDeleteJob.title && j.company === adminDeleteJob.company);
    if (idx !== -1) {
      const removedJob = jobs[idx];
      jobs.splice(idx, 1);
      setAllJobs(jobs);
      // Remove from all users' appliedJobs
      let users = getUsers();
      let changed = false;
      users.forEach(u => {
        if (u.appliedJobs) {
          const before = u.appliedJobs.length;
          u.appliedJobs = u.appliedJobs.filter(j => !(j.title === removedJob.title && j.company === removedJob.company));
          if (u.appliedJobs.length !== before) changed = true;
        }
      });
      if (changed) setUsers(users);
      // Update currentUser if needed
      let currentUser = getCurrentUser();
      if (currentUser && currentUser.appliedJobs) {
        const before = currentUser.appliedJobs.length;
        currentUser.appliedJobs = currentUser.appliedJobs.filter(j => !(j.title === removedJob.title && j.company === removedJob.company));
        if (currentUser.appliedJobs.length !== before) setCurrentUser(currentUser);
      }
      renderJobs();
      // Reload dashboard if on it
      if (window.location.pathname.endsWith('dashboard.html')) {
        setTimeout(() => window.location.reload(), 500);
      }
    }
    closeAdminDeleteJobModal();
  };
} 

function isJobClosed(job) {
  if (!job.closingDate) return false;
  const today = new Date();
  const closing = new Date(job.closingDate);
  closing.setHours(23,59,59,999); // include the whole closing day
  return closing < today;
} 