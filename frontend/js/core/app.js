// ==========================================
// Main Application Initialization
// ==========================================

const savedTheme = localStorage.getItem('theme');
const wantsDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

if(wantsDark) document.documentElement.classList.add('dark');

document.addEventListener('DOMContentLoaded', () => {
const metaTheme = document.getElementById('theme-color-meta');
if (metaTheme) metaTheme.setAttribute('content', wantsDark ? '#121212' : '#ffffff');

// Environment Banner Logic
const devBanner = document.getElementById('dev-banner');
if (devBanner && ENV !== 'Prod') {
 devBanner.classList.remove('hidden-view');
 devBanner.innerText = `${ENV.toUpperCase()} MODE`;
 if (ENV === 'Exp') {
     devBanner.classList.remove('bg-red-600');
     devBanner.classList.add('bg-purple-600');
 }
}

const urlParams = new URLSearchParams(window.location.search);
const extToken = urlParams.get('ext');

if (extToken) {
window.isExternalMode = true;
window.externalToken = extToken;
showExternalApp();
} else {
if (user) {
if (!user.pass) {
 logout(); 
} else {
 showApp(); 
}
} else {
showLogin();
}
}

document.getElementById('login-pass').addEventListener('keypress', e => e.key === 'Enter' && handleLogin());

document.addEventListener('click', function(e) {
if(!e.target.closest('#form-event-attendee-search') && !e.target.closest('#event-attendees-results')) {
const resA = document.getElementById('event-attendees-results');
if(resA) resA.classList.add('hidden-view');
}
if(!e.target.closest('#form-combined-attendee-search') && !e.target.closest('#combined-attendees-results')) {
const resCA = document.getElementById('combined-attendees-results');
if(resCA) resCA.classList.add('hidden-view');
}
if(!e.target.closest('#form-leave-attendee-search') && !e.target.closest('#leave-attendees-results')) {
const resLA = document.getElementById('leave-attendees-results');
if(resLA) resLA.classList.add('hidden-view');
}
if(!e.target.closest('#form-leave-behalf-search') && !e.target.closest('#behalf-results-leave')) {
const resBHL = document.getElementById('behalf-results-leave');
if(resBHL) resBHL.classList.add('hidden-view');
}
if(!e.target.closest('#form-event-behalf-search') && !e.target.closest('#behalf-results-event')) {
const resBHE = document.getElementById('behalf-results-event');
if(resBHE) resBHE.classList.add('hidden-view');
}
if(!e.target.closest('#form-combined-behalf-search') && !e.target.closest('#behalf-results-combined')) {
const resBHC = document.getElementById('behalf-results-combined');
if(resBHC) resBHC.classList.add('hidden-view');
}
if(!e.target.closest('#admin-manage-search') && !e.target.closest('#admin-manage-results')) {
const resM = document.getElementById('admin-manage-results');
if(resM) resM.classList.add('hidden-view');
}
});

initDates();
});

