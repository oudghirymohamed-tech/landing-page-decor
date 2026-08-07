/**
 * toast.js
 * Shows "recent order" social-proof toasts at a fixed interval.
 * Rotates through a list of fake-realistic customer names.
 */
const CUSTOMERS = [
  { name: 'فاطمة من مراكش',        letter: 'ف', time: 'منذ دقيقتين'   },
  { name: 'نادية من الدار البيضاء', letter: 'ن', time: 'منذ 5 دقائق'   },
  { name: 'سلمى من فاس',            letter: 'س', time: 'منذ 8 دقائق'   },
  { name: 'ليلى من الرباط',          letter: 'ل', time: 'منذ 11 دقيقة'  },
  { name: 'مريم من طنجة',            letter: 'م', time: 'منذ 14 دقيقة' },
];

const FIRST_DELAY    = 5_000;   // ms before the first toast
const REPEAT_INTERVAL = 18_000;  // ms between subsequent toasts

export function initToast() {
  const toast    = document.getElementById('orderToast');
  const avatar   = toast?.querySelector('.toast-avatar');
  const nameEl   = document.getElementById('toastName');
  const timeEl   = document.getElementById('toastTime');

  if (!toast || !nameEl || !timeEl) return;

  let index = 0;

  function show() {
    const customer = CUSTOMERS[index % CUSTOMERS.length];
    index++;

    if (avatar) avatar.textContent = customer.letter;
    nameEl.textContent = customer.name;
    timeEl.textContent = 'طلبت ' + customer.time;

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  setTimeout(() => {
    show();
    setInterval(show, REPEAT_INTERVAL);
  }, FIRST_DELAY);
}
