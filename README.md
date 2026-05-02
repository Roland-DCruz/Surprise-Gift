# 🎁 Surprise Gift — Arcade Reward Spin Game

A fully interactive 3D arcade-style gift wheel game built with React + React Three Fiber.

---

## 🚀 Quick Start (Zero Install)

Open `index.html` directly in any modern browser. No server or install needed.

---

## 🛠 Full React Project Setup

### Prerequisites
- Node.js 16+
- npm 7+

### Install & Run
```bash
cd surprise-gift
npm install
npm start
```

Opens at http://localhost:3000

### Build for production
```bash
npm run build
```

---

## 🎮 How to Play

1. **Spin the Wheel** — Click the big orange SPIN button
2. **Watch it spin** — The wheel spins with smooth easing and satisfying tick sounds
3. **See your reward** — A reveal modal shows your gift with rarity-based effects
4. **Browse your collection** — Click SHOWCASE to see all collected gifts on 3D shelves

---

## 🎁 Gift Rarities

| Rarity | Color   | Odds  | Sound Effect |
|--------|---------|-------|--------------|
| Normal | Blue    | ~55%  | 3-note chime |
| Rare   | Green   | ~30%  | 4-note fanfare |
| Epic   | Magenta | ~15%  | 5-note grand fanfare + glow |

---

## 📁 Project Structure

```
surprise-gift/
├── public/
│   └── index.html
├── src/
│   ├── systems/
│   │   ├── GiftSystem.js      # Gift data, rarity, localStorage
│   │   └── SoundSystem.js     # Web Audio API sounds
│   ├── hooks/
│   │   ├── useSpinMechanics.js # Spin animation & easing
│   │   └── useCollection.js    # Collection state management
│   ├── components/
│   │   ├── WheelScene.jsx      # 3D spinning wheel (R3F)
│   │   ├── ShowcaseScene.jsx   # 3D shelf display (R3F)
│   │   ├── GiftObject3D.jsx    # Reusable 3D gift mesh
│   │   ├── RewardReveal.jsx    # Win modal + confetti
│   │   └── UILayer.jsx         # HUD, buttons, stats
│   ├── App.jsx
│   └── index.js
├── index.html                  # Single-file standalone version
├── package.json
└── README.md
```

---

## ✨ Features

- **3D Spinning Wheel** with 18 segments, extruded geometry, gold rim
- **Smooth easing** — cubic ease-out, starts fast, slows naturally
- **Tick sounds** on segment changes (Web Audio API, no files needed)
- **Win animations** — confetti burst, glow pulse, shimmer text for Epic
- **3D Showcase** — wooden shelf display with rotating gifts, count badges
- **Persistent collection** — saved in `localStorage`, survives page refresh
- **Rarity system** — Normal / Rare / Epic with distinct colors and effects

---

## 🎨 Design Aesthetic

Dark cosmic arcade — deep purple/black space background, gold accents,
neon rarity indicators, retro-futuristic typography (Lilita One display font).
