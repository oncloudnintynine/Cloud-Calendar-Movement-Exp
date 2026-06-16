// ==========================================
// UI, Navigation, & Formatter Logic
// ==========================================

window._searchTimeout = null;

function debouncedSearch(callback, delay) {
clearTimeout(window._searchTimeout);
window._searchTimeout = setTimeout(callback, delay || 300);
}

// --- Mobile Admin Bottom Sheet ---
function openAdminSheet() {
const sheet = document.getElementById('admin-bottom-sheet');
if (!sheet) return;
sheet.classList.remove('hidden');
document.body.classList.add('sheet-open');
const firstBtn = sheet.querySelector('button, a');
if (firstBtn) setTimeout(() => firstBtn.focus(), 300);
}

function closeAdminSheet() {
const sheet = document.getElementById('admin-bottom-sheet');
if (!sheet) return;
sheet.classList.add('hidden');
document.body.classList.remove('sheet-open');
}

// --- Mobile Admin Menu (triggers bottom sheet) ---
function openAdminMenu() {
openAdminSheet();
}

function applyMenuOrder(orderArr) {
const menuContainer = document.getElementById('slide-menu-items');
const btnCombined = document.getElementById('unified-btn-combined');
const btnLeave = document.getElementById('unified-btn-leave');
const btnEvent = document.getElementById('unified-btn-event');

if(menuContainer) {
orderArr.forEach(id => {
const btn = document.getElementById(`menu-${id}`);
if (btn) {
if (appMode === 'combined' && ['submit-leave', 'submit-event', 'my-leaves'].includes(id)) {
btn.classList.add('hidden');
} else if (appMode === 'separated' && id === 'submit-combined') {
btn.classList.add('hidden');
} else {
btn.classList.remove('hidden');
menuContainer.appendChild(btn);
}
}
});
}

// Handle action buttons row in Dashboard view based on mode
if (appMode === 'combined') {
if(btnCombined) btnCombined.classList.remove('hidden');
if(btnLeave) btnLeave.classList.add('hidden');
if(btnEvent) btnEvent.classList.add('hidden');

// Update bottom tab layout
const btmCombined = document.getElementById('bottom-submit-combined');
if (btmCombined) {
 btmCombined.classList.remove('hidden');
}
} else {
if(btnCombined) btnCombined.classList.add('hidden');
if(btnLeave) btnLeave.classList.remove('hidden');
if(btnEvent) btnEvent.classList.remove('hidden');

// Adjust bottom tab layout for separated mode
const btmCombined = document.getElementById('bottom-submit-combined');
if (btmCombined) {
 btmCombined.classList.add('hidden');
}
}
}

function switchTab(tabId) {
closeAdminSheet();
document.querySelectorAll('.tab-content').forEach(el => { el.classList.add('hidden-view'); el.classList.remove('flex'); });

const view = document.getElementById(`view-${tabId}`);
if (view) { view.classList.remove('hidden-view'); view.classList.add('flex'); }

// Handle desktop side-menu active state highlighting
document.querySelectorAll('#slide-menu-panel button[id^="menu-"]').forEach(btn => {
btn.classList.remove('bg-blue-50', 'text-blue-700', 'dark:bg-blue-900/20', 'dark:text-blue-400', 'font-bold');
});

const activeMenu = document.getElementById(`menu-${tabId}`);
if (activeMenu && activeMenu.tagName === 'BUTTON') activeMenu.classList.add('bg-blue-50', 'text-blue-700', 'dark:bg-blue-900/20', 'dark:text-blue-400', 'font-bold');

// Sync bottom bar active state (mobile only)
document.querySelectorAll('.bottom-tab').forEach(tab => {
 tab.classList.remove('bottom-tab-active', 'text-blue-600', 'dark:text-blue-400');
});

const activeBottom = document.getElementById(`bottom-${tabId}`);
if (activeBottom) {
  activeBottom.classList.add('bottom-tab-active', 'text-blue-600', 'dark:text-blue-400');
} else if (tabId.startsWith('admin') || tabId === 'kah-management') {
  const adminTab = document.getElementById('bottom-admin');
  if (adminTab) adminTab.classList.add('bottom-tab-active', 'text-blue-600', 'dark:text-blue-400');
}

const titleEl = document.getElementById('active-tab-title');
if (titleEl) {
 if (currentEditId && tabId.startsWith('submit-')) titleEl.innerText = "Update Record";
 else titleEl.innerText = TAB_NAMES[tabId] || '';
}

const deptNav = document.getElementById('dash-dept-nav');
const controlsWrapper = document.getElementById('dash-controls-wrapper');

if (controlsWrapper) {
 if (tabId === 'dashboard' || tabId === 'my-leaves') {
     if (tabId === 'dashboard') {
         if (deptNav) deptNav.classList.remove('hidden');
     } else {
         if (deptNav) deptNav.classList.add('hidden');
     }
     controlsWrapper.classList.remove('hidden');
     controlsWrapper.classList.add('flex');
 } else {
     controlsWrapper.classList.add('hidden');
     controlsWrapper.classList.remove('flex');
 }
}

if (tabId === 'parade-state' && typeof renderParadeState === 'function') renderParadeState();
if (tabId === 'admin-structure' && typeof renderStructureUI === 'function') renderStructureUI();
if (tabId === 'admin-gcal-access' && typeof renderGcalAccessUI === 'function') renderGcalAccessUI();
if ((tabId.startsWith('admin') || tabId === 'kah-management') && typeof initAdminAccordions === 'function') initAdminAccordions();
if ((tabId === 'dashboard' || tabId === 'my-leaves') && typeof renderTabIfActive === 'function') renderTabIfActive(tabId);
}

