/**
 * app.js — Entry point
 * Imports and initialises all feature modules.
 * Each module is self-contained and only touches its own DOM scope.
 */
import { initCountdown    } from './countdown.js';
import { initToast        } from './toast.js';
import { initFaq          } from './faq.js';
import { initForm         } from './form.js';
import {
  initScrollProgress,
  initScrollTop,
  initReveal,
  initScarcityBar,
  initCounters,
  initRipple,
  initTilt,
  initBenefitHover,
  initTrustHover,
} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initScrollTop();
  initReveal();
  initScarcityBar();
  initCounters();
  initRipple();
  initTilt();
  initBenefitHover();
  initTrustHover();

  initCountdown();
  initToast();
  initFaq();
  initForm();
});
