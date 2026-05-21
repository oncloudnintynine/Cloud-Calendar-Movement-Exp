// ==========================================
// Form Handling & Fuzzy Search Dropdowns
// ==========================================

function toggleInfoAll(forceState) {
 isInfoAll = forceState !== undefined ? forceState : !isInfoAll;
 const btn = document.getElementById('form-combined-infoall-btn');
 if(!btn) return;
 if(isInfoAll) {
     btn.innerHTML = '<svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 4.741a1 1 0 01.332-.536l.042-.026a7 7 0 015.382-.652c.376.047.592.44.446.79l-.74 1.768a1 1 0 01-.832.608l-.456.056a5 5 0 00-3.858 2.382l-.18.318a1 1 0 01-.878.496H4.5a1 1 0 01-.894-1.448l1.83-3.158z"/></svg>Info All (ON)';
     btn.classList.add('bg-yellow-400', 'dark:bg-yellow-500', 'text-yellow-900', 'dark:text-yellow-900', 'border-yellow-500', 'dark:border-yellow-400', 'shadow-md');
     btn.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-gray-300', 'dark:border-gray-600', 'hover:bg-gray-100', 'dark:hover:bg-darkhover');
 } else {
     btn.innerHTML = 'Info All';
     btn.classList.remove('bg-yellow-400', 'dark:bg-yellow-500', 'text-yellow-900', 'dark:text-yellow-900', 'border-yellow-500', 'dark:border-yellow-400', 'shadow-md');
     btn.classList.add('text-gray-500', 'dark:text-gray-400', 'border-gray-300', 'dark:border-gray-600', 'hover:bg-gray-100', 'dark:hover:bg-darkhover');
 }
}

