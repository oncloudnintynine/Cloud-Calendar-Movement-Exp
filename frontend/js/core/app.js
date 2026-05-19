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
  devBanner.classList.remove('hidden');
  devBanner.innerText = `${ENV.toUpperCase()} MODE`;
  if (ENV === 'Exp') {
      devBanner.classList.remove('bg-red-600');
      devBanner.classList.add('bg-purple-600');
  }
}

if (user) {
if (!user.pass) {
  logout(); 
} else {
  showApp(); 
}
} else {
showLogin();
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
if(!e.target.closest('#kah-search') && !e.target.closest('#kah-results')) {
const resK = document.getElementById('kah-results');
if(resK) resK.classList.add('hidden-view');
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

async function showApp() {
await updateProgress(15, 'Connecting to server...');
document.getElementById('login-view').classList.add('hidden-view');
document.getElementById('app-view').classList.remove('hidden-view');
document.getElementById('logout-btn').classList.remove('hidden');
document.getElementById('menu-btn').classList.remove('hidden');
document.getElementById('active-tab-title').classList.remove('hidden');

user.departments = user.departments ||[];

document.getElementById('nav-user-name').innerText = user.role === 'admin' ? "Administrator" : (user.departments.length ? `${user.name}` : user.name);

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
    if (warnEl) warnEl.classList.add('hidden');
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
    if (warnEl) warnEl.classList.remove('hidden');
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
appMode = settings.appMode || 'combined';

window.kahPhones = (settings.kahList ||[]).map(k => String(k.phone));
window.appKahList = settings.kahList ||[];
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

let allUnits = new Set(companyStructure);
if (allUnits.size === 0 && companyContacts.length > 0) {
companyContacts.forEach(c => {
  if (c.dept && c.dept !== 'Unassigned') {
    allUnits.add(c.dept.toUpperCase());
  }
});
companyStructure = Array.from(allUnits);
}

const uniqueDepts = Array.from(allUnits).sort((a, b) => {
  if (a.toUpperCase() === 'HQ') return -1;
  if (b.toUpperCase() === 'HQ') return 1;
  return a.localeCompare(b);
});

const deptNav = document.getElementById('dash-dept-nav');
if (deptNav) {
let deptHtml = '<option value="">All Depts</option>';
deptHtml += '<option value="MY_CALENDAR">My Calendar</option>';
deptHtml += uniqueDepts.map(d => `<option value="${d}">${d}</option>`).join('');
deptNav.innerHTML = deptHtml;
}

const regOptions = '<option value="" disabled selected>Select...</option>' + uniqueDepts.map(d => `<option value="${d}">${d}</option>`).join('');
const regUnit = document.getElementById('reg-unit');
const adminRegUnit = document.getElementById('admin-reg-unit');
const editUserUnit = document.getElementById('edit-user-unit');

if (regUnit) regUnit.innerHTML = regOptions;
if (adminRegUnit) adminRegUnit.innerHTML = regOptions;
if (editUserUnit) editUserUnit.innerHTML = regOptions;
unitsLoaded = true;

if (user.role === 'admin') {
document.getElementById('menu-admin-group').classList.remove('hidden');
document.getElementById('admin-behalf-leave').classList.remove('hidden-view');
document.getElementById('admin-behalf-event').classList.remove('hidden-view');
document.getElementById('admin-behalf-combined').classList.remove('hidden-view');
if(typeof populateAdminSettingsForm === 'function') populateAdminSettingsForm(settings);
} else {
document.getElementById('menu-admin-group').classList.add('hidden');
document.getElementById('admin-behalf-leave').classList.add('hidden-view');
document.getElementById('admin-behalf-event').classList.add('hidden-view');
document.getElementById('admin-behalf-combined').classList.add('hidden-view');
}

if (typeof toggleCombinedFields === 'function') toggleCombinedFields();

const activeTab = user.role === 'admin' ? 'admin' : mOrder[0];
switchTab(activeTab);

window._pendingTabRenders = new Set(['dashboard', 'my-leaves']);
}

if ('serviceWorker' in navigator) {
window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(err => {}));
}