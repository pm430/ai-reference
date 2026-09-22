// Applied synchronously (not deferred) before first paint to avoid a
// light-theme flash for users whose stored preference is dark.
document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
