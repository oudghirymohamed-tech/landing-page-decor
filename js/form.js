/**
 * form.js
 * Order form: real-time validation, color swatch selection,
 * multi-step progress indicator, and Google Sheets submission.
 */

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz-u8GygKfWJ0CTtMnXg_uRRXiQbGjTaJW1rDynFLbpwanqmEJQiQJGjE7tKAZiH9oV/exec';

const PHONE_REGEX = /^0[5-7][0-9]{8}$/;

// ── Validation helpers ───────────────────────────────────────────────
function markField(input, valid, msg) {
  const grp     = input.closest('.form-group');
  const msgEl   = grp?.querySelector('.field-msg');
  const val     = input.value.trim();
  const isEmpty = !val;

  if (isEmpty) {
    grp?.classList.remove('valid', 'invalid');
    return;
  }

  grp?.classList.toggle('valid',   valid);
  grp?.classList.toggle('invalid', !valid);
  if (msgEl) msgEl.textContent = valid ? '✓ ممتاز' : msg;
}

function validateInput(input) {
  const val = input.value.trim();
  if (!val) { markField(input, false, ''); return false; }

  if (input.id === 'phone') {
    const ok = PHONE_REGEX.test(val);
    markField(input, ok, '✗ رقم غير صحيح — أدخل 10 أرقام');
    return ok;
  }

  markField(input, true, '');
  return true;
}

// ── Step indicator ───────────────────────────────────────────────────
function updateSteps(colorSelect) {
  const steps   = document.querySelectorAll('.form-step');
  if (!steps.length) return;

  const hasName  = document.getElementById('firstName')?.value.trim() &&
                   document.getElementById('lastName')?.value.trim();
  const hasCity  = document.getElementById('city')?.value;
  const hasColor = colorSelect.value;

  const setState = (el, active, done) => {
    el.classList.toggle('active', active);
    el.classList.toggle('done',   done);
  };

  setState(steps[0], !hasName,             !!(hasName && hasCity && hasColor));
  setState(steps[1], !!(hasName && !hasCity), !!(hasName && hasCity && hasColor));
  setState(steps[2], !!(hasName && hasCity && !hasColor), !!(hasName && hasCity && hasColor));
}

// ── Color swatches ───────────────────────────────────────────────────
function initSwatches(colorSelect, onChange) {
  document.querySelectorAll('.swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      colorSelect.value = btn.dataset.value;

      const grp = colorSelect.closest('.form-group');
      grp?.classList.add('valid');
      grp?.classList.remove('invalid');

      onChange();
    });
  });
}

// ── Form shake ───────────────────────────────────────────────────────
function shakeForm(el) {
  el.style.animation = 'none';
  void el.offsetHeight;
  el.style.animation = 'shakeForm .4s ease';
  setTimeout(() => { el.style.animation = ''; }, 500);
}

// ── Show success state ───────────────────────────────────────────────
function showSuccess(form, successBox, colorSelect) {
  form.style.display       = 'none';
  successBox.style.display = 'block';
  form.reset();
  colorSelect.value = '';
  document.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.form-group').forEach(g => g.classList.remove('valid', 'invalid'));
}

// ── Submit to Google Sheets ───────────────────────────────────────────
async function submitOrder(payload) {
  await fetch(APPS_SCRIPT_URL, {
    method:  'POST',
    mode:    'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  // no-cors always resolves; treat as success
}

// ── Public initialiser ───────────────────────────────────────────────
export function initForm() {
  const form       = document.getElementById('orderForm');
  const successBox = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');
  const colorSelect = document.getElementById('color');

  if (!form || !successBox || !submitBtn || !colorSelect) return;

  const onChange = () => updateSteps(colorSelect);

  // Live validation on all text/select inputs
  form.querySelectorAll('.form-control').forEach(input => {
    ['input', 'blur', 'change'].forEach(ev =>
      input.addEventListener(ev, () => { validateInput(input); onChange(); })
    );
  });

  // Color swatches
  initSwatches(colorSelect, onChange);

  // Submission
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const first = document.getElementById('firstName').value.trim();
    const last  = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const city  = document.getElementById('city').value;
    const color = colorSelect.value;

    // Validate all fields
    let allValid = true;
    form.querySelectorAll('.form-control[required]').forEach(input => {
      if (!validateInput(input)) allValid = false;
    });
    if (!color) {
      document.querySelectorAll('.swatch-btn').forEach(b => (b.style.outline = '2px solid #DC2626'));
      allValid = false;
    } else {
      document.querySelectorAll('.swatch-btn').forEach(b => (b.style.outline = ''));
    }

    if (!allValid || !first || !last || !phone || !city) {
      shakeForm(form);
      return;
    }
    if (!PHONE_REGEX.test(phone)) {
      const ph = document.getElementById('phone');
      validateInput(ph);
      ph.focus();
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = '⏳ جاري الإرسال...';

    try {
      await submitOrder({ nom: first, prenom: last, telephone: phone, ville: city, couleur: color, prix: 899 });
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = '🛒 اطلب الآن — 899 درهم';
    }

    showSuccess(form, successBox, colorSelect);
  });
}
