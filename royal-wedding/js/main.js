/**
 * ROYAL INDIAN WEDDING INVITATION - MAIN ORCHESTRATION SCRIPT
 * Handles Floating Petals, Scroll Animations, Navbar State,
 * Parallax Effects, and Native Web Audio Royal Raga Synthesizer.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. FLOATING FLOWER PETALS (CANVAS SIMULATION)
     ========================================================================== */
  const petalsCanvas = document.getElementById('petals-canvas');
  if (petalsCanvas) {
    const pCtx = petalsCanvas.getContext('2d');
    let width, height;
    let petals = [];
    const petalColors = [
      { r: 218, g: 41, b: 70, a: 0.8 },   // Crimson Rose
      { r: 180, g: 20, b: 50, a: 0.75 },  // Deep Velvet Red
      { r: 255, g: 170, b: 30, a: 0.85 }, // Marigold Golden Yellow
      { r: 240, g: 120, b: 20, a: 0.8 },  // Royal Ochre Saffron
      { r: 245, g: 190, b: 140, a: 0.6 }  // Pale Peach Petal
    ];

    function resizePetalsCanvas() {
      width = petalsCanvas.width = window.innerWidth;
      height = petalsCanvas.height = window.innerHeight;
    }

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -20;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
        this.sway = Math.random() * 2 + 1;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayAngle = Math.random() * Math.PI * 2;
      }

      update() {
        this.y += this.speedY;
        this.swayAngle += this.swaySpeed;
        this.x += Math.sin(this.swayAngle) * this.sway + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        pCtx.save();
        pCtx.translate(this.x, this.y);
        pCtx.rotate(this.rotation);

        // Draw organic curved petal
        pCtx.beginPath();
        pCtx.moveTo(0, 0);
        pCtx.bezierCurveTo(
          this.size * 0.7, -this.size * 0.6,
          this.size, this.size * 0.8,
          0, this.size * 1.3
        );
        pCtx.bezierCurveTo(
          -this.size, this.size * 0.8,
          -this.size * 0.7, -this.size * 0.6,
          0, 0
        );

        pCtx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        pCtx.fill();
        pCtx.restore();
      }
    }

    function initPetals() {
      resizePetalsCanvas();
      petals = [];
      const count = window.innerWidth < 768 ? 20 : 38;
      for (let i = 0; i < count; i++) {
        petals.push(new Petal());
      }
    }

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    function animatePetals() {
      if (isVisible) {
        pCtx.clearRect(0, 0, width, height);
        for (let i = 0; i < petals.length; i++) {
          petals[i].update();
          petals[i].draw();
        }
      }
      requestAnimationFrame(animatePetals);
    }

    window.addEventListener('resize', resizePetalsCanvas);
    initPetals();
    animatePetals();
  }

  /* ==========================================================================
     2. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll(
    '.reveal-fade, .reveal-scale, .reveal-slide-left, .reveal-slide-right'
  );

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.12
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* ==========================================================================
     3. NAVBAR SCROLL STATE & ACTIVE LINK TRACKING
     ========================================================================== */
  const navbar = document.querySelector('.royal-navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.querySelector('.nav-hamburger');
  const navMenu = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar transparency toggle
    if (navbar) {
      if (scrollPos > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active Section Spy
    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Hamburger Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('nav-open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-open');
      });
    });
  }

  /* ==========================================================================
     4. SUBTLE PARALLAX ON HERO ARCH
     ========================================================================== */
  const heroPortal = document.querySelector('.hero-portal');
  const heroBackdrop = document.querySelector('.hero-backdrop');

  window.addEventListener('scroll', () => {
    const sc = window.scrollY;
    if (sc < window.innerHeight) {
      if (heroPortal) {
        heroPortal.style.transform = `translateY(${sc * 0.1}px)`;
      }
      if (heroBackdrop) {
        heroBackdrop.style.transform = `translateY(${sc * 0.22}px)`;
      }
    }
  });

  /* ==========================================================================
     5. ROYAL MUSIC PLAYER (AUTOPLAY & WEDDING SONG)
     Features "Ishq Bepanah" with smooth browser autoplay handling,
     animated golden equalizer, and graceful synthesizer fallback.
     ========================================================================== */
  const audioEl = document.getElementById('wedding-audio');
  const playerWrap = document.getElementById('music-player-wrap');
  const musicBtn = document.getElementById('music-toggle-btn');
  let isPlaying = false;
  let audioCtx = null;
  let synthInterval = null;

  function setPlayingUI(playing) {
    isPlaying = playing;
    if (playerWrap) {
      if (playing) {
        playerWrap.classList.add('playing');
        playerWrap.setAttribute('title', 'Pause Royal Music: Ishq Bepanah');
      } else {
        playerWrap.classList.remove('playing');
        playerWrap.setAttribute('title', 'Play Royal Music: Ishq Bepanah');
      }
    }
    if (musicBtn) {
      if (playing) {
        musicBtn.classList.add('playing');
        musicBtn.setAttribute('title', 'Pause Royal Music');
      } else {
        musicBtn.classList.remove('playing');
        musicBtn.setAttribute('title', 'Play Royal Music');
      }
    }
  }

  function playAudio() {
    if (audioEl) {
      audioEl.volume = 0.85;
      const promise = audioEl.play();
      if (promise !== undefined) {
        promise.then(() => {
          setPlayingUI(true);
        }).catch((err) => {
          console.warn('Audio element play blocked, falling back to synth:', err);
          startRoyalMelody();
          setPlayingUI(true);
        });
      }
    } else {
      startRoyalMelody();
      setPlayingUI(true);
    }
  }

  function pauseAudio() {
    if (audioEl && !audioEl.paused) {
      audioEl.pause();
    }
    stopRoyalMelody();
    setPlayingUI(false);
  }

  function toggleMusic() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  if (playerWrap) {
    playerWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  } else if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // Autoplay Logic: Attempt immediate play on page visit
  function initAutoplay() {
    if (!audioEl) return;

    audioEl.volume = 0.85;
    const playPromise = audioEl.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        setPlayingUI(true);
      }).catch(() => {
        // Browser Autoplay Policy: Wait for user's very first interaction on the page
        const startOnFirstGesture = () => {
          if (!isPlaying && audioEl) {
            audioEl.play().then(() => {
              setPlayingUI(true);
            }).catch(() => {});
          }
          ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'].forEach((evt) => {
            window.removeEventListener(evt, startOnFirstGesture, { capture: true });
            document.removeEventListener(evt, startOnFirstGesture, { capture: true });
          });
        };

        ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'].forEach((evt) => {
          window.addEventListener(evt, startOnFirstGesture, { capture: true, once: true });
          document.addEventListener(evt, startOnFirstGesture, { capture: true, once: true });
        });
      });
    }
  }

  // Trigger autoplay once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoplay);
  } else {
    initAutoplay();
  }

  // --- Fallback Synthesizer Engine ---
  const ragaScale = [
    261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 523.25
  ];

  const melodyNotes = [
    { note: 0, dur: 1.2 }, { note: 1, dur: 0.8 }, { note: 2, dur: 1.5 },
    { note: 3, dur: 0.8 }, { note: 4, dur: 2.0 }, { note: 3, dur: 0.6 },
    { note: 2, dur: 1.2 }, { note: 1, dur: 1.0 }, { note: 0, dur: 2.5 }
  ];

  function playShehnaiNote(freq, duration) {
    if (!audioCtx || !isPlaying) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, audioCtx.currentTime);
      const now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch (_) {}
  }

  function startRoyalMelody() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    let step = 0;
    function playStep() {
      if (!isPlaying) return;
      const item = melodyNotes[step % melodyNotes.length];
      playShehnaiNote(ragaScale[item.note] || 261.63, item.dur);
      step++;
      synthInterval = setTimeout(playStep, item.dur * 1000);
    }
    playStep();
  }

  function stopRoyalMelody() {
    if (synthInterval) clearTimeout(synthInterval);
    if (audioCtx && audioCtx.state !== 'closed') {
      try { audioCtx.suspend(); } catch (_) {}
    }
  }

  /* ==========================================================================
     6. SMOOTH SCROLL HELPER
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
})();
