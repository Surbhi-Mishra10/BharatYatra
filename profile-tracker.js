(() => {
  const storedUser = localStorage.getItem('bharatUser');
  if (!storedUser || location.pathname.endsWith('/profile.html')) return;
  let user;
  try { user = JSON.parse(storedUser); } catch { return; }
  if (!user?.email) return;
  const title = document.title.split('|')[0].trim() || 'BharatYatra';
  const detail = location.pathname.split('/').pop().replace(/\.html?$/i, '').replace(/[-_]/g, ' ') || 'home';
  let history;
  try { history = JSON.parse(localStorage.getItem('bharat_exploration_history') || '[]'); } catch { history = []; }
  const last = history[0];
  if (!last || last.path !== location.pathname || last.userEmail !== user.email) {
    history.unshift({ type: 'page', title, detail: `Visited ${detail}`, path: location.pathname, userEmail: user.email, timestamp: new Date().toLocaleDateString() });
    localStorage.setItem('bharat_exploration_history', JSON.stringify(history.slice(0, 100)));
  }
  const updateBadge = () => {
    const badge = document.querySelector('#navUserBadge, #navAuthBtn');
    if (badge) { badge.textContent = user.name?.toUpperCase() || 'PROFILE'; badge.href = 'profile.html'; }
  };
  updateBadge();
  document.addEventListener('DOMContentLoaded', updateBadge, { once: true });
})();