function validateForm(ctx) {
 let isValid = true;
 let errors = [];

 const clearFieldError = (el) => {
   if (!el) return;
   el.classList.remove('input-error');
   const errorId = el.id + '-error';
   const errorEl = document.getElementById(errorId);
   if (errorEl) errorEl.remove();
 };

 const showFieldError = (el, message) => {
   if (!el) return;
   el.classList.add('input-error');
   const errorId = el.id + '-error';
   let errorEl = document.getElementById(errorId);
   if (!errorEl) {
     errorEl = document.createElement('div');
     errorEl.id = errorId;
     errorEl.className = 'field-error-msg';
     errorEl.innerHTML = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span></span>`;
     errorEl.querySelector('span').textContent = message;
     el.parentElement.insertBefore(errorEl, el.nextSibling);
   }
 };

 const typeEl = document.getElementById(`form-${ctx}-type`);
 if (typeEl && !typeEl.value) {
   errors.push('Please select an event/leave type');
   showFieldError(typeEl, 'Required');
   isValid = false;
 } else if (typeEl) {
   clearFieldError(typeEl);
 }

 const startBtn = document.getElementById(`btn-${ctx}-start`) || document.getElementById(`btn-${ctx}-leave-start`);
 if (!appData[ctx].startD) {
   errors.push('Please select a start date');
   if (startBtn) showFieldError(startBtn, 'Required');
   isValid = false;
 } else if (startBtn) {
   clearFieldError(startBtn);
 }

 const remarksEl = document.getElementById(`form-${ctx}-remarks`);
 if (remarksEl && remarksEl.required && !remarksEl.value.trim()) {
   errors.push('Remarks are required');
   showFieldError(remarksEl, 'Required');
   isValid = false;
 } else if (remarksEl) {
   clearFieldError(remarksEl);
 }

 const countryEl = document.getElementById(`form-${ctx}-country`);
 if (countryEl && countryEl.required && !countryEl.value.trim()) {
   errors.push('Country is required');
   showFieldError(countryEl, 'Required');
   isValid = false;
 } else if (countryEl) {
   clearFieldError(countryEl);
 }

 if (!isValid && errors.length > 0) {
   showFormError(ctx, errors.join('<br>'));
 } else {
   hideFormError(ctx);
 }

 return isValid;
}

function showFormError(ctx, message) {
 let errorEl = document.getElementById(`form-${ctx}-error`);
 if (!errorEl) {
   errorEl = document.createElement('div');
   errorEl.id = `form-${ctx}-error`;
   errorEl.className = 'bg-red-50 dark:bg-red-900/20 border border-red-200/80 dark:border-red-800 text-red-700 dark:text-red-400 text-sm p-4 rounded-lg mb-3 flex items-start gap-3 shadow-md';
   errorEl.style.animation = 'fadeIn 0.2s ease-out, pulse-red 1s ease-in-out 2';
   const formDiv = document.getElementById(`view-submit-${ctx}`) || document.getElementById(`view-submit-combined`);
   if (formDiv) {
     const form = formDiv.querySelector('form');
     if (form) form.insertBefore(errorEl, form.firstChild);
   }
 }
 errorEl.innerHTML = `<svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg><span class="flex-1 font-medium">${message}</span>`;
 errorEl.classList.remove('hidden');

 // Scroll to error for mobile visibility
 setTimeout(() => {
   errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
 }, 100);
}

function hideFormError(ctx) {
const errorEl = document.getElementById(`form-${ctx}-error`);
if (errorEl) errorEl.classList.add('hidden');
}

function toggleRepeatUntil(ctx = 'combined') {
const val = document.getElementById(`form-${ctx}-repeat`).value;
const container = document.getElementById(`${ctx}-until-container`);
if(val === 'NONE') container.classList.add('hidden');
else container.classList.remove('hidden');
}

function toggleCombinedRepeatUntil() {
toggleRepeatUntil('combined');
}

function toggleCombinedFields() {
 const typeInput = document.getElementById('form-combined-type');
 if(!typeInput) return;
 const val = typeInput.value;
 const typeObj = window.appTypicalEventTypes ? window.appTypicalEventTypes.find(t => t.name === val) : null;
 const isEvent = typeObj ? typeObj.isEvent : true;

 const eventFields = document.getElementById('combined-event-fields');
 const leaveFields = document.getElementById('combined-leave-fields');
 const locationInput = document.getElementById('form-combined-location');
 const btnInfoAll = document.getElementById('form-combined-infoall-btn');
 const remarksInput = document.getElementById('form-combined-remarks');
 const remarksLabel = document.getElementById('label-combined-remarks');
 const attWrap = document.getElementById('combined-attendees-wrapper');

 if (isEvent || val === 'Official Trip') {
  attWrap.classList.remove('hidden');
 } else {
 attWrap.classList.add('hidden');
 }

 if (isEvent) {
 eventFields.classList.remove('hidden');
 leaveFields.classList.add('hidden');
btnInfoAll.classList.remove('hidden');

if (!locationInput.value || locationInput.value.trim() === '') {
 locationInput.value = typeObj && typeObj.defaultLoc ? typeObj.defaultLoc : 'Office';
}

if (val === 'Meeting') {
   remarksInput.required = true;
   remarksInput.placeholder = "Enter meeting agenda/description (Required)";
   remarksLabel.innerHTML = 'Meeting Description <span class="text-red-500">*</span>';
} else {
   remarksInput.required = false;
   remarksInput.placeholder = "";
   remarksLabel.innerHTML = 'Remarks <span class="text-[10px] font-normal text-gray-500">(Optional)</span>';
}
} else {
 eventFields.classList.add('hidden');
leaveFields.classList.remove('hidden');
  btnInfoAll.classList.add('hidden');
 remarksInput.required = false;
 remarksInput.placeholder = "";
 remarksLabel.innerHTML = 'Remarks <span class="text-[10px] font-normal text-gray-500">(Optional)</span>';

 const overseas = document.getElementById('combined-overseas-fields');
 const cInput = document.getElementById('form-combined-country');
if (val === 'Overseas Leave' || val === 'Official Trip') { 
   overseas.classList.remove('hidden'); cInput.required = true; 
  } else { 
  overseas.classList.add('hidden'); cInput.required = false; 
 }

 const leaveTimeStart = document.getElementById('combined-leave-time-start');
 const leaveTimeEnd = document.getElementById('combined-leave-time-end');
 if (val === 'Official Trip') {
    if(leaveTimeStart) leaveTimeStart.classList.add('hidden');
    if(leaveTimeEnd) leaveTimeEnd.classList.add('hidden');
} else {
     if(leaveTimeStart) leaveTimeStart.classList.remove('hidden');
     if(leaveTimeEnd) leaveTimeEnd.classList.remove('hidden');
  }
}
}

// --- Admin Submit on Behalf Logic ---
function searchBehalf(ctx) {
const inputEl = document.getElementById(`form-${ctx}-behalf-search`);
const q = inputEl.value;
const resC = document.getElementById(`behalf-results-${ctx}`);

if(!q || !fuseAllContacts) { 
 resC.classList.add('hidden'); 
 inputEl.classList.remove('ring-2', 'ring-emerald-500');
 return; 
}

inputEl.classList.add('ring-2', 'ring-emerald-500');
const results = fuseAllContacts.search(q).slice(0, 5).map(r => r.item);
if (results.length > 0) {
resC.innerHTML = results.map(c => `
 <div class="p-3 border-b dark:border-darkborder cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/30" onclick="selectBehalf('${ctx}', '${c.name.replace(/'/g, "\\'")}', '${c.phone}', '${c.dept}')">
   <span class="font-semibold text-emerald-800 dark:text-emerald-300">${c.name}</span> <span class="text-xs text-gray-500 dark:text-darkmuted ml-1">(${c.dept})</span>
 </div>
`).join('');
resC.classList.remove('hidden');
} else {
resC.innerHTML = `<div class="p-3 text-gray-500">No match found</div>`; resC.classList.remove('hidden');
}
}

function selectBehalf(ctx, name, phone, dept) {
adminBehalfUser = { name, phone, dept };
document.getElementById(`selected-behalf-${ctx}`).innerHTML = `
<span>Submitting for: ${name} <span class="text-sm font-normal text-emerald-600">(${dept})</span></span>
<button type="button" onclick="clearBehalf('${ctx}')" class="text-red-500 hover:bg-red-50 p-1 rounded transition">&times; clear</button>
`;
const inputEl = document.getElementById(`form-${ctx}-behalf-search`);
inputEl.value = '';
inputEl.classList.add('hidden');
inputEl.classList.remove('ring-2', 'ring-emerald-500');
document.getElementById(`behalf-results-${ctx}`).classList.add('hidden');
}

function clearBehalf(ctx) {
adminBehalfUser = null;
document.getElementById(`selected-behalf-${ctx}`).innerHTML = '';
document.getElementById(`form-${ctx}-behalf-search`).classList.remove('hidden');
}

// --- Attendees Form Logic ---
 let _attendeeHighlightIdx = -1;

 function searchAttendees(ctx) {
 const inputEl = document.getElementById(`form-${ctx}-attendee-search`);
 const q = inputEl.value;
 const resC = document.getElementById(`${ctx}-attendees-results`);

 if(!q || !fuseAttendees) { 
  resC.classList.add('hidden'); 
  inputEl.classList.remove('ring-2', 'ring-blue-500');
  _attendeeHighlightIdx = -1;
  return; 
 }

 inputEl.classList.add('ring-2', 'ring-blue-500');
 const results = fuseAttendees.search(q).slice(0, 6).map(r => r.item);
 if (results.length > 0) {
 resC.innerHTML = results.map((item, idx) => `
  <div class="p-3 border-b border-gray-200 dark:border-darkborder cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 ${idx === _attendeeHighlightIdx ? 'bg-blue-100 dark:bg-blue-800/40' : ''}" onclick="selectAttendee('${ctx}', '${item.id}', '${item.name.replace(/'/g, "\\'")}', '${item.dept}', '${item.type}', '${(item.expandedNames || '').replace(/'/g, "\\'")}')">
    <span class="font-semibold text-blue-800 dark:text-blue-300">${item.name}</span> <span class="text-xs text-gray-500 dark:text-darkmuted ml-1">(${item.dept})</span>
  </div>
 `).join('');

 // Add keyboard navigation
 resC.setAttribute('role', 'listbox');
 const items = resC.querySelectorAll('[onclick^="selectAttendee"]');
 items.forEach((el, i) => {
   el.setAttribute('role', 'option');
   if (i === _attendeeHighlightIdx) el.classList.add('bg-blue-100', 'dark:bg-blue-800/40');
 });

 resC.classList.remove('hidden');
} else {
 resC.innerHTML = `<div class="p-3 text-gray-500">No match found</div>`; resC.classList.remove('hidden');
 _attendeeHighlightIdx = -1;
 }

 // Keyboard navigation for dropdown
 inputEl.onkeydown = function(e) {
   const items = resC.querySelectorAll('[onclick^="selectAttendee"]');
   if (e.key === 'ArrowDown') {
     e.preventDefault();
     _attendeeHighlightIdx = (_attendeeHighlightIdx + 1) % items.length;
     updateDropdownHighlight(resC, items);
   } else if (e.key === 'ArrowUp') {
     e.preventDefault();
     _attendeeHighlightIdx = (_attendeeHighlightIdx - 1 + items.length) % items.length;
     updateDropdownHighlight(resC, items);
   } else if (e.key === 'Enter' && _attendeeHighlightIdx >= 0) {
     e.preventDefault();
     items[_attendeeHighlightIdx].click();
   } else if (e.key === 'Escape') {
     resC.classList.add('hidden');
     _attendeeHighlightIdx = -1;
   }
 };
 }

 function updateDropdownHighlight(resC, items) {
  items.forEach((el, i) => {
    if (i === _attendeeHighlightIdx) {
      el.classList.add('bg-blue-100', 'dark:bg-blue-800/40');
      el.scrollIntoView({ block: 'nearest' });
    } else {
      el.classList.remove('bg-blue-100', 'dark:bg-blue-800/40');
    }
  });
 }

function selectAttendee(ctx, id, name, dept, type, expandedNames) {
 if (!eventAttendees.some(a => a.id === id)) { 
 eventAttendees.push({ id, name, dept, type, expandedNames }); 
 renderAttendees(ctx); 
 }
 _attendeeHighlightIdx = -1;
 const inputEl = document.getElementById(`form-${ctx}-attendee-search`);
 inputEl.value = '';
 inputEl.classList.remove('ring-2', 'ring-blue-500');
 document.getElementById(`${ctx}-attendees-results`).classList.add('hidden');
 }

function removeAttendee(ctx, id) { 
eventAttendees = eventAttendees.filter(a => a.id !== id); 
renderAttendees(ctx); 
}

function renderAttendees(ctx) {
const c = document.getElementById(`${ctx}-attendees-chip-container`);
if(c) {
 c.innerHTML = eventAttendees.map(a => `
 <div class="${C.chip}">
   ${a.name}
   <button type="button" onclick="removeAttendee('${ctx}', '${a.id}')" class="ml-2 text-blue-600 dark:text-blue-400 hover:text-red-500 focus:outline-none">&times;</button>
 </div>