async function showExternalApp() {
await updateProgress(15, 'Connecting...');
document.getElementById('login-view').classList.add('hidden-view');
document.getElementById('app-view').classList.remove('hidden-view');

// Hide standard nav & sidebars for external guests
const nav = document.querySelector('nav');
if(nav) nav.classList.add('hidden-view');
const slideMenu = document.getElementById('slide-menu');
if(slideMenu) slideMenu.classList.add('hidden-view', '!hidden', 'lg:!hidden');
const bottomBar = document.getElementById('bottom-bar');
if(bottomBar) bottomBar.classList.add('hidden-view');

try {
await updateProgress(40, 'Fetching portal data...');
const extData = await apiCall('getExternalData', { extToken: window.externalToken });

window.appTypicalEventTypes = extData.typicalEventTypes || [];
window.appAcronyms = extData.acronyms || {};
window.appContactNameFormat = extData.contactNameFormat || '{Name} (Cloud Group : {Unit})';
window.appCustomKahGroups = extData.customKahGroups || [];

companyContacts = extData.companyContacts || [];
window.formatContactName = function(name, dept) {
if (!name) return "";
if (!window.appContactNameFormat) return name;
let primaryDept = dept ? dept.split(',')[0].trim() : '';
if (!primaryDept || primaryDept === 'Unassigned' || primaryDept === 'UNASSIGNED') return name;
return window.appContactNameFormat.replace(/{Name}/g, name).replace(/{Unit}/g, primaryDept);
};

companyContacts.forEach(c => {
c.formattedName = window.formatContactName(c.name, c.dept);
});

let attendeeOptions = companyContacts.map(c => ({ id: c.phone, name: c.name, formattedName: c.formattedName, dept: c.dept, type: 'contact' }));
fuseAttendees = new Fuse(attendeeOptions, { keys: ['formattedName', 'name'], threshold: 0.3 });

// UI adjustments for external
const typeInput = document.getElementById('form-combined-type');
if (typeInput) {
typeInput.innerHTML = '<option value="Generic">Generic Booking</option>';
typeInput.value = 'Generic';
typeInput.disabled = true;
typeInput.parentElement.classList.add('hidden-view'); // Hide type selector completely
}

const guestFields = document.getElementById('external-guest-fields');
if (guestFields) guestFields.classList.remove('hidden-view');

const infoAllBtn = document.getElementById('form-combined-infoall-btn');
if (infoAllBtn) infoAllBtn.classList.add('hidden-view');

// Override external wrapper appearance
const formWrapper = document.getElementById('view-submit-combined');
if (formWrapper) {
formWrapper.classList.add('pt-4', 'md:pt-10');
const title = document.createElement('h2');
title.className = "text-3xl font-extrabold text-center mb-6 text-gray-900 dark:text-white tracking-tight";
title.innerText = "External Booking Portal";
formWrapper.prepend(title);
}

await updateProgress(100, 'Ready');
switchTab('submit-combined');
if (typeof toggleCombinedFields === 'function') toggleCombinedFields();

} catch (e) {
console.error("External init error:", e);
if (window.showToast) showToast("Error loading external booking form. The link may be invalid or revoked.", "error");
else alert("Error loading external booking form. The link may be invalid or revoked.");
}
showLoader(false);
}

async function showApp() {
await updateProgress(15, 'Connecting to server...');
document.getElementById('login-view').classList.add('hidden-view');
document.getElementById('app-view').classList.remove('hidden-view');
document.getElementById('logout-btn').classList.remove('hidden');
document.getElementById('theme-toggle').classList.remove('hidden');
document.getElementById('active-tab-title').classList.remove('hidden-view');

user.departments = user.departments ||[]; // Safety fallback for Admins

document.getElementById('nav-user-name').innerText = user.role === 'admin' ? "Administrator" : (user.departments.length ? `${user.name}` : user.name);

// Skeleton Setup
const dashAgenda = document.getElementById('dash-agenda');
const myAgenda = document.getElementById('my-agenda');
const paradeBody = document.getElementById('parade-state-body');

if (dashAgenda && C.skeletonCard) {
 dashAgenda.innerHTML = `
   <div class="${C.skeletonCard} mb-3"></div>
   <div class="${C.skeletonCard} mb-3"></div>
   <div class="${C.skeletonCard} mb-3"></div>
 `;
}
if (myAgenda && C.skeletonCard) {
 myAgenda.innerHTML = `
   <div class="${C.skeletonCard} mb-3"></div>
   <div class="${C.skeletonCard} mb-3"></div>
 `;
}
if (paradeBody && C.skeletonCard) {
 paradeBody.innerHTML = `
   <div class="${C.skeletonCard} h-32 mb-3"></div>
   <div class="${C.skeletonCard} h-20 mb-3"></div>
 `;
}

const cachedData = sessionStorage.getItem('initialData');
if (cachedData) {
 try {
   const parsed = JSON.parse(cachedData);
   applyInitialData(parsed.settings, parsed.leaves);
   await updateProgress(50, 'Updating from server...');
 } catch(e) {}
}

try {
 await updateProgress(25, 'Fetching your data...');
 const initialData = await apiCall('getInitialData', { adminPass: user.role === 'admin' ? user.pass : null }); 
 
 await updateProgress(65, 'Preparing dashboard...');
 applyInitialData(initialData.settings, initialData.leaves);
 sessionStorage.setItem('initialData', JSON.stringify(initialData));

 if (cachedData) {
   const warnEl = document.getElementById('cache-warning');
   if (warnEl) warnEl.classList.add('hidden-view');
 }

 await updateProgress(80, 'Almost ready...');
 
 const allUnitsForIndex = new Set(companyStructure);
 const uniqueDeptsForIndex = Array.from(allUnitsForIndex).sort((a, b) => {
   if (a.toUpperCase() === 'HQ') return -1;
   if (b.toUpperCase() === 'HQ') return 1;
   return a.localeCompare(b);
 });
 buildAttendeeSearchIndex(uniqueDeptsForIndex);
 
 renderTabIfActive('dashboard');
 renderTabIfActive('my-leaves');

 await updateProgress(100, 'Done!');
 await delay(400);
 showLoader(false);

} catch(e) {
 console.error("Error loading settings: ", e);
 if (!cachedData) {
   const barEl = document.getElementById('loader-bar');
   if (barEl) barEl.classList.add('error');
   showLoader(true, 100, 'Failed to load. Please try again.');
   setTimeout(() => showLoader(false), 3000);
   alertError('login-alert', 'Error initializing app.');
 } else {
   const warnEl = document.getElementById('cache-warning');
   if (warnEl) warnEl.classList.remove('hidden-view');
   showLoader(false);
 }
}
}