function toggleTheme() {
document.documentElement.classList.toggle('dark');
const isDark = document.documentElement.classList.contains('dark');
localStorage.setItem('theme', isDark ? 'dark' : 'light');
const metaTheme = document.getElementById('theme-color-meta');
if (metaTheme) metaTheme.setAttribute('content', isDark ? '#121212' : '#ffffff');

// Update theme toggle icons
const iconSun = document.getElementById('theme-icon-sun');
const iconMoon = document.getElementById('theme-icon-moon');
if (iconSun && iconMoon) {
 if (isDark) {
   iconSun.classList.remove('hidden');
   iconMoon.classList.add('hidden');
 } else {
   iconSun.classList.add('hidden');
   iconMoon.classList.remove('hidden');
 }
}
}

// Initial theme icon setup
document.addEventListener('DOMContentLoaded', () => {
 const isDark = document.documentElement.classList.contains('dark');
 const iconSun = document.getElementById('theme-icon-sun');
 const iconMoon = document.getElementById('theme-icon-moon');
 if (iconSun && iconMoon) {
   if (isDark) {
     iconSun.classList.remove('hidden');
     iconMoon.classList.add('hidden');
   } else {
     iconSun.classList.add('hidden');
     iconMoon.classList.remove('hidden');
   }
 }
});

function togglePassword(id, btnElement) {
const el = document.getElementById(id);
const isPassword = el.type === 'password';
el.type = isPassword ? 'text' : 'password';
if (btnElement) {
btnElement.innerHTML = isPassword 
 ? `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>`
 : `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>`;
}
}

window.toggleDashSearchClear = function() {
const input = document.getElementById('dash-search');
const btn = document.getElementById('dash-search-clear');
if(input && btn) {
if(input.value.length > 0) btn.classList.remove('hidden');
else btn.classList.add('hidden');
}
};

