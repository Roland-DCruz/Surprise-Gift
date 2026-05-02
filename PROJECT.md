# Surprise Gift Game

Surprise Gift Game is an arcade-style reward spinner built with React and Three.js. The player spins a 3D gift wheel, waits for it to slow down, and receives a collectible reward. The app also includes a showcase view for browsing collected gifts.

## Current Experience

- Full-screen cosmic background with a starry 3D wheel scene.
- Decorative planet image in the top-right corner using `assets/planet.png`.
- The planet slowly rotates while the wheel is spinning.
- Big `SPIN!` action button for starting the wheel.
- Reward reveal modal after a successful spin.
- Collection tracking through browser storage.
- Standalone HTML version available in `surprise-gift.html`.

## Main Files

```text
.
|-- App.jsx                 Main React app wrapper and scene layout
|-- WheelScene.jsx          3D wheel scene
|-- ShowcaseScene.jsx       3D collection showcase
|-- GiftObject3D.jsx        Reusable 3D gift object
|-- RewardReveal.jsx        Reward modal and celebration UI
|-- UILayer.jsx             Top bar, stats, and controls
|-- GiftSystem.js           Gift data and reward helpers
|-- SoundSystem.js          Spin and reward sounds
|-- useSpinMechanics.js     Wheel spin state and easing
|-- useCollection.js        Collection state handling
|-- surprise-gift.html      Standalone browser version
|-- assets/
|   `-- planet.png          Decorative planet image
|-- package.json            Project scripts and dependencies
`-- README.md               Original project readme
```

## Run Options

### Standalone Preview

Open `surprise-gift.html` directly in a browser.

This is useful when you want to preview the single-file version without installing dependencies.

### React Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

## Dependencies

- React
- React DOM
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- `react-scripts`

## Notes For Future Changes

- Keep `App.jsx` and `surprise-gift.html` in sync when changing visible app behavior, because both can render the game.
- `assets/planet.png` is referenced by both versions.
- The planet animation is controlled by the same spinning state as the wheel.
- Decorative images should use empty `alt` text and avoid capturing pointer events.
