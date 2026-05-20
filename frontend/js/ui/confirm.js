// ==========================================
// Confirmation Dialog System
// ==========================================

window._confirmStack = [];
window._confirmId = 0;

window.showConfirm = function(message, title, options) {
  return new Promise((resolve) => {
    options = options || {};
    const id = ++window._confirmId;
    const isDanger = options.danger || false;
    const dangerText = options.dangerText || 'This action cannot be undone.';
    const confirmLabel = options.confirmLabel || 'Confirm';
    const cancelLabel = options.cancelLabel || 'Cancel';

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.id = `confirm-backdrop-${id}`;
    backdrop.className = 'fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 animate-fade-in';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'bg-white dark:bg-darksurface rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up';
    modal.style.animationDuration = '0.2s';

    const iconSvg = isDanger
      ? `<svg class="w-10 h-10 shrink-0 ${isDanger ? 'text-red-600 dark:text-red-400' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>`
      : `<svg class="w-10 h-10 shrink-0 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

    modal.innerHTML = `
      <div class="p-5 pb-4">
        <div class="flex justify-center mb-3">${iconSvg}</div>
        ${title ? `<h3 class="text-lg font-bold text-gray-900 dark:text-white text-center mb-1">${title}</h3>` : ''}
        <p class="text-sm text-gray-600 dark:text-darkmuted text-center leading-relaxed">${message}</p>
        ${isDanger ? `<p class="text-xs text-red-600 dark:text-red-400 text-center mt-2 font-medium">${dangerText}</p>` : ''}
      </div>
      <div class="flex border-t border-gray-200 dark:border-darkborder">
        <button id="confirm-cancel-${id}" class="flex-1 py-3 text-sm font-semibold text-gray-700 dark:text-darktext hover:bg-gray-100 dark:hover:bg-darkhover transition">${cancelLabel}</button>
        <button id="confirm-ok-${id}" class="flex-1 py-3 text-sm font-semibold text-white ${isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} transition">${confirmLabel}</button>
      </div>
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    // Focus the cancel button
    const cancelBtn = modal.querySelector(`#confirm-cancel-${id}`);
    const okBtn = modal.querySelector(`#confirm-ok-${id}`);
    cancelBtn.focus();

    const cleanup = () => {
      backdrop.remove();
      window._confirmStack = window._confirmStack.filter(c => c.id !== id);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    const handleOk = () => {
      cleanup();
      resolve(true);
    };

    cancelBtn.addEventListener('click', handleCancel);
    okBtn.addEventListener('click', handleOk);

    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) handleCancel();
    });

    // Trap focus
    const focusable = modal.querySelectorAll('button');
    backdrop.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleCancel();
      if (e.key === 'Tab') {
        e.preventDefault();
        const currentFocus = document.activeElement;
        let nextIdx = Array.from(focusable).indexOf(currentFocus) + 1;
        if (nextIdx >= focusable.length) nextIdx = 0;
        focusable[nextIdx].focus();
      }
    });

    window._confirmStack.push({ id, resolve, cleanup: () => {} });
  });
};
