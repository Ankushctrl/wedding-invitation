const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000/royal-wedding/';

function checkUrl(urlPath) {
  return new Promise((resolve) => {
    const fullUrl = new URL(urlPath, BASE_URL).href;
    http.get(fullUrl, (res) => {
      resolve({ url: urlPath, status: res.statusCode, ok: res.statusCode === 200 });
    }).on('error', (err) => {
      resolve({ url: urlPath, status: err.message, ok: false });
    });
  });
}

async function run() {
  const htmlContent = fs.readFileSync(path.join(__dirname, 'royal-wedding', 'index.html'), 'utf8');

  // Regex extract links, scripts, img src
  const urls = new Set();

  const srcMatches = htmlContent.matchAll(/src=["']([^"']+)["']/g);
  for (const match of srcMatches) {
    if (!match[1].startsWith('http') && !match[1].startsWith('//')) {
      urls.add(match[1]);
    }
  }

  const hrefMatches = htmlContent.matchAll(/href=["']([^"']+)["']/g);
  for (const match of hrefMatches) {
    if (!match[1].startsWith('#') && !match[1].startsWith('http') && !match[1].startsWith('//')) {
      urls.add(match[1]);
    }
  }

  // Also check css background images from style.css
  const cssContent = fs.readFileSync(path.join(__dirname, 'royal-wedding', 'css', 'style.css'), 'utf8');
  const cssBgMatches = cssContent.matchAll(/url\(['"]?\.\.\/([^'")]+)['"]?\)/g);
  for (const match of cssBgMatches) {
    urls.add(match[1]);
  }

  console.log(`Checking ${urls.size} distinct assets...`);
  let hasFailures = false;

  for (const u of urls) {
    const result = await checkUrl(u);
    if (!result.ok) {
      console.error(`❌ FAILED: ${result.url} - Status: ${result.status}`);
      hasFailures = true;
    } else {
      console.log(`✅ OK (200): ${result.url}`);
    }
  }

  if (!hasFailures) {
    console.log('\n🎉 ALL ASSETS LOADED WITH HTTP 200 OK! Zero broken links or missing files.');
  } else {
    process.exit(1);
  }
}

run();
