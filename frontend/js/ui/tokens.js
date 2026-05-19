// ==========================================
// Design Tokens & Reusable HTML Helpers
// ==========================================

// --- Event Type Color Mapping ---
const EVENT_TYPE_COLORS = {
  'Annual Leave': { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300 dark:border-amber-700', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500', accent: 'border-l-amber-500' },
  'Sick Leave': { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-300 dark:border-red-700', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500', accent: 'border-l-red-500' },
  'MC': { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-300 dark:border-rose-700', text: 'text-rose-700 dark:text-rose-400', dot: 'bg-rose-500', accent: 'border-l-rose-500' },
  'Overseas Leave': { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500', accent: 'border-l-purple-500' },
  'OIL': { bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-300 dark:border-teal-700', text: 'text-teal-700 dark:text-teal-400', dot: 'bg-teal-500', accent: 'border-l-teal-500' },
  'Meeting': { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500', accent: 'border-l-blue-500' },
  'Event': { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-300 dark:border-indigo-700', text: 'text-indigo-700 dark:text-indigo-400', dot: 'bg-indigo-500', accent: 'border-l-indigo-500' },
  'Training': { bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-300 dark:border-cyan-700', text: 'text-cyan-700 dark:text-cyan-400', dot: 'bg-cyan-500', accent: 'border-l-cyan-500' },
  'default': { bg: 'bg-gray-50 dark:bg-gray-800/30', border: 'border-gray-300 dark:border-gray-600', text: 'text-gray-700 dark:text-gray-400', dot: 'bg-gray-500', accent: 'border-l-gray-500' }
};

function getEventTypeColor(typeName) {
  if (!typeName) return EVENT_TYPE_COLORS.default;
  for (const [key, val] of Object.entries(EVENT_TYPE_COLORS)) {
    if (key !== 'default' && typeName.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return EVENT_TYPE_COLORS.default;
}

// --- SVG Icon Helpers ---
const ICONS = {
  calendar: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
  clock: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  location: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
  users: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
  check: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
  x: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
  alert: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>',
  chevronDown: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>',
  office: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
  leave: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  event: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
  star: '<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  search: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>',
  filter: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>',
  empty: '<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>',
  loading: '<svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>',
};

// --- Class String Tokens ---
const C = {
  // Card containers
  card: 'bg-white dark:bg-darksurface rounded-xl shadow-sm border border-gray-200 dark:border-darkborder',
  cardInner: 'bg-white dark:bg-darksurface rounded-lg border border-gray-300 dark:border-darkborder shadow-sm',
  cardHover: 'transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',

  // Form inputs — standard
  input: 'w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-gray-50 dark:bg-darkinput focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white outline-none shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/50 transition text-sm',
  // Compact (admin register, admin manage)
  inputSm: 'w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg py-1.5 px-3 bg-gray-50 dark:bg-darkinput focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white outline-none shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm',
  // Dark variant (edit-user, manage-user detail fields)
  inputDark: 'w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-sm py-1.5 px-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition',
  // Date picker trigger buttons
  inputBtn: 'w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-gray-50 dark:bg-darkinput hover:bg-white dark:hover:bg-black text-left outline-none font-medium transition text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200',

  // Labels
  label: 'block font-semibold mb-1 text-sm',
  labelSm: 'block font-semibold mb-1 text-xs',

  // Primary action button
  btnPrimary: 'w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow-md transition text-base',
  btnPrimarySm: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow transition text-xs',

  // Secondary / cancel button
  btnSecondary: 'w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-lg shadow transition text-sm',

  // Dropdown search results
  dropdown: 'absolute z-30 w-full bg-white dark:bg-darksurface border-2 border-blue-400 dark:border-blue-600 rounded-lg shadow-2xl hidden-view max-h-40 overflow-y-auto mt-1',
  dropdownEmerald: 'absolute z-30 w-full bg-white dark:bg-darksurface border-2 border-emerald-400 dark:border-emerald-700 rounded-lg shadow-2xl hidden-view max-h-48 overflow-y-auto mt-1',

  // Sticky section headers (agenda day groups)
  sectionHeader: 'sticky top-0 bg-gray-50 dark:bg-darkinput z-10 py-1.5 border-y border-gray-200 dark:border-darkborder mb-3 shadow-sm px-2 rounded-lg',

  // Form footer (sticky save button area)
  formFooter: 'shrink-0 p-3 border-t border-gray-200 dark:border-darkborder bg-gray-100 dark:bg-darkinput z-10',
  formFooterShadow: 'shrink-0 p-3 bg-white dark:bg-darksurface border-t border-gray-200 dark:border-darkborder shadow-[0_-4px_6px_rgba(0,0,0,0.1)] z-20',

  // Attendee chip
  chip: 'inline-flex items-center bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300 rounded-lg px-2 py-1 text-sm font-semibold shadow-sm',

  // Agenda card
  agendaCard: 'border border-gray-200 dark:border-darkborder p-3 md:p-4 rounded-xl shadow-sm bg-white dark:bg-darksurface flex flex-col transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 border-l-4 border-l-gray-400',
  agendaCardInfoAll: 'p-2.5 rounded-lg border border-blue-200 dark:border-blue-800/60 bg-white/60 dark:bg-black/20 flex flex-col border-l-4 border-l-blue-400',
  agendaTypeChip: 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold',

  // Action buttons inside agenda cards
  btnEdit: 'font-bold bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-4 py-1.5 rounded-lg transition',
  btnCancel: 'font-bold bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 px-4 py-1.5 rounded-lg transition',
  btnEditSm: 'font-bold bg-blue-200/50 dark:bg-blue-800/40 hover:bg-blue-300/50 dark:hover:bg-blue-800/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700 px-3 py-1 rounded-lg transition text-xs',
  btnCancelSm: 'font-bold bg-red-100/80 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 px-3 py-1 rounded-lg transition text-xs',

  // List item (KAH, menu order, acronym rows)
  listItem: 'flex justify-between items-center bg-white dark:bg-darksurface p-2 rounded-lg border border-gray-300 dark:border-darkborder shadow-sm',

  // Admin section card
  adminSection: 'bg-white dark:bg-darksurface rounded-xl shadow border border-gray-200 dark:border-darkborder p-4',

  // Status badges
  badgePending: 'inline-flex items-center gap-1 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
  badgeCancelled: 'inline-flex items-center gap-1 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
  badgeApproved: 'inline-flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',

  // Quick stat cards
  statCard: 'flex flex-col items-center justify-center p-2.5 rounded-xl bg-white dark:bg-darksurface border border-gray-200 dark:border-darkborder shadow-sm',
  statValue: 'text-lg font-bold leading-tight',
  statLabel: 'text-[10px] font-medium text-gray-500 dark:text-darkmuted uppercase tracking-wide mt-0.5',

  // Filter chips
  filterChip: 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer select-none whitespace-nowrap',
  filterChipActive: 'bg-blue-600 text-white border-blue-600 shadow-sm',
  filterChipInactive: 'bg-white dark:bg-darksurface text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-darkhover',

  // Empty state
  emptyState: 'flex flex-col items-center justify-center py-12 px-4 text-center',
  emptyStateIcon: 'text-gray-300 dark:text-gray-600 mb-3',
  emptyStateText: 'text-gray-500 dark:text-darkmuted text-sm font-medium',

  // Skeleton loader
  skeleton: 'animate-pulse bg-gray-200 dark:bg-darkborder rounded',
  skeletonCard: 'animate-pulse bg-gray-200 dark:bg-darkborder rounded-xl h-20',
  skeletonText: 'animate-pulse bg-gray-200 dark:bg-darkborder rounded h-3',
  skeletonTextSm: 'animate-pulse bg-gray-200 dark:bg-darkborder rounded h-2 w-24',

  // Parade state member cards
  paradeMemberCard: 'flex items-center gap-2 p-2 rounded-lg border transition-all duration-150 hover:shadow-sm',
  paradeMemberInOffice: 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/40',
  paradeMemberAway: 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/40',
  paradeMemberEvent: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/40',
};

// --- HTML Helper Functions ---

function labelHtml(text, opts) {
  opts = opts || {};
  var cls = opts.small ? C.labelSm : C.label;
  var extra = '';
  if (opts.required) extra = ' <span class="text-red-500">*</span>';
  if (opts.optional) extra = ' <span class="text-[10px] font-normal text-gray-500">(Optional)</span>';
  return '<label class="' + cls + '">' + text + extra + '</label>';
}

function inputHtml(opts) {
  opts = opts || {};
  var id = opts.id ? 'id="' + opts.id + '"' : '';
  var type = opts.type || 'text';
  var value = opts.value !== undefined ? 'value="' + opts.value + '"' : '';
  var placeholder = opts.placeholder ? 'placeholder="' + opts.placeholder + '"' : '';
  var cls = opts.compact ? C.inputSm : (opts.dark ? C.inputDark : C.input);
  var extra = opts.extra || '';
  var required = opts.required ? 'required' : '';
  var disabled = opts.disabled ? 'disabled' : '';
  var autocomplete = opts.autocomplete ? 'autocomplete="' + opts.autocomplete + '"' : '';
  return '<input type="' + type + '" ' + id + ' class="' + cls + ' ' + extra + '" ' + value + ' ' + placeholder + ' ' + required + ' ' + disabled + ' ' + autocomplete + '>';
}

function selectHtml(opts) {
  opts = opts || {};
  var id = opts.id ? 'id="' + opts.id + '"' : '';
  var cls = opts.compact ? C.inputSm : C.input;
  var extra = opts.extra || '';
  var required = opts.required ? 'required' : '';
  var onchange = opts.onchange ? 'onchange="' + opts.onchange + '"' : '';
  return '<select ' + id + ' class="' + cls + ' cursor-pointer ' + extra + '" ' + required + ' ' + onchange + '>' + (opts.options || '') + '</select>';
}

function dateBtnHtml(opts) {
  opts = opts || {};
  var id = opts.id ? 'id="' + opts.id + '"' : '';
  var onclick = opts.onclick || '';
  var text = opts.text || 'Select Date';
  var extra = opts.extra || '';
  return '<button type="button" ' + id + ' class="' + C.inputBtn + ' ' + extra + '" onclick="' + onclick + '">' + text + '</button>';
}

function textareaHtml(opts) {
  opts = opts || {};
  var id = opts.id ? 'id="' + opts.id + '"' : '';
  var rows = opts.rows || 2;
  var placeholder = opts.placeholder || '';
  var autoresize = opts.autoresize ? "oninput=\"this.style.height='auto';this.style.height=this.scrollHeight+'px';\"" : '';
  return '<textarea ' + id + ' rows="' + rows + '" class="' + C.input + '" placeholder="' + placeholder + '" ' + autoresize + '></textarea>';
}

function searchDropdownHtml(opts) {
  opts = opts || {};
  var inputId = opts.inputId || '';
  var resultsId = opts.resultsId || '';
  var placeholder = opts.placeholder || 'Search...';
  var borderCls = opts.emerald
    ? 'border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 placeholder-emerald-600/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800/50'
    : 'border-2 border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 placeholder-blue-400 dark:placeholder-blue-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/50';
  var onkeyup = opts.onkeyup || '';
  var dropdownCls = opts.emerald ? C.dropdownEmerald : C.dropdown;
  return '<div class="relative">' +
    '<input type="text" id="' + inputId + '" class="w-full ' + C.inputSm + ' ' + borderCls + ' font-semibold" placeholder="' + placeholder + '" autocomplete="off" onkeyup="' + onkeyup + '">' +
    '<div id="' + resultsId + '" class="' + dropdownCls + '"></div>' +
    '</div>';
}

function formFooterHtml(buttonText, cancelId) {
  var html = '<div class="' + C.formFooter + '">' +
    '<button type="submit" class="' + C.btnPrimary + '">' + buttonText + '</button>';
  if (cancelId) {
    html += '<button type="button" id="' + cancelId + '" onclick="cancelEditMode()" class="' + C.btnSecondary + ' hidden-view mt-2">Cancel Edit</button>';
  }
  html += '</div>';
  return html;
}

function adminSectionHtml(title, color, content, reorderable) {
  var handle = reorderable
    ? '<svg class="w-5 h-5 text-gray-400 dark:text-darkmuted cursor-grab section-handle" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" /></svg>'
    : '';
  return '<div class="' + C.adminSection + '">' +
    '<div class="flex justify-between items-center mb-3">' +
    '<h3 class="font-bold text-base text-' + color + '-600 dark:text-' + color + '-400">' + title + '</h3>' +
    handle +
    '</div>' +
    content +
    '</div>';
}

function statusBadgeHtml(status) {
  var safe = String(status || '');
  var cls = C.badgeApproved;
  var icon = ICONS.check;
  var text = safe.replace('Approved', 'Cal Updated');
  if (safe.includes('Pending')) {
    cls = C.badgePending;
    icon = ICONS.alert;
  } else if (safe.includes('Cancelled')) {
    cls = C.badgeCancelled;
    icon = ICONS.x;
  }
  return '<span class="text-[10px] md:text-[11px] font-bold px-2 py-1 rounded text-center inline-block leading-tight ' + cls + '">' + icon + '<span>' + text + '</span></span>';
}

// Export for use in other files (via window global since no module system)
if (typeof window !== 'undefined') {
  window.T = C;
  window.labelHtml = labelHtml;
  window.inputHtml = inputHtml;
  window.selectHtml = selectHtml;
  window.dateBtnHtml = dateBtnHtml;
  window.textareaHtml = textareaHtml;
  window.searchDropdownHtml = searchDropdownHtml;
  window.formFooterHtml = formFooterHtml;
  window.adminSectionHtml = adminSectionHtml;
  window.statusBadgeHtml = statusBadgeHtml;
}
