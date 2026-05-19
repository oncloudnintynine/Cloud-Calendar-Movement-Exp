// ==========================================
// Design Tokens & Reusable HTML Helpers
// ==========================================

// --- Class String Tokens ---
const C = {
  // Card containers
  card: 'bg-white dark:bg-darksurface rounded-xl shadow-sm border border-gray-200 dark:border-darkborder',
  cardInner: 'bg-white dark:bg-darksurface rounded-lg border border-gray-300 dark:border-darkborder shadow-sm',

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
  agendaCard: 'border border-gray-300 dark:border-darkborder p-3 md:p-4 rounded-xl shadow-sm bg-white dark:bg-darksurface flex flex-col transition hover:border-blue-300 dark:hover:border-blue-700',
  agendaCardInfoAll: 'p-2.5 rounded-lg border border-blue-200 dark:border-blue-800/60 bg-white/60 dark:bg-black/20 flex flex-col',

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
  badgePending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
  badgeCancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
  badgeApproved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
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
  var text = safe.replace('Approved', 'Cal Updated');
  if (safe.includes('Pending')) cls = C.badgePending;
  else if (safe.includes('Cancelled')) cls = C.badgeCancelled;
  return '<span class="text-[10px] md:text-[11px] font-bold px-2 py-1 rounded text-center inline-block leading-tight ' + cls + '">' + text + '</span>';
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
