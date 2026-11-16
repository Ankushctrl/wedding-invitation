/**
 * ROYAL INDIAN WEDDING INVITATION - COUNTDOWN MODULE
 * Dynamic real-time calculation and animation for wedding countdown
 */

(function () {
  'use strict';

  // Configurable Wedding Date: December 2, 2026 at 19:00:00 (7:00 PM IST)
  // Vaishali & Anil - Sainik Resort, Jatwal, Samba
  let weddingDate = new Date('2026-12-02T19:00:00+05:30').getTime();

  // Elements
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');
  const countdownGrid = document.querySelector('.countdown-grid');
  const completedMsg = document.getElementById('wedding-completed-msg');

  // Track previous values to trigger animations only on change
  let prevValues = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null
  };

  function pad(num) {
    return num < 10 ? '0' + num : num.toString();
  }

  function updateElement(el, newVal, key) {
    if (!el) return;
    const formatted = pad(newVal);
    if (prevValues[key] !== formatted) {
      el.textContent = formatted;
      el.classList.remove('number-tick');
      void el.offsetWidth; // Force DOM reflow
      el.classList.add('number-tick');
      prevValues[key] = formatted;
    }
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      // Auspicious ceremony has concluded / is in progress
      if (countdownGrid) countdownGrid.style.display = 'none';
      if (completedMsg) completedMsg.classList.add('active');
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    updateElement(daysEl, days, 'days');
    updateElement(hoursEl, hours, 'hours');
    updateElement(minutesEl, minutes, 'minutes');
    updateElement(secondsEl, seconds, 'seconds');
  }

  // Initial call and 1-second interval
  document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });
})();
