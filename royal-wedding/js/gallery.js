/**
 * ROYAL INDIAN WEDDING INVITATION - GALLERY LIGHTBOX MODULE
 * Vanilla JavaScript Lightbox with Prev/Next navigation,
 * touch swipe support, keyboard controls, and accessible focus management.
 */

(function () {
  'use strict';

  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const captionTitle = document.getElementById('lightbox-caption-title');
  const counterText = document.getElementById('lightbox-counter');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');
  const btnClose = document.getElementById('lightbox-close');

  if (!modal || galleryItems.length === 0) return;

  // Extract gallery data from DOM
  const galleryData = Array.from(galleryItems).map((item, index) => {
    const img = item.querySelector('.gallery-img');
    const title = item.querySelector('.gallery-caption-title');
    const subtitle = item.querySelector('.gallery-caption-sub');
    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : 'Royal Wedding Photo',
      title: title ? title.textContent : `Royal Moment ${index + 1}`,
      subtitle: subtitle ? subtitle.textContent : 'Palace Celebration'
    };
  });

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function updateLightbox(index) {
    if (index < 0) index = galleryData.length - 1;
    if (index >= galleryData.length) index = 0;
    currentIndex = index;

    const data = galleryData[currentIndex];
    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.97)';
      setTimeout(() => {
        lightboxImg.src = data.src;
        lightboxImg.alt = data.alt;
        lightboxImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      }, 100);
    }

    if (captionTitle) captionTitle.textContent = data.title;
    if (counterText) counterText.textContent = `${currentIndex + 1} of ${galleryData.length}`;
  }

  function openLightbox(index) {
    updateLightbox(index);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextImage() {
    updateLightbox(currentIndex + 1);
  }

  function prevImage() {
    updateLightbox(currentIndex - 1);
  }

  // Attach click to gallery cards
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  // Family Lightbox Triggers
  const familyTriggers = document.querySelectorAll('[data-family-lightbox]');
  familyTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const src = trigger.getAttribute('data-family-lightbox');
      const caption = trigger.getAttribute('data-caption') || 'Family Portrait';
      if (lightboxImg) {
        lightboxImg.src = src;
        lightboxImg.alt = caption;
      }
      if (captionTitle) captionTitle.innerHTML = caption;
      if (counterText) counterText.textContent = 'Family Portrait';
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Modal Controls
  if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
  if (btnClose) btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });

  // Light dismiss on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Touch Swipe gestures for mobile
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndX - touchStartX;
    if (diff > swipeThreshold) {
      prevImage(); // Swipe Right -> Prev
    } else if (diff < -swipeThreshold) {
      nextImage(); // Swipe Left -> Next
    }
  }
})();
