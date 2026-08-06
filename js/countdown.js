/**
 * countdown.js
 * Persistent countdown timer — resets to a random 3–6 hour window per session.
 * Stores end-time in localStorage so it survives page refreshes.
 */
export function initCountdown() {
  const key = 'cdEnd';
  const now = Date.now();
  let end = parseInt(localStorage.getItem(key) || '0');

  if (!end || end < now) {
    const hoursLeft = Math.floor(Math.random() * 4) + 3; // 3–6 hrs
    end = now + hoursLeft * 3600 * 1000;
    localStorage.setItem(key, end);
  }

  const hEl = document.getElementById('cdH');
  const mEl = document.getElementById('cdM');
  const sEl = document.getElementById('cdS');

  if (!hEl || !mEl || !sEl) return;

  function tick() {
    const diff = Math.max(0, end - Date.now());
    hEl.textContent = String(Math.floor(diff / 3600000)).padStart(2, '0');
    mEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    sEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    if (diff > 0) setTimeout(tick, 1000);
  }

  tick();
}
