/**
 * ROYAL INDIAN WEDDING INVITATION - RSVP MODULE
 * Modular form validation, client-side confirmation,
 * and direct WhatsApp RSVP integration without false backend pretenses.
 */

(function () {
  'use strict';

  const form = document.getElementById('rsvp-form');
  const modal = document.getElementById('rsvp-modal');
  const modalCloseBtn = document.getElementById('rsvp-modal-close');
  const modalSummary = document.getElementById('rsvp-modal-summary');
  const whatsappBtn = document.getElementById('rsvp-whatsapp-btn');

  if (!form) return;

  // Validation Helpers
  function validateField(input, condition, errorMsg) {
    const parent = input.closest('.form-group');
    const errorEl = parent ? parent.querySelector('.form-error-msg') : null;

    if (!condition) {
      if (parent) parent.classList.add('has-error');
      if (errorEl) errorEl.textContent = errorMsg;
      return false;
    } else {
      if (parent) parent.classList.remove('has-error');
      return true;
    }
  }

  // Clear error on input
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach((input) => {
    input.addEventListener('input', () => {
      const parent = input.closest('.form-group');
      if (parent) parent.classList.remove('has-error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('rsvp-name');
    const phoneInput = document.getElementById('rsvp-phone');
    const countInput = document.getElementById('rsvp-guests');
    const attendanceInput = document.getElementById('rsvp-attendance');
    const dietaryInput = document.getElementById('rsvp-dietary');
    const messageInput = document.getElementById('rsvp-message');

    // Validations
    let isValid = true;

    // 1. Name: At least 2 characters
    if (!validateField(nameInput, nameInput.value.trim().length >= 2, 'Please enter your full name.')) {
      isValid = false;
    }

    // 2. Phone: At least 10 digits
    const cleanPhone = phoneInput.value.replace(/[^0-9+]/g, '');
    if (!validateField(phoneInput, cleanPhone.length >= 10, 'Please enter a valid phone or WhatsApp number (min 10 digits).')) {
      isValid = false;
    }

    // 3. Guests: Selected
    if (!validateField(countInput, countInput.value !== '', 'Please select the number of guests.')) {
      isValid = false;
    }

    // 4. Attendance: Selected
    if (!validateField(attendanceInput, attendanceInput.value !== '', 'Please confirm your attendance.')) {
      isValid = false;
    }

    if (!isValid) return;

    // Construct Payload (Modular data structure for API/Backend connection)
    const rsvpData = {
      guestName: nameInput.value.trim(),
      phone: cleanPhone,
      guestCount: countInput.value,
      attendance: attendanceInput.options[attendanceInput.selectedIndex].text,
      dietary: dietaryInput ? dietaryInput.value : 'Vegetarian',
      message: messageInput ? messageInput.value.trim() : '',
      submittedAt: new Date().toISOString()
    };

    console.log('Royal RSVP Submission Payload:', rsvpData);

    // Display Confirmation Modal
    showConfirmationModal(rsvpData);
  });

  function showConfirmationModal(data) {
    if (!modal) return;

    // Populate summary
    if (modalSummary) {
      modalSummary.innerHTML = `
        <p><strong>Distinguished Guest:</strong> ${escapeHtml(data.guestName)}</p>
        <p><strong>Contact:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Party Size:</strong> ${escapeHtml(data.guestCount)} Guest(s)</p>
        <p><strong>Response:</strong> ${escapeHtml(data.attendance)}</p>
        ${data.message ? `<p><strong>Warm Wishes:</strong> "<em>${escapeHtml(data.message)}</em>"</p>` : ''}
      `;
    }

    // Pre-fill WhatsApp RSVP link
    if (whatsappBtn) {
      const waText = encodeURIComponent(
        `👑 *Wedding RSVP - Vaishali & Anil*\n\n` +
        `• *Guest:* ${data.guestName}\n` +
        `• *Attendance:* ${data.attendance}\n` +
        `• *Total Guests:* ${data.guestCount}\n` +
        `• *Phone:* ${data.phone}\n` +
        (data.message ? `• *Blessings:* ${data.message}\n` : '') +
        `\nLooking forward to gracing the wedding celebrations at Sainik Resort, Jatwal!`
      );
      // Optional configurable WhatsApp number (e.g. +91 9876543210 or general share)
      whatsappBtn.href = `https://api.whatsapp.com/send?text=${waText}`;
      whatsappBtn.target = '_blank';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    form.reset();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Security Helper: Escape HTML to avoid injection
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