function applyInitialData(settings, leaves) {
allLeaves = leaves;

window.appTypicalEventTypes = settings.typicalEventTypes ||[]; 
window.appAcronyms = settings.acronyms || {};

window.appAgendaTemplate = settings.agendaTemplate !== undefined && settings.agendaTemplate !== null ? settings.agendaTemplate : '{EventType} - {Name} ({Department})';
window.appAgendaDetailsTemplate = settings.agendaDetailsTemplate !== undefined && settings.agendaDetailsTemplate !== null ? settings.agendaDetailsTemplate : 'Time: {Time}\nLocation: {Location}\nAttendees: {Attendees}\nEvent Description: {EventDescription}';
window.appInfoAllTemplate = settings.infoAllTemplate !== undefined && settings.infoAllTemplate !== null ? settings.infoAllTemplate : '{EventType} - {Name} ({Department})';
window.appInfoAllDetailsTemplate = settings.infoAllDetailsTemplate !== undefined && settings.infoAllDetailsTemplate !== null ? settings.infoAllDetailsTemplate : 'Time: {Time}\nLocation: {Location}\nEvent Description: {EventDescription}';
window.appContactNameFormat = settings.contactNameFormat || '{Name} (Cloud Group : {Unit})';
appMode = settings.appMode || 'combined';
window.appLandingPage = settings.landingPage || 'dashboard';
window.appDashboardDeptOrder = settings.dashboardDeptOrder || [];

window.formatContactName = function(name, dept) {
if (!name) return "";
if (!window.appContactNameFormat) return name;
let primaryDept = dept ? dept.split(',')[0].trim() : '';
if (!primaryDept || primaryDept === 'Unassigned' || primaryDept === 'UNASSIGNED') return name;
return window.appContactNameFormat.replace(/{Name}/g, name).replace(/{Unit}/g, primaryDept);
};

window.appCustomKahGroups = settings.customKahGroups ||[];

companyStructure = settings.companyStructure ? (Array.isArray(settings.companyStructure) ? settings.companyStructure : Object.keys(settings.companyStructure)) :[];
companyContacts = settings.allContacts ||[];

const typeOptionsHtml = window.appTypicalEventTypes.map(t => `<option value="${t.name}">${t.name}</option>`).join('');['form-leave-type', 'form-event-type', 'form-combined-type'].forEach(id => {
const el = document.getElementById(id);
if (el) el.innerHTML = typeOptionsHtml;
});

const mOrder = settings.menuOrder && settings.menuOrder.length ? settings.menuOrder : DEFAULT_MENU;
applyMenuOrder(mOrder);

if (user.role !== 'admin' && companyContacts.length > 0) {
const myContact = companyContacts.find(c => c.phone == user.phone);
if (myContact && myContact.dept) {
user.departments = myContact.dept.split(',').map(s=>s.trim());
localStorage.setItem('user', JSON.stringify(user));
}
}

let allUnits = new Set();
if(companyStructure) {
(Array.isArray(companyStructure) ? companyStructure : Object.keys(companyStructure)).forEach(d => allUnits.add(d));
}
if (companyContacts.length > 0) {
companyContacts.forEach(c => {
if (c.dept && c.dept !== 'Unassigned') {
c.dept.split(',').forEach(d => allUnits.add(d.trim().toUpperCase()));
}
});
}

companyStructure = Array.from(allUnits);

// Universal Meeting Room Injection
allUnits.add('Cloud Meeting Room');

// Dedicated Custom KAH Group Calendars Injection
if (window.appCustomKahGroups) {
window.appCustomKahGroups.forEach(g => {
if (g.hasCalendar && g.calendarName) allUnits.add(g.calendarName);
});
}

const uniqueDepts = Array.from(allUnits).sort((a, b) => {
const idxA = window.appDashboardDeptOrder.indexOf(a);
const idxB = window.appDashboardDeptOrder.indexOf(b);

if (idxA !== -1 && idxB !== -1) return idxA - idxB;
if (idxA !== -1) return -1;
if (idxB !== -1) return 1;

if (a.toUpperCase() === 'HQ') return -1;
if (b.toUpperCase() === 'HQ') return 1;
if (a === 'Cloud Meeting Room') return -1; 
return a.localeCompare(b);
});

const deptNav = document.getElementById('dash-dept-nav');
if (deptNav) {
let deptHtml = '<option value="">All Depts</option>';
deptHtml += '<option value="MY_CALENDAR">My Calendar</option>';
deptHtml += uniqueDepts.map(d => `<option value="${d}">${d}</option>`).join('');
deptNav.innerHTML = deptHtml;
}

const uniqueRegDepts = Array.from(allUnits).filter(u => u !== 'Cloud Meeting Room' && !window.appCustomKahGroups.some(g => g.calendarName === u)).sort((a, b) => {
if (a.toUpperCase() === 'HQ') return -1;
if (b.toUpperCase() === 'HQ') return 1;
return a.localeCompare(b);
});

const regOptions = '<option value="" disabled selected>Select...</option>' + uniqueRegDepts.map(d => `<option value="${d}">${d}</option>`).join('');
const regUnit = document.getElementById('reg-unit');
const adminRegUnit = document.getElementById('admin-reg-unit');
const editUserUnit = document.getElementById('edit-user-unit');

if (regUnit) regUnit.innerHTML = regOptions;
if (adminRegUnit) adminRegUnit.innerHTML = regOptions;
if (editUserUnit) editUserUnit.innerHTML = regOptions;
unitsLoaded = true;

if (user.role === 'admin') {
document.getElementById('admin-behalf-leave').classList.remove('hidden-view');
document.getElementById('admin-behalf-event').classList.remove('hidden-view');
document.getElementById('admin-behalf-combined').classList.remove('hidden-view');
if(typeof populateAdminSettingsForm === 'function') populateAdminSettingsForm(settings);
} else {
document.getElementById('admin-behalf-leave').classList.add('hidden-view');
document.getElementById('admin-behalf-event').classList.add('hidden-view');
document.getElementById('admin-behalf-combined').classList.add('hidden-view');
}

if (typeof toggleCombinedFields === 'function') toggleCombinedFields();

if (typeof applyWidgetsState === 'function') applyWidgetsState();

let targetTab = window.appLandingPage;
if (appMode === 'separated' && targetTab === 'submit-combined') targetTab = 'submit-leave';
if (appMode === 'combined' && (targetTab === 'submit-leave' || targetTab === 'submit-event')) targetTab = 'submit-combined';

switchTab(user.role === 'admin' ? 'admin' : targetTab); 

window._pendingTabRenders = new Set(['dashboard', 'my-leaves']);
}

if ('serviceWorker' in navigator) {
window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(err => {}));
}