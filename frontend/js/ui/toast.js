// ==========================================
// Toast / Notification System
// ==========================================

window._toasts = [];
window._toastId = 0;

window.showToast = function(message, type, duration) {
 type = type || 'info';
 duration = duration || 4000;

 const container = document.getElementById('toast-container');
 if (!container) return;

 const id = ++window._toastId;
 const colors = {
   success: 'bg-green-600 dark:bg-green-700',
   error: 'bg-red-600 dark:bg-red-700',
   warning: 'bg-amber-500 dark:bg-amber-600',
   info: 'bg-blue-600 dark:bg-blue-700'
 };

 const icons = {
   success: `<svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
   error: `<svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
   warning: `<svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>`,
   info: `<svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
 };

 const toastEl = document.createElement('div');
 toastEl.id = `toast-${id}`;
 toastEl.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 min-w-[280px] max-w-sm animate-toast-in pointer-events-auto cursor-pointer relative overflow-hidden`;
 toastEl.setAttribute('role', 'alert');
 toastEl.setAttribute('aria-live', 'assertive');

 const progressBar = document.createElement('div');
 progressBar.className = 'absolute bottom-0 left-0 h-[3px] bg-white/30 transition-all duration-linear';
 progressBar.style.width = '100%';
 progressBar.dataset.duration = duration;

 toastEl.innerHTML = `
   ${icons[type]}
   <div class="flex-grow text-sm font-medium leading-snug">${message}</div>
   <button onclick="window.dismissToast(${id})" class="shrink-0 text-white/70 hover:text-white p-0.5 rounded transition" aria-label="Dismiss notification">
     <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
   </button>
 `;

 toastEl.appendChild(progressBar);

 container.appendChild(toastEl);
 window._toasts.push({ id, el: toastEl, timer: null });

 // Animate progress bar
 requestAnimationFrame(() => {
   progressBar.style.transitionDuration = `${duration}ms`;
   progressBar.style.width = '0%';
 });

 const dismiss = () => {
   window._toasts = window._toasts.filter(t => t.id !== id);
   toastEl.classList.remove('animate-toast-in');
   toastEl.classList.add('animate-toast-out');
   setTimeout(() => {
     if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
   }, 300);
 };

 const timer = setTimeout(dismiss, duration);

 // Click to dismiss
 toastEl.addEventListener('click', (e) => {
   if (!e.target.closest('button')) {
     clearTimeout(timer);
     dismiss();
   }
 });

 return id;
};

window.dismissToast = function(id) {
 const t = window._toasts.find(t => t.id === id);
 if (t) {
   clearTimeout(t.timer);
   t.el.classList.remove('animate-toast-in');
   t.el.classList.add('animate-toast-out');
   setTimeout(() => {
     if (t.el.parentNode) t.el.parentNode.removeChild(t.el);
   }, 300);
   window._toasts = window._toasts.filter(x => x.id !== id);
 }
};

window.clearToasts = function() {
 window._toasts.forEach(t => {
   clearTimeout(t.timer);
   t.el.remove();
 });
 window._toasts = [];
};