function formatDisplayDate(dateObj) {
if (isNaN(dateObj)) return '';
return `${String(dateObj.getDate()).padStart(2,'0')} ${mos[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

function formatDisplayDateTime(dateObj) {
if (isNaN(dateObj)) return '';
return `${formatDisplayDate(dateObj)} ${String(dateObj.getHours()).padStart(2,'0')}:${String(dateObj.getMinutes()).padStart(2,'0')}`;
}

function getRoundedTime() {
const now = new Date();
const ms = 1000 * 60 * 5; 
return new Date(Math.ceil(now.getTime() / ms) * ms);
}

function initDates() {
const nowRounded = getRoundedTime();
const oneHourLater = new Date(nowRounded.getTime() + 60 * 60 * 1000);

appData.leave.startD = new Date(nowRounded); appData.leave.endD = new Date(nowRounded);
appData.event.startD = new Date(nowRounded); appData.event.endD = new Date(oneHourLater);
appData.combined.startD = new Date(nowRounded); appData.combined.endD = new Date(oneHourLater);
appData.parade.targetD = new Date(nowRounded);

appData.register.birthdayD = new Date(2000, 0, 1);
appData.adminRegister.birthdayD = new Date(2000, 0, 1);
appData.manageUser.birthdayD = new Date(2000, 0, 1);

appData.register.birthdaySelected = false;
appData.adminRegister.birthdaySelected = false;
appData.manageUser.birthdaySelected = false;

updateButtonLabels();
}

function updateButtonLabels() {
const checkAndUpdate = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };

checkAndUpdate('btn-leave-start', formatDisplayDate(appData.leave.startD));
checkAndUpdate('btn-leave-end', formatDisplayDate(appData.leave.endD));

checkAndUpdate('btn-event-start', appData.event.isAllDay ? formatDisplayDate(appData.event.startD) : formatDisplayDateTime(appData.event.startD));
checkAndUpdate('btn-event-end', appData.event.isAllDay ? formatDisplayDate(appData.event.endD) : formatDisplayDateTime(appData.event.endD));
checkAndUpdate('btn-event-until', formatDisplayDate(appData.event.untilD));

checkAndUpdate('btn-combined-event-start', appData.combined.isAllDay ? formatDisplayDate(appData.combined.startD) : formatDisplayDateTime(appData.combined.startD));
checkAndUpdate('btn-combined-event-end', appData.combined.isAllDay ? formatDisplayDate(appData.combined.endD) : formatDisplayDateTime(appData.combined.endD));
checkAndUpdate('btn-combined-leave-start', formatDisplayDate(appData.combined.startD));
checkAndUpdate('btn-combined-leave-end', formatDisplayDate(appData.combined.endD));
checkAndUpdate('btn-combined-until', formatDisplayDate(appData.combined.untilD));

checkAndUpdate('btn-parade-target', formatDisplayDateTime(appData.parade.targetD));

checkAndUpdate('btn-register-birthday', appData.register.birthdaySelected ? formatDisplayDate(appData.register.birthdayD) : "Select...");
checkAndUpdate('btn-admin-register-birthday', appData.adminRegister.birthdaySelected ? formatDisplayDate(appData.adminRegister.birthdayD) : "Select...");
checkAndUpdate('btn-manage-user-birthday', appData.manageUser.birthdaySelected ? formatDisplayDate(appData.manageUser.birthdayD) : "Select...");
}

window.downloadVCF = function() {
if (!companyContacts || companyContacts.length === 0) {
if (window.showToast) showToast("Directory is empty or still loading.", "warning");
else alert("Directory is empty or still loading.");
return;
}

let vcfData = "";
companyContacts.forEach(c => {
const name = c.name || "";
const phone = c.phone || "";
const org = c.dept ? c.dept.split(',')[0].trim() : "Cloudy";

vcfData += "BEGIN:VCARD\r\n";
vcfData += "VERSION:3.0\r\n";
vcfData += `FN:${name}\r\n`;
if (org) vcfData += `ORG:${org}\r\n`;
if (phone) vcfData += `TEL;TYPE=CELL:${phone}\r\n`;
vcfData += "END:VCARD\r\n";
});

const blob = new Blob([vcfData], { type: 'text/vcard;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', 'Cloudy_Directory.vcf');
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
URL.revokeObjectURL(url);
if (window.showToast) showToast("Contacts file generated.", "success");
};

function animateAndUpdate(btn) { 
const icon = btn.querySelector('svg'); 
if (icon) icon.classList.add('animate-spin'); 
setTimeout(async () => { 
await updateApp(); 
if (icon) icon.classList.remove('animate-spin'); 
}, 300); 
}

async function updateApp() {
if ('serviceWorker' in navigator) {
try { 
 const regs = await navigator.serviceWorker.getRegistrations(); 
 for (let reg of regs) await reg.unregister(); 
 if (window.caches) {
   const names = await caches.keys(); 
   for (let name of names) await caches.delete(name); 
 }
} catch(err) {}
}
window.location.reload();
}