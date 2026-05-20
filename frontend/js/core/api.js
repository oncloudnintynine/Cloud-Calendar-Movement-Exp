// ==========================================
// API & Network Communication
// ==========================================

function showLoader(show, progress, status) { 
const el = document.getElementById('loader');
el.style.display = show ? 'flex' : 'none';
if (show) {
  const barEl = document.getElementById('loader-bar');
  const statusEl = document.getElementById('loader-status');
  if (barEl) {
    if (progress !== undefined) barEl.style.width = progress + '%';
    barEl.classList.remove('error');
  }
  if (status && statusEl) statusEl.innerText = status;
}
}

async function updateProgress(progress, status) {
  showLoader(true, progress, status);
  await new Promise(r => requestAnimationFrame(r));
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function alertError(id, msg) {
const el = document.getElementById(id);
el.innerText = msg; 
el.classList.remove('hidden');
setTimeout(() => el.classList.add('hidden'), 5000);
}

async function apiCall(action, data = {}) {
try {
 let credentials = {};
 if (user && user.pass) {
     credentials = { phone: user.phone || '', pass: user.pass };
 }

 const response = await fetch(API_URL, {
   method: 'POST',
   headers: { 'Content-Type': 'text/plain;charset=utf-8' },
   redirect: 'follow',
   body: JSON.stringify({ action, data, credentials })
 });
 
 const result = await response.json();
 
 if (!result.success) {
     throw new Error(result.error);
 }
 
 return result.data;
} catch (err) {
 if(err.message.includes('Failed to fetch')) {
   showToast("Network Error or Google Permissions Expired. If you are the Administrator, please open the script editor and run INITIAL_SETUP().", "error");
 }
 throw err;
 }
 }