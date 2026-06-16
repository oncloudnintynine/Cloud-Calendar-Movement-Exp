// ==========================================
// Parade State Logic
// ==========================================

function renderParadeState() {
const paradeHeader = document.getElementById('parade-state-header');
const paradeBody = document.getElementById('parade-state-body');

if (!companyContacts || companyContacts.length === 0) {
if(paradeHeader) paradeHeader.innerText = `Overall Parade State`;
if(paradeBody) paradeBody.innerHTML = `<div class="${C.emptyState}">${ICONS.loading}<p class="${C.emptyStateText} mt-2">Loading personnel data or no contacts found...</p></div>`;
return;
}

const now = appData.parade.targetD || new Date();
let inOfficeGlobal = 0;
let totalGlobal = companyContacts.length;

// Build dynamic N-Tier Tree Map
let tree = {};

try {
companyContacts.forEach(contact => {
const fullPath = String(contact.dept || 'Unassigned').toUpperCase();
const parts = fullPath.split('-');

let currentLevel = tree;
parts.forEach((part, index) => {
if (!currentLevel[part]) {
    currentLevel[part] = { _meta: { members:[], total: 0, inOffice: 0, isTerminal: false } };
}
currentLevel[part]._meta.total++;
if (index === parts.length - 1) currentLevel[part]._meta.isTerminal = true;
currentLevel = currentLevel[part];
});

const activeRecords = allLeaves.filter(l => {
if (l.Status === 'Cancelled') return false;

let isTarget = false;
if (String(l.Phone).trim() === String(contact.phone).trim() || String(l.Name).trim() === String(contact.name).trim()) {
  isTarget = true;
} else if (l.Attendees) {
try {
  const att = JSON.parse(l.Attendees);
  isTarget = att.some(a => {
      if (a.type === 'contact' && (String(a.id).trim() === String(contact.phone).trim() || String(a.name).trim() === String(contact.name).trim())) return true;
      if (a.type === 'group') {
          if (a.name.startsWith('zz KAH:')) {
              const gName = a.name.replace('zz KAH: ', '').trim();
              const customG = window.appCustomKahGroups && window.appCustomKahGroups.find(cg => cg.name === gName);
              return customG && customG.members.some(m => String(m).trim() === String(contact.phone).trim());
          } else {
              const contactDepts = (contact.dept || '').split(',').map(d => d.trim());
              return contactDepts.includes(a.dept);
          }
      }
      return false;
  });
} catch(e) { isTarget = String(l.Attendees).includes(String(contact.phone).trim()); }
}

if (!isTarget) return false;

let sDate = new Date(l.StartDate);
let eDate = new Date(l.EndDate);
const typeObj = window.appTypicalEventTypes ? window.appTypicalEventTypes.find(t => t.name === l.LeaveType) : null;
const isEvent = typeObj ? typeObj.isEvent : false;

let isRepeating = false;
if (isEvent && l.HalfDay && ['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY', 'WEEKDAY'].includes(String(l.HalfDay).toUpperCase())) {
  isRepeating = true;
}

if (!isEvent || (isEvent && !isRepeating)) {
  if (!isEvent || String(l.IsAllDay).toUpperCase() === 'TRUE') {
      sDate.setHours(0, 0, 0, 0);
      eDate.setHours(23, 59, 59, 999);
  }
  
  if (l.HalfDay === 'AM') {
      eDate.setHours(12, 30, 0, 0); 
  } else if (l.HalfDay === 'PM') {
      sDate.setHours(12, 30, 0, 0);
  } else if (l.HalfDay === 'Start PM') {
      if (now.toDateString() === sDate.toDateString()) sDate.setHours(12, 30, 0, 0);
  } else if (l.HalfDay === 'End AM') {
      if (now.toDateString() === eDate.toDateString()) eDate.setHours(12, 30, 0, 0);
  } else if (l.HalfDay === 'Start PM, End AM') {
      if (now.toDateString() === sDate.toDateString()) sDate.setHours(12, 30, 0, 0);
      if (now.toDateString() === eDate.toDateString()) eDate.setHours(12, 30, 0, 0);
  }
  
  return now >= sDate && now <= eDate;
} else {
  const untilD = l.UntilDate ? new Date(l.UntilDate) : new Date(sDate.getTime() + 31536000000);
  untilD.setHours(23, 59, 59, 999);
  
  if (now < sDate || now > untilD) return false;
  
  const targetDate = new Date(now);
  targetDate.setHours(0,0,0,0);
  const startDay = new Date(sDate);
  startDay.setHours(0,0,0,0);
  
  let isDayMatch = false;
  const hd = String(l.HalfDay).toUpperCase();
  
  if (hd === 'DAILY') isDayMatch = true;
  else if (hd === 'WEEKDAY') isDayMatch = (targetDate.getDay() !== 0 && targetDate.getDay() !== 6);
  else if (hd === 'WEEKLY') {
      const diffDays = Math.round((targetDate.getTime() - startDay.getTime()) / 86400000);
      isDayMatch = (diffDays % 7 === 0);
  } else if (hd === 'MONTHLY') isDayMatch = (targetDate.getDate() === startDay.getDate());
  else if (hd === 'ANNUALLY') isDayMatch = (targetDate.getMonth() === startDay.getMonth() && targetDate.getDate() === startDay.getDate());
  
  if (!isDayMatch) return false;
  if (String(l.IsAllDay).toUpperCase() === 'TRUE') return true;
  
  const nowTime = now.getHours() * 60 + now.getMinutes();
  const sTime = sDate.getHours() * 60 + sDate.getMinutes();
  const eTime = eDate.getHours() * 60 + eDate.getMinutes();
  return nowTime >= sTime && nowTime <= eTime;
}
});

let isOffice = true;
let locationStr = 'In Camp';
let halfDayIndicator = '';
let statusType = 'office';

if (activeRecords.length > 0) {
let activeRecord = activeRecords[0]; 

for (const rec of activeRecords) {
 const tObj = window.appTypicalEventTypes ? window.appTypicalEventTypes.find(t => t.name === rec.LeaveType) : null;
 const isEvt = tObj ? tObj.isEvent : false;
 let checkLoc = isEvt ? (rec.Location || 'Event') : (rec.LeaveType || 'Leave');
 
 if (String(checkLoc).toLowerCase() !== 'in camp') {
     activeRecord = rec; 
     break;
 }
}

const hd = activeRecord.HalfDay;
if (hd && !['NONE', 'None', 'DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY', 'WEEKDAY'].includes(hd)) {
  halfDayIndicator = ` (${hd})`;
}

const typeObj = window.appTypicalEventTypes ? window.appTypicalEventTypes.find(t => t.name === activeRecord.LeaveType) : null;
const isEvent = typeObj ? typeObj.isEvent : false;

if (isEvent) {
locationStr = activeRecord.Location || 'Event';
if (activeRecord.LocationDetails) {
    locationStr += ` - ${activeRecord.LocationDetails}`;
}
locationStr += halfDayIndicator;
isOffice = String(activeRecord.Location || '').toLowerCase() === 'in camp';
statusType = isOffice ? 'office' : 'event';
} else {
locationStr = activeRecord.LeaveType || 'Leave';
if (activeRecord.Country) locationStr += ` (${activeRecord.Country})`;
locationStr += halfDayIndicator;
isOffice = false;
statusType = 'leave';
}
}

if (isOffice) inOfficeGlobal++;

const isKAH = window.appCustomKahGroups && window.appCustomKahGroups.some(g => g.members.includes(String(contact.phone)));

const finalLocationStr = applyAcronymsFront(locationStr);
const memberObj = { name: applyAcronymsFront(contact.name || 'Unknown'), isOffice: isOffice, location: finalLocationStr, isKAH: isKAH, statusType: statusType };

let updateLevel = tree;
parts.forEach(part => {
if (isOffice) updateLevel[part]._meta.inOffice++;
if (updateLevel[part]._meta.isTerminal && part === parts[parts.length - 1]) {
    updateLevel[part]._meta.members.push(memberObj);
}
updateLevel = updateLevel[part];
});
});

const attendancePct = totalGlobal > 0 ? Math.round((inOfficeGlobal / totalGlobal) * 100) : 0;
const pctColor = attendancePct >= 75 ? 'text-green-600 dark:text-green-400' : (attendancePct >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400');
const pctBg = attendancePct >= 75 ? 'bg-green-100 dark:bg-green-900/30' : (attendancePct >= 50 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30');

if (paradeHeader) paradeHeader.innerHTML = `
<div class="flex items-center justify-between w-full">
  <span>Overall Parade State</span>
  <span class="${pctBg} ${pctColor} px-2 py-0.5 rounded-full text-sm font-bold">${attendancePct}%</span>
</div>
<div class="flex items-center gap-3 mt-1 text-xs font-medium text-gray-500 dark:text-darkmuted">
  <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span>${inOfficeGlobal} In Camp</span>
  <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-500"></span>${totalGlobal - inOfficeGlobal} Away</span>
</div>`;

const sortMembers = (mems) => {
mems.sort((a, b) => {
  if (a.isOffice && !b.isOffice) return -1;
  if (!a.isOffice && b.isOffice) return 1;
  if (a.isKAH && !b.isKAH) return -1;
  if (!a.isKAH && b.isKAH) return 1;
  return String(a.name).localeCompare(String(b.name));
});
};

const isHQ = (str) => str && String(str).toLowerCase() === 'hq';

function renderNode(node, nodeName, depth) {
const meta = node._meta;
sortMembers(meta.members);

let html = '';

const deptPct = meta.total > 0 ? Math.round((meta.inOffice / meta.total) * 100) : 0;

if (depth === 0) {
   html += `<div class="mb-4 rounded-xl overflow-hidden border border-gray-200 dark:border-darkborder bg-white dark:bg-darksurface shadow-sm">`;
   html += `<div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent border-b border-gray-200 dark:border-darkborder">`;
   html += `<h3 class="font-bold text-base md:text-lg text-blue-700 dark:text-blue-400">${applyAcronymsFront(nodeName)}</h3>`;
   html += `<div class="flex items-center gap-2">`;
   html += `<span class="text-xs font-semibold text-gray-500 dark:text-darkmuted">${meta.inOffice}/${meta.total}</span>`;
   html += `<div class="w-16 h-1.5 bg-gray-200 dark:bg-darkborder rounded-full overflow-hidden"><div class="h-full bg-blue-500 rounded-full" style="width: ${deptPct}%"></div></div>`;
   html += `</div></div>`;
} else if (depth === 1) {
   html += `<div class="mt-2 ml-4 border-l-2 border-purple-200 dark:border-purple-800">`;
   html += `<div class="flex items-center justify-between px-4 py-2 bg-purple-50/50 dark:bg-purple-900/10">`;
   html += `<h4 class="font-bold text-sm text-purple-700 dark:text-purple-400">${applyAcronymsFront(nodeName)}</h4>`;
   html += `<span class="text-xs font-semibold text-gray-500 dark:text-darkmuted">${meta.inOffice}/${meta.total}</span>`;
   html += `</div>`;
} else {
   html += `<div class="mt-1 ml-8 border-l-2 border-emerald-200 dark:border-emerald-800">`;
   html += `<div class="flex items-center justify-between px-4 py-1.5 bg-emerald-50/30 dark:bg-emerald-900/10">`;
   html += `<h5 class="font-semibold text-xs text-emerald-700 dark:text-emerald-400">${applyAcronymsFront(nodeName)}</h5>`;
   html += `<span class="text-[10px] font-semibold text-gray-500 dark:text-darkmuted">${meta.inOffice}/${meta.total}</span>`;
   html += `</div>`;
}

if (meta.members.length > 0) {
  html += `<div class="divide-y divide-gray-100 dark:divide-darkborder">`;
  meta.members.forEach((m, i) => {
      const cardClass = m.isOffice 
        ? C.paradeMemberInOffice 
        : (m.statusType === 'event' ? C.paradeMemberEvent : C.paradeMemberAway);
      
      const statusIcon = m.isOffice 
        ? `<span class="text-green-600 dark:text-green-400">${ICONS.office}</span>`
        : (m.statusType === 'event' 
          ? `<span class="text-blue-600 dark:text-blue-400">${ICONS.event}</span>`
          : `<span class="text-orange-600 dark:text-orange-400">${ICONS.leave}</span>`);
      
      const kahBadge = m.isKAH ? `<span class="text-yellow-500" title="KAH">${ICONS.star}</span>` : '';
      const locText = !m.isOffice ? `<span class="text-xs italic text-gray-500 dark:text-darkmuted ml-1">(${m.location})</span>` : '';
      
      html += `
      <div class="${C.paradeMemberCard} ${cardClass} mx-2 my-1">
        <span class="w-6 shrink-0 text-right text-gray-400 dark:text-darkmuted font-medium text-xs">${i+1}</span>
        ${statusIcon}
        ${kahBadge}
        <span class="font-semibold text-sm flex-1 min-w-0 truncate">${m.name}</span>
        ${locText}
      </div>`;
  });
  html += `</div>`;
}

const childrenKeys = Object.keys(node).filter(k => k !== '_meta').sort((a, b) => String(a).localeCompare(String(b)));
childrenKeys.forEach(childKey => { html += renderNode(node[childKey], childKey, depth + 1); });

html += `</div>`;
return html;
}

let finalHtml = '';
const rootKeys = Object.keys(tree).sort((a, b) => {
if (isHQ(a) && !isHQ(b)) return -1;
if (!isHQ(a) && isHQ(b)) return 1;
return String(a).localeCompare(String(b));
});

rootKeys.forEach(root => { finalHtml += renderNode(tree[root], root, 0); });

if (paradeBody) paradeBody.innerHTML = finalHtml || `<div class="${C.emptyState}">${ICONS.empty}<p class="${C.emptyStateText} mt-2">No departments to display.</p></div>`;
} catch(err) {
console.error('Parade State Render Error:', err);
if (paradeBody) paradeBody.innerHTML = `<p class="text-red-500 text-center p-4">Error generating parade state. Please check console.</p>`;
}
}