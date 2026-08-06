/**
 * ui.js
 * Micro-interactions: ripple clicks, 3D card tilt, animated counters,
 * scroll progress bar, scarcity fill bar, reveal-on-scroll.
 */

// ── Scroll progress bar ──────────────────────────────────────────────
export function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / maxScroll * 100) + '%';
  }, { passive: true });
}

// ── Scroll-to-top button ─────────────────────────────────────────────
export function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 350);
  }, { passive: true });

  btn.addEventListener('click', () => {
    btn.classList.add('spin');
    btn.addEventListener('animationend', () => btn.classList.remove('spin'), { once: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Reveal elements on scroll ────────────────────────────────────────
export function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
}

// ── Scarcity progress bar fill ───────────────────────────────────────
export function initScarcityBar() {
  const fill = document.getElementById('scFill');
  if (!fill) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      fill.style.width = '72%';
      obs.disconnect();
    }
  }, { threshold: 0.5 });

  obs.observe(fill.closest('.scarcity'));
}

// ── Animated number counter ──────────────────────────────────────────
function animateCounter(el, target, duration = 1200) {
  const start      = performance.now();
  const isDecimal  = String(target).includes('.');
  const finalLabel = el.dataset.final;

  const step = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = eased * target;

    if (isDecimal) {
      el.textContent = value.toFixed(1) + '★';
    } else if (target > 50) {
      el.textContent = '+' + Math.round(value);
    } else {
      el.textContent = Math.round(value) + (el.dataset.suffix || '');
    }

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = finalLabel;
  };

  requestAnimationFrame(step);
}

export function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el    = e.target;
      const final = el.textContent.trim();
      el.dataset.final = final;

      if (final.includes('+'))      animateCounter(el, parseInt(final.replace(/\D/g, '')), 1400);
      else if (final.includes('★')) animateCounter(el, parseFloat(final), 1000);
      else if (final.includes('%')) { el.dataset.suffix = '%'; animateCounter(el, parseInt(final), 1000); }

      obs.unobserve(el);
    });
  }, { threshold: 0.7 });

  document.querySelectorAll('.sp-n').forEach(el => obs.observe(el));
}

// ── Ripple click effect ──────────────────────────────────────────────
function createRipple(btn, e) {
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const r    = document.createElement('span');

  Object.assign(r.style, {
    position:     'absolute',
    borderRadius: '50%',
    pointerEvents:'none',
    width:  size + 'px',
    height: size + 'px',
    top:  (e.clientY - rect.top  - size / 2) + 'px',
    left: (e.clientX - rect.left - size / 2) + 'px',
    background: 'rgba(255,255,255,.28)',
    transform: 'scale(0)',
    animation: 'rippleAnim .55s linear',
  });

  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

export function initRipple(selector = '.btn-submit, .btn-order, .nav-cta, .btn-banner') {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('click', e => createRipple(btn, e));
  });
}

// ── 3D tilt on testimonial cards ─────────────────────────────────────
export function initTilt(selector = '.testimonial-card') {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform  = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      card.style.boxShadow  = `${-x * 12}px ${y * 12}px 28px rgba(0,0,0,.12)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.boxShadow  = '';
      card.style.transition = 'transform .4s ease, box-shadow .4s ease';
    });
  });
}

// ── Benefit card icon hover ───────────────────────────────────────────
export function initBenefitHover() {
  document.querySelectorAll('.benefit-card').forEach(card => {
    const icon = card.querySelector('.benefit-icon');
    card.addEventListener('mouseenter', () => {
      if (icon) Object.assign(icon.style, { transform: 'scale(1.12) rotate(-4deg)', transition: 'transform .3s cubic-bezier(.34,1.56,.64,1)' });
    });
    card.addEventListener('mouseleave', () => {
      if (icon) icon.style.transform = '';
    });
  });
}

// ── Trust strip item hover ───────────────────────────────────────────
export function initTrustHover() {
  document.querySelectorAll('.ti').forEach(ti => {
    ti.addEventListener('mouseenter', () => Object.assign(ti.style, { transform: 'scale(1.08)', transition: 'transform .2s ease' }));
    ti.addEventListener('mouseleave', () => { ti.style.transform = ''; });
  });
}
