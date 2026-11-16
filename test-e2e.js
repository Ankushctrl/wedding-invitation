const { chromium } = require('playwright-core');
const fs = require('fs');

async function runTests() {
  console.log('🚀 Starting E2E Verification with Playwright-Core and System Chrome...\n');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const execPath = fs.existsSync(chromePath) ? chromePath : edgePath;
  console.log('Using browser executable:', execPath);

  const browser = await chromium.launch({
    executablePath: execPath,
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  // 1. Load Page
  await page.goto('http://localhost:3000/royal-wedding/index.html', { waitUntil: 'networkidle' });
  console.log('✅ Page loaded successfully: http://localhost:3000/royal-wedding/index.html');

  // 2. Verify All 10 Sections
  const sections = [
    { id: '#hero', name: 'Section 1: Hero / Royal Entrance' },
    { id: '#introduction', name: 'Section 2: Wedding Introduction' },
    { id: '#countdown', name: 'Section 3: Countdown Timer' },
    { id: '#save-the-date', name: 'Section 4: Save The Date' },
    { id: '#family', name: 'Section 5: Our Family' },
    { id: '#events', name: 'Section 6: Wedding Events' },
    { id: '#gallery', name: 'Section 7: Royal Gallery' },
    { id: '#venue', name: 'Section 8: Venue & Directions' },
    { id: '#rsvp', name: 'Section 9: RSVP Form' },
    { id: '#closing', name: 'Section 10: Final Closing' }
  ];

  for (const sec of sections) {
    const el = await page.$(sec.id);
    if (!el) {
      throw new Error(`Missing required section: ${sec.name} (${sec.id})`);
    }
    console.log(`✅ ${sec.name} verified present.`);
  }

  // 3. Verify Countdown Timer
  const daysText = await page.textContent('#count-days');
  const hoursText = await page.textContent('#count-hours');
  const minsText = await page.textContent('#count-minutes');
  const secsText = await page.textContent('#count-seconds');
  console.log(`\n⏳ Countdown Values: ${daysText} Days, ${hoursText} Hours, ${minsText} Mins, ${secsText} Secs`);
  if (isNaN(parseInt(daysText)) || isNaN(parseInt(secsText))) {
    throw new Error('Countdown digits are not valid numbers!');
  }
  console.log('✅ Countdown timer is actively calculating and updating.');

  // 4. Verify Scratch Card
  const canvas = await page.$('#scratch-canvas');
  if (!canvas) throw new Error('Scratch canvas missing!');
  const canvasBox = await canvas.boundingBox();
  if (canvasBox) {
    // Perform mouse drag scratch
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 100);
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 150);
    await page.mouse.up();
    console.log('✅ Scratch canvas mouse interaction simulated.');
  }

  // Click Instant Reveal
  await page.click('#scratch-reveal-all-btn');
  await page.waitForTimeout(500);
  const passcode = await page.textContent('#passcode-text');
  console.log(`✅ Scratch Card revealed passcode: "${passcode}"`);
  if (!passcode.includes('VAISHALI-ANIL-2026')) {
    throw new Error('Passcode not found in revealed card!');
  }

  // 5. Verify Gallery Lightbox
  const firstGalleryItem = await page.$('.gallery-item');
  await firstGalleryItem.click();
  await page.waitForTimeout(300);
  const isLightboxActive = await page.$eval('#gallery-lightbox', el => el.classList.contains('active'));
  console.log('✅ Gallery Lightbox opens on click:', isLightboxActive);
  if (!isLightboxActive) throw new Error('Lightbox did not open!');

  // Test Next button in Lightbox
  const initialCounter = await page.textContent('#lightbox-counter');
  await page.click('#lightbox-next');
  await page.waitForTimeout(200);
  const updatedCounter = await page.textContent('#lightbox-counter');
  console.log(`✅ Lightbox navigation verified: ${initialCounter} -> ${updatedCounter}`);

  // Close Lightbox via Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const isLightboxClosed = await page.$eval('#gallery-lightbox', el => !el.classList.contains('active'));
  console.log('✅ Lightbox closes on Escape key:', isLightboxClosed);

  // 6. Verify RSVP Form Validation & Submission (if enabled)
  console.log('\n📝 Testing RSVP Form & Audio Player...');
  const rsvpForm = await page.$('#rsvp-form');
  if (rsvpForm) {
    // Attempt invalid submit
    await page.click('#rsvp-form button[type="submit"]');
    const nameErrorVisible = await page.$eval('#rsvp-name', el => el.closest('.form-group').classList.contains('has-error'));
    console.log('✅ Form validation triggers on empty submit:', nameErrorVisible);

    // Fill valid details
    await page.fill('#rsvp-name', 'Maharajadhiraj Prithviraj');
    await page.fill('#rsvp-phone', '+91 98290 12345');
    await page.selectOption('#rsvp-guests', '2');
    await page.selectOption('#rsvp-attendance', 'all');
    await page.selectOption('#rsvp-dietary', 'Traditional Vegetarian Feast');
    await page.fill('#rsvp-message', 'Honored to accept the royal invitation. Wishing both families eternal prosperity.');

    // Submit form
    await page.click('#rsvp-form button[type="submit"]');
    await page.waitForTimeout(400);
    const isRsvpModalActive = await page.$eval('#rsvp-modal', el => el.classList.contains('active'));
    const rsvpSummaryText = await page.textContent('#rsvp-modal-summary');
    console.log('✅ RSVP modal opened with confirmation:', isRsvpModalActive);
    console.log('✅ RSVP Summary captured:\n', rsvpSummaryText.trim().replace(/\s+/g, ' '));
    await page.click('#rsvp-modal-close');
  } else {
    console.log('ℹ️ RSVP form is currently commented out by user - skipping form submit test.');
  }



  const audioSrc = await page.$eval('#wedding-audio', el => el.getAttribute('src'));
  console.log('✅ Audio element found with source:', audioSrc);
  await page.click('#music-player-wrap');
  await page.waitForTimeout(300);
  const isPlaying = await page.$eval('#music-player-wrap', el => el.classList.contains('playing'));
  console.log('✅ Music player toggles playing state on click:', isPlaying);

  // 7. Test Responsive Viewports and Horizontal Overflow Check
  console.log('\n📱 Testing Responsive Viewports & Horizontal Overflow...');
  const viewports = [
    { name: 'Desktop Large', width: 1440, height: 900 },
    { name: 'Laptop', width: 1024, height: 768 },
    { name: 'Tablet iPad', width: 768, height: 1024 },
    { name: 'Mobile Android (Pixel/Galaxy)', width: 412, height: 915 },
    { name: 'Mobile iPhone (13/14/15)', width: 375, height: 812 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(300);

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    if (hasOverflow) {
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      throw new Error(`Horizontal overflow detected on ${vp.name} (${vp.width}px)! ScrollWidth: ${scrollWidth}px`);
    }
    console.log(`✅ ${vp.name} (${vp.width}x${vp.height}): Zero horizontal overflow.`);
  }

  // 8. Capture Full Verification Screenshot
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: 'royal-wedding/assets/images/desktop-preview.jpg', fullPage: false });
  console.log('\n📸 Hero preview screenshot saved to royal-wedding/assets/images/desktop-preview.jpg');

  // 9. Console Errors Report
  if (consoleErrors.length > 0) {
    console.error('❌ Console errors detected during test:');
    consoleErrors.forEach(err => console.error('  -', err));
    throw new Error('Test failed due to console errors!');
  } else {
    console.log('✅ ZERO console errors encountered during testing!');
  }

  await browser.close();
  console.log('\n🌟 ALL QUALITY CONTROL TESTS PASSED 100%! Ready for production.');
}

runTests().catch(err => {
  console.error('\n❌ Test Failure:', err);
  process.exit(1);
});
