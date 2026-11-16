# 👑 Royal Indian Wedding Invitation | Vaishali & Anil

A royal, animated, and interactive Indian Wedding Invitation web application designed for celebrating the sacred union of **Vaishali & Anil**.

---

## ✨ Features

- **Royal Entrance & Floating Petals**: Animated floral petals falling gently across the screen with traditional royal aesthetic.
- **Background Music Player**: Royal shehnai and Bollywood wedding music player with play/pause controls.
- **Auspicious Muhurat Countdown**: Real-time interactive countdown timer to the wedding ceremonies.
- **Sacred Ceremonies & Events Timeline**: Detailed schedule for Satsang, Haldi, Mehndi, Sangeet, Preetibhoj, Wedding (Pheras), and Reception.
- **Family Introduction**: Royal cards showcasing the families of the Bride and Groom.
- **Photo Moments & Gallery**: Interactive gallery capturing moments and rituals.
- **Interactive Scratch Card / Gift Reveal**: Engaging digital experience for guests.
- **Venue & Google Maps Integration**: Location details, directions, and direct map link for Sainik Resort, Jatwal, Samba.
- **RSVP Form**: Interactive guest confirmation form with celebration wishes.

---

## 🚀 Getting Started

### 1. View Directly
You can open `index.html` or `royal-wedding/index.html` in any modern web browser.

### 2. Run Local Server
If Node.js is installed:
```bash
node serve.js
```
Then visit: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```text
├── index.html                 # Root redirect entrypoint
├── serve.js                   # Node.js local HTTP server
├── test-assets.js             # Automated asset integrity test
├── test-e2e.js                # Playwright E2E verification test
└── royal-wedding/
    ├── index.html             # Main wedding invitation page
    ├── css/
    │   ├── style.css          # Main styling & themes
    │   ├── animations.css     # CSS animations (petals, transitions)
    │   └── responsive.css     # Mobile & tablet responsiveness
    ├── js/
    │   ├── main.js            # Main application logic & audio player
    │   ├── countdown.js       # Wedding muhurat countdown timer
    │   ├── gallery.js         # Royal photo gallery interactions
    │   ├── rsvp.js            # RSVP form handler
    │   └── scratch-card.js    # Interactive scratch card
    └── assets/
        ├── audio/             # Traditional wedding songs & music
        ├── backgrounds/       # Jaali and gold dust SVG patterns
        ├── decorations/       # Royal crest, Ganesha, motifs & arches
        └── images/            # Event, couple, and family photographs
```

---

## 🧪 Testing

To verify assets and conduct end-to-end testing:
```bash
node test-assets.js
node test-e2e.js
```