`).join('');
}
}

// --- Form Submission & Edits ---
function triggerEdit(id) {
const l = allLeaves.find(x => x.ID === id);
if(!l) return;
currentEditId = id;

appData.combined.startD = new Date(l.StartDate);
appData.combined.endD = new Date(l.EndDate);

if (user.role === 'admin') {
 selectBehalf('combined', l.Name, l.Phone, l.Department);
}

const typeEl = document.getElementById('form-combined-type');
if (typeEl) typeEl.value = l.LeaveType;

toggleCombinedFields();

const typeObj = window.appTypicalEventTypes ? window.appTypicalEventTypes.find(t => t.name === l.LeaveType) : null;
const isEvent = typeObj ? typeObj.isEvent : false;

if (isEvent || l.LeaveType === 'Official Trip') {
 eventAttendees =[];
 if(l.Attendees) {
  try {
    eventAttendees = JSON.parse(l.Attendees);
  } catch(e) {
    const savedPhones = String(l.Attendees).split(',');
    savedPhones.forEach(ph => {
      const contact = companyContacts.find(c => String(c.phone) === String(ph));
      if(contact) eventAttendees.push({ id: contact.phone, name: contact.name, dept: contact.dept, type: 'contact' });
    });
  }
 }
 renderAttendees('combined');
}

if (isEvent) {
 appData.combined.isAllDay = String(l.IsAllDay).toUpperCase() === 'TRUE';
 appData.combined.untilD = l.UntilDate ? new Date(l.UntilDate) : new Date(l.EndDate);
 document.getElementById('form-combined-allday').checked = appData.combined.isAllDay;
 document.getElementById('form-combined-location').value = l.Location || 'Office';

 const locDetEl = document.getElementById('form-combined-location-details');
 if (locDetEl) locDetEl.value = l.LocationDetails || '';

 document.getElementById('form-combined-repeat').value = l.HalfDay || 'NONE';
 toggleInfoAll(String(l.InfoAll).toUpperCase() === 'TRUE');
 toggleRepeatUntil('combined');
} else {
 document.getElementById('form-combined-country').value = l.Country || '';
 document.getElementById('form-combined-state').value = l.State || '';

 let start = 'AM', end = 'PM';
 if (l.HalfDay === 'AM') end = 'AM';
 else if (l.HalfDay === 'PM') start = 'PM';
 else if (l.HalfDay === 'Start PM, End AM') { start = 'PM'; end = 'AM'; }
 else if (l.HalfDay === 'Start PM') start = 'PM';
 else if (l.HalfDay === 'End AM') end = 'AM';
 appData.combined.startAMPM = start; appData.combined.endAMPM = end;
 updateTimeSliderVisual('start', start, 'combined'); updateTimeSliderVisual('end', end, 'combined');
}

document.getElementById('form-combined-remarks').value = l.Remarks || '';
document.getElementById('submit-combined-btn').innerText = "Update Record";
document.getElementById('cancel-edit-combined-btn').classList.remove('hidden');

updateButtonLabels();
switchTab('submit-combined');

setTimeout(() => {
 const el = document.getElementById('form-combined-remarks');
 if(el) { el.style.height='auto'; el.style.height=el.scrollHeight+'px'; }
}, 50);
}

function cancelEditMode() {
currentEditId = null;
initDates();
const combinedForm = document.getElementById('combined-form');
if(combinedForm) combinedForm.reset();
const remarksEl = document.getElementById('form-combined-remarks');
if(remarksEl) remarksEl.style.height='auto';

appData.combined.startAMPM = 'AM'; appData.combined.endAMPM = 'PM';
appData.combined.isAllDay = false;
const alldayEl = document.getElementById('form-combined-allday');
if (alldayEl) alldayEl.checked = false;

updateTimeSliderVisual('start', 'AM', 'combined'); updateTimeSliderVisual('end', 'PM', 'combined');

toggleCombinedFields();

toggleInfoAll(false);
toggleRepeatUntil('combined');

clearBehalf('combined');

eventAttendees =[];
renderAttendees('combined');

const btn = document.getElementById('submit-combined-btn');
const cancelBtn = document.getElementById('cancel-edit-combined-btn');
if (btn) btn.innerText = "Save Record";
if (cancelBtn) cancelBtn.classList.add('hidden');

switchTab('dashboard');
}

function toggleAMPM(type, ctx) {
appData[ctx][`${type}AMPM`] = appData[ctx][`${type}AMPM`] === 'AM' ? 'PM' : 'AM'; 
updateTimeSliderVisual(type, appData[ctx][`${type}AMPM`], ctx);
}

function updateTimeSliderVisual(type, val, ctx) {
const slider = document.getElementById(`${type}-${ctx}-slider`);
const tAM = document.getElementById(`${type}-${ctx}-am`);
const tPM = document.getElementById(`${type}-${ctx}-pm`);
if (!slider || !tAM || !tPM) return;
const act = 'text-white', inact =['text-gray-500', 'dark:text-darkmuted'];
if (val === 'PM') {
slider.classList.add('translate-x-full');
tAM.classList.remove(act); tAM.classList.add(...inact);
tPM.classList.remove(...inact); tPM.classList.add(act);
} else {
slider.classList.remove('translate-x-full');
tAM.classList.remove(...inact); tAM.classList.add(act);
tPM.classList.remove(act); tPM.classList.add(...inact);
}
}

function toggleOverseasFields(ctx) {
const type = document.getElementById(`form-${ctx}-type`).value;
const el = document.getElementById(`${ctx}-overseas-fields`);
const cInput = document.getElementById(`form-${ctx}-country`);

if (type === 'Overseas Leave' || type === 'Official Trip') { 
el.classList.remove('hidden'); cInput.required = true; 
} else { 
el.classList.add('hidden'); cInput.required = false; cInput.value = ''; document.getElementById(`form-${ctx}-state`).value = ''; 
}
}

async function submitForm(ctx) {
if (!validateForm('combined')) {
  return;
}

showLoader(true);

let targetName = user.name;
let targetPhone = user.phone;
let targetDepts = new Set(user.departments ||[]);

if (user.role === 'admin' && adminBehalfUser) {
targetName = adminBehalfUser.name;
targetPhone = adminBehalfUser.phone;
targetDepts = new Set([adminBehalfUser.dept]);
} else if (user.role === 'admin' && !adminBehalfUser) {
 showToast("Please select a user to submit on behalf of.", "warning");
 showLoader(false); return;
 }

const typeValue = document.getElementById('form-combined-type').value;
const typeObj = window.appTypicalEventTypes ? window.appTypicalEventTypes.find(t => t.name === typeValue) : null;
const isEvent = typeObj && typeObj.isEvent;

const toLocalISO = (d) => new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 19);
const sDate = toLocalISO(appData.combined.startD);
const eDate = toLocalISO(appData.combined.endD);

let calculatedHalfDay = 'None';
let loc = '';
let locDetails = '';
let finalAttendeesStr = '';
let finalInfoAll = false;
let eventIsAllDay = false;
let eventUntilDate = '';
let country = '';
let state = '';

if (!isEvent) {
 if (typeValue === 'Official Trip') {
  calculatedHalfDay = 'None';
 } else {
  const isSameDay = appData.combined.startD.toDateString() === appData.combined.endD.toDateString();
  if (isSameDay) {
    if (appData.combined.startAMPM === 'AM' && appData.combined.endAMPM === 'AM') calculatedHalfDay = 'AM';
    else if (appData.combined.startAMPM === 'PM' && appData.combined.endAMPM === 'PM') calculatedHalfDay = 'PM';
  } else {
    if (appData.combined.startAMPM === 'PM' && appData.combined.endAMPM === 'AM') calculatedHalfDay = 'Start PM, End AM';
    else if (appData.combined.startAMPM === 'PM') calculatedHalfDay = 'Start PM';
    else if (appData.combined.endAMPM === 'AM') calculatedHalfDay = 'End AM';
  }
 }
 country = document.getElementById('form-combined-country').value || '';
 state = document.getElementById('form-combined-state').value || '';

 if (typeValue === 'Official Trip') {
   eventAttendees.forEach(a => { 
       if (a.dept !== 'Custom') targetDepts.add(a.dept); 
   });
   finalAttendeesStr = JSON.stringify(eventAttendees);
 }
 } else {
 calculatedHalfDay = document.getElementById('form-combined-repeat').value; 
 loc = document.getElementById('form-combined-location').value;

 const locDetEl = document.getElementById('form-combined-location-details');
 if (locDetEl) locDetails = locDetEl.value.trim();

 finalInfoAll = isInfoAll;
 eventIsAllDay = appData.combined.isAllDay;

 if (calculatedHalfDay !== 'NONE') {
  eventUntilDate = toLocalISO(appData.combined.untilD);
 }

 eventAttendees.forEach(a => { 
    if (a.dept !== 'Custom') targetDepts.add(a.dept); 
 });
 finalAttendeesStr = JSON.stringify(eventAttendees);
 }

const payload = {
 id: currentEditId, name: targetName, phone: targetPhone, departments: Array.from(targetDepts),
 leaveType: typeValue,
 startDate: sDate, endDate: eDate, halfDay: calculatedHalfDay, 
 coveringPerson: '',
 country: country,
 state: state,
 remarks: document.getElementById('form-combined-remarks').value,
 location: loc,
 locationDetails: locDetails,
 attendees: finalAttendeesStr,
 infoAll: finalInfoAll,
 isAllDay: eventIsAllDay,
 untilDate: eventUntilDate
};

try {
const action = currentEditId ? 'editLeave' : 'submitLeave';
const res = await apiCall(action, payload);

await loadLeavesData(); 
 const wasEdit = currentEditId;
 cancelEditMode(); 

 const successMsg = res.status.includes('Cal Updated') || res.status.includes('Approved') ? `Record successfully ${wasEdit ? 'updated' : 'submitted'}!` : "Record marked as Pending due to constraints. Admin notified.";
 showToast(successMsg, res.status.includes('Cal Updated') || res.status.includes('Approved') ? 'success' : 'info');
 } catch (err) { 
 showToast("Error: " + err.message, "error"); 
 } finally { 
 showLoader(false); 
 }
 }

async function cancelLeave(id, targetPhone) {
 const confirmed = await showConfirm("Are you sure you want to cancel this record?");
 if(!confirmed) return;
 showLoader(true);
 try { 
 await apiCall('cancelLeave', { id: id, phone: targetPhone || user.phone }); 
 await loadLeavesData(); 
 showToast("Record cancelled successfully.", "success");
 } catch (err) {
 console.error(err);
 showToast("Error cancelling record: " + err.message, "error");
 } finally { 
 showLoader(false); 
 }
 }