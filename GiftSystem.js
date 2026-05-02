// systems/GiftSystem.js

export const RARITY = {
  NORMAL: 'Normal',
  RARE: 'Rare',
  EPIC: 'Epic',
};

export const RARITY_COLORS = {
  [RARITY.NORMAL]: '#a0c4ff',
  [RARITY.RARE]: '#b9fbc0',
  [RARITY.EPIC]: '#ffadff',
};

export const RARITY_GLOW = {
  [RARITY.NORMAL]: '#4096ff',
  [RARITY.RARE]: '#00e676',
  [RARITY.EPIC]: '#ff00ff',
};

export const GIFTS = [
  { id: 'teddy',      name: 'Teddy Bear',       rarity: RARITY.NORMAL, color: '#c8a97e', shape: 'sphere',   emoji: '🧸' },
  { id: 'balloon',    name: 'Red Balloon',       rarity: RARITY.NORMAL, color: '#ff4444', shape: 'sphere',   emoji: '🎈' },
  { id: 'candy',      name: 'Candy Box',         rarity: RARITY.NORMAL, color: '#ff88cc', shape: 'box',      emoji: '🍬' },
  { id: 'yo_yo',      name: 'Yo-Yo',             rarity: RARITY.NORMAL, color: '#44aaff', shape: 'torus',    emoji: '🪀' },
  { id: 'kite',       name: 'Flying Kite',       rarity: RARITY.NORMAL, color: '#ffcc44', shape: 'cone',     emoji: '🪁' },
  { id: 'puzzle',     name: 'Magic Puzzle',      rarity: RARITY.RARE,   color: '#44ff88', shape: 'box',      emoji: '🧩' },
  { id: 'robot',      name: 'Toy Robot',         rarity: RARITY.RARE,   color: '#88aaff', shape: 'box',      emoji: '🤖' },
  { id: 'telescope',  name: 'Mini Telescope',    rarity: RARITY.RARE,   color: '#ffaa44', shape: 'cylinder', emoji: '🔭' },
  { id: 'crystal',    name: 'Crystal Orb',       rarity: RARITY.EPIC,   color: '#ff44ff', shape: 'sphere',   emoji: '🔮' },
  { id: 'dragon',     name: 'Dragon Figurine',   rarity: RARITY.EPIC,   color: '#ff2244', shape: 'cone',     emoji: '🐉' },
  { id: 'crown',      name: 'Golden Crown',      rarity: RARITY.EPIC,   color: '#ffd700', shape: 'torus',    emoji: '👑' },
  { id: 'rocket',     name: 'Rocket Ship',       rarity: RARITY.RARE,   color: '#cc44ff', shape: 'cone',     emoji: '🚀' },
];

// Wheel segments: each maps to a gift id
// Weighted distribution: Normal 55%, Rare 30%, Epic 15%
export const WHEEL_SEGMENTS = [
  'teddy', 'puzzle', 'teddy', 'crystal', 'balloon', 'robot',
  'candy', 'dragon', 'yo_yo', 'telescope', 'kite', 'crown',
  'teddy', 'rocket', 'candy', 'puzzle', 'balloon', 'crystal',
];

export const SEGMENT_COUNT = WHEEL_SEGMENTS.length;

export function getGiftById(id) {
  return GIFTS.find(g => g.id === id);
}

// Storage
const STORAGE_KEY = 'surprise_gift_collection';

export function loadCollection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCollection(collection) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  } catch (e) {
    console.error('Failed to save collection', e);
  }
}

export function addGiftToCollection(collection, giftId) {
  const existing = collection.find(c => c.id === giftId);
  if (existing) {
    return collection.map(c => c.id === giftId ? { ...c, count: c.count + 1 } : c);
  }
  return [...collection, { id: giftId, count: 1, obtainedAt: Date.now() }];
}

export function getCollectionStats(collection) {
  const total = collection.reduce((s, c) => s + c.count, 0);
  const unique = collection.length;
  const byRarity = { [RARITY.NORMAL]: 0, [RARITY.RARE]: 0, [RARITY.EPIC]: 0 };
  collection.forEach(c => {
    const gift = getGiftById(c.id);
    if (gift) byRarity[gift.rarity] += c.count;
  });
  return { total, unique, byRarity };
}
