/**
 * ROYAL INDIAN WEDDING INVITATION - INTERACTIVE SCRATCH CARD MODULE
 * Implemented using HTML5 Canvas API with touch & mouse interaction,
 * high-DPI scaling, scratch-off percentage tracking, and sparkle reveal.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('scratch-canvas');
  const container = document.querySelector('.scratch-container');
  const progressBar = document.getElementById('scratch-progress-fill');
  const progressText = document.getElementById('scratch-progress-text');
  const autoRevealBtn = document.getElementById('scratch-reveal-all-btn');
  const copyPasscodeBtn = document.getElementById('copy-passcode-btn');

  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let isDrawing = false;
  let isRevealed = false;
  let lastX = 0;
  let lastY = 0;
  let checkThrottleTimeout = null;

  // Set canvas size matching container dimensions with Hi-DPI support
  function setupCanvas() {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    renderCover(rect.width, rect.height);
  }

  // Paint the luxurious Royal Gold Foil Cover
  function renderCover(width, height) {
    // 1. Gold Foil Gradient Base
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#E5C158');
    grad.addColorStop(0.2, '#D4AF37');
    grad.addColorStop(0.4, '#FBF0B9');
    grad.addColorStop(0.6, '#AA7C11');
    grad.addColorStop(0.8, '#D4AF37');
    grad.addColorStop(1, '#8A600F');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Gold Leaf Texture (procedural speckles)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rSize = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(120, 0, 22, 0.15)';
    for (let i = 0; i < 200; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rSize = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Ornate Double Gold Border
    ctx.strokeStyle = '#FFEAA7';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    ctx.strokeStyle = 'rgba(120, 0, 22, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(22, 22, width - 44, height - 44);
    ctx.setLineDash([]);

    // 4. Center Royal Wax Seal / Medallion
    const centerX = width / 2;
    const centerY = height / 2;

    // Seal Outer Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, 65, 0, Math.PI * 2);
    ctx.fillStyle = '#540B1E';
    ctx.fill();
    ctx.strokeStyle = '#FFEAA7';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Seal Inner Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, 58, 0, Math.PI * 2);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Royal Crown / Lotus Icon inside Seal
    ctx.fillStyle = '#FFEAA7';
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👑', centerX, centerY - 20);

    // Scratch Instruction Text
    ctx.font = 'bold 11px Montserrat, sans-serif';
    ctx.fillStyle = '#FFEAA7';
    ctx.fillText('SCRATCH HERE', centerX, centerY + 8);
    ctx.font = '9px Montserrat, sans-serif';
    ctx.fillStyle = 'rgba(255, 234, 167, 0.85)';
    ctx.fillText('TO REVEAL THE DATE', centerX, centerY + 24);
  }

  // Calculate pointer coordinates relative to canvas
  function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // Scratch action using 'destination-out'
  function scratch(x, y) {
    if (isRevealed) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 42;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Also draw circle at current point for smooth touch taps
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    lastX = x;
    lastY = y;

    // Throttle percentage check to prevent performance lag
    if (!checkThrottleTimeout) {
      checkThrottleTimeout = setTimeout(() => {
        calculateScratchPercent();
        checkThrottleTimeout = null;
      }, 100);
    }
  }

  // Calculate how much area has been scratched away
  function calculateScratchPercent() {
    if (isRevealed) return;

    const dpr = window.devicePixelRatio || 1;
    const sampleWidth = Math.floor(canvas.width);
    const sampleHeight = Math.floor(canvas.height);

    // Sample pixels in steps of 16 for optimal performance
    const step = 16 * dpr;
    let transparentPixels = 0;
    let totalSamples = 0;

    try {
      const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
      const data = imgData.data;

      for (let y = 0; y < sampleHeight; y += step) {
        for (let x = 0; x < sampleWidth; x += step) {
          const index = (Math.floor(y) * sampleWidth + Math.floor(x)) * 4 + 3;
          if (data[index] < 128) {
            transparentPixels++;
          }
          totalSamples++;
        }
      }

      const percent = Math.min(100, Math.round((transparentPixels / totalSamples) * 100));

      if (progressBar) progressBar.style.width = percent + '%';
      if (progressText) progressText.textContent = percent + '% Scratched';

      // Auto-reveal if user scratched more than 45%
      if (percent >= 45) {
        completeReveal();
      }
    } catch (err) {
      console.warn('Scratch percent check:', err);
    }
  }

  // Sparkle burst effect on full reveal
  function triggerSparkles() {
    const rect = container.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-effect';
      sparkle.style.left = Math.random() * rect.width + 'px';
      sparkle.style.top = Math.random() * rect.height + 'px';
      container.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 900);
    }
  }

  // Complete the reveal smoothly
  function completeReveal() {
    if (isRevealed) return;
    isRevealed = true;

    canvas.classList.add('fade-out');
    if (progressBar) progressBar.style.width = '100%';
    if (progressText) progressText.textContent = 'Revealed! ✨';
    if (autoRevealBtn) autoRevealBtn.style.display = 'none';

    triggerSparkles();
  }

  // Event Listeners for Mouse and Touch
  function onPointerDown(e) {
    if (isRevealed) return;
    isDrawing = true;
    const pos = getPointerPos(e);
    lastX = pos.x;
    lastY = pos.y;
    scratch(pos.x, pos.y);
  }

  function onPointerMove(e) {
    if (!isDrawing || isRevealed) return;
    e.preventDefault(); // Prevent page scroll on touch drag
    const pos = getPointerPos(e);
    scratch(pos.x, pos.y);
  }

  function onPointerUp() {
    isDrawing = false;
  }

  // Mouse
  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  // Touch
  canvas.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerUp);

  // Auto-reveal button helper
  if (autoRevealBtn) {
    autoRevealBtn.addEventListener('click', (e) => {
      e.preventDefault();
      completeReveal();
    });
  }

  // Copy VIP Passcode helper
  if (copyPasscodeBtn) {
    copyPasscodeBtn.addEventListener('click', () => {
      const code = 'VAISHALI-ANIL-2026';
      navigator.clipboard.writeText(code).then(() => {
        const originalText = copyPasscodeBtn.innerHTML;
        copyPasscodeBtn.innerHTML = '✓ Code Copied!';
        setTimeout(() => {
          copyPasscodeBtn.innerHTML = originalText;
        }, 2200);
      });
    });
  }

  // Re-calculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!isRevealed) setupCanvas();
    }, 250);
  });

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', setupCanvas);
})();
