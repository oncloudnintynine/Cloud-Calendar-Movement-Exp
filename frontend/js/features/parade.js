// ==========================================
// Parade State Logic
// ==========================================

function renderParadeState() {
const paradeHeader = document.getElementById('parade-state-header');
const paradeBody = document.getElementById('parade-state-body');

if (!companyContacts || companyContacts.length === 0) {
 if(paradeHeader) paradeHeader.innerText = `Overall Parade State`;
 if(paradeBody) paradeBody.innerHTML = `<div class="${C.emptyState}">${ICONS.loading}<p class="${C.emptyStateText} mt-2">Loading personnel data...</p></div>`;
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
     if (l.Phone == contact.phone) isTarget = true;
     else if (l.Attendees) {
       try {
         const att = JSON.parse(l.Attendees);
         isTarget = att.some(a => (a.type === 'contact' && a.id == contact.phone) || (a.type === 'group' && a.dept === contact.dept));
       } catch(e) { isTarget = String(l.Attendees).includes(contact.phone); }
     }
     if (!isTarget) return false;
     
     const sDate = new Date(l.StartDate);
     const eDate = new Date(l.EndDate);
     const typeObj = window.appTypicalEventTypes ? window.appTypicalEventTypes.find(t => t.name === l.LeaveType) : null;
     const isEvent = typeObj ? typeObj.isEvent : false;
     
     if (!isEvent) eDate.setHours(23, 59, 59, 999);
     
     return sDate <= now && eDate >= now;
   });
   
   let isOffice = true;
   let locationStr = 'Office';
   let statusType = 'office';

   if (activeRecords.length > 0) {
     let activeRecord = activeRecords[0]; 
     
     for (const rec of activeRecords) {
        const tObj = window.appTypicalEventTypes ? window.appTypicalEventTypes.find(t => t.name === rec.LeaveType) : null;
        const isEvt = tObj ? tObj.isEvent : false;
        let checkLoc = isEvt ? (rec.Location || 'Event') : (rec.LeaveType || 'Leave');
        
        if (String(checkLoc).toLowerCase() !== 'office') {
            activeRecord = rec; 
            break;
        }
     }

     const typeObj = window.appTypicalEventTypes ? window.appTypicalEventTypes.find(t => t.name === activeRecord.LeaveType) : null;
     const isEvent = typeObj ? typeObj.isEvent : false;

     if (isEvent) {
       locationStr = activeRecord.Location || 'Event';
       if (activeRecord.LocationDetails) {
           locationStr += ` - ${activeRecord.LocationDetails}`;
       }
       isOffice = String(activeRecord.Location || '').toLowerCase() === 'office';
       statusType = isOffice ? 'office' : 'event';
     } else {
       locationStr = activeRecord.LeaveType || 'Leave';
       if (activeRecord.Country) locationStr += ` (${activeRecord.Country})`;
       isOffice = false;
       statusType = 'leave';
     }
   }

   if (isOffice) inOfficeGlobal++;
   
   const isKAH = window.kahPhones && window.kahPhones.includes(String(contact.phone));
   
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
     <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span>${inOfficeGlobal} In Office</span>
     <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-500"></span>${totalGlobal - inOfficeGlobal} Away</span>
   </div>`;

 // SORT RULE: 1. In Office, 2. KAH, 3. Alpha
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
         html += `<div class="mt-2 border-t border-gray-100 dark:border-darkborder">`;
         html += `<div class="flex items-center justify-between px-4 py-2 bg-purple-50/50 dark:bg-purple-900/10">`;
         html += `<h4 class="font-bold text-sm text-purple-700 dark:text-purple-400">${applyAcronymsFront(nodeName)}</h4>`;
         html += `<span class="text-xs font-semibold text-gray-500 dark:text-darkmuted">${meta.inOffice}/${meta.total}</span>`;
         html += `</div>`;
     } else {
         html += `<div class="mt-1 border-t border-gray-100 dark:border-darkborder">`;
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