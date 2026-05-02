// components/RewardReveal.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { RARITY, RARITY_COLORS, RARITY_GLOW, getGiftById } from '../systems/GiftSystem';
import GiftMesh from './GiftObject3D';
import { playWinNormal, playWinRare, playWinEpic } from '../systems/SoundSystem';

function ConfettiPiece({ x, color, delay }) {
  const style = {
    position: 'absolute',
    left: `${x}%`,
    top: '-20px',
    width: '10px',
    height: '10px',
    backgroundColor: color,
    borderRadius: Math.random() > 0.5 ? '50%' : '0',
    animationName: 'confettiFall',
    animationDuration: `${1.2 + Math.random() * 1}s`,
    animationDelay: `${delay}s`,
    animationTimingFunction: 'linear',
    animationFillMode: 'forwards',
    transform: `rotate(${Math.random() * 360}deg)`,
  };
  return <div style={style} />;
}

const CONFETTI_COLORS = ['#ff3366', '#ffd700', '#00ff88', '#4488ff', '#ff88ff', '#ffaa00'];

function Confetti({ rarity }) {
  const count = rarity === RARITY.EPIC ? 60 : rarity === RARITY.RARE ? 40 : 20;
  const pieces = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 0.5,
  }));

  return (
    <>
      {pieces.map((p, i) => <ConfettiPiece key={i} {...p} />)}
    </>
  );
}

function GiftPreview({ gift }) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }} style={{ width: 180, height: 180, background: 'transparent' }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 2, 2]} intensity={2} color={RARITY_GLOW[gift.rarity]} />
      <GiftMesh gift={gift} scale={1.4} animate pulse />
    </Canvas>
  );
}

export default function RewardReveal({ giftId, onClose }) {
  const gift = getGiftById(giftId);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!gift) return;
    const t = setTimeout(() => setVisible(true), 50);
    // Play win sound
    if (gift.rarity === RARITY.EPIC) playWinEpic();
    else if (gift.rarity === RARITY.RARE) playWinRare();
    else playWinNormal();
    return () => clearTimeout(t);
  }, [gift]);

  if (!gift) return null;

  const rarityColor = RARITY_COLORS[gift.rarity];
  const glowColor = RARITY_GLOW[gift.rarity];
  const isEpic = gift.rarity === RARITY.EPIC;
  const isRare = gift.rarity === RARITY.RARE;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes revealCard {
          0% { opacity: 0; transform: scale(0.3) translateY(60px); }
          70% { transform: scale(1.08) translateY(-8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes epicPulse {
          0%, 100% { box-shadow: 0 0 30px ${glowColor}, 0 0 60px ${glowColor}, 0 0 100px ${glowColor}; }
          50% { box-shadow: 0 0 60px ${glowColor}, 0 0 120px ${glowColor}, 0 0 200px ${glowColor}; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <Confetti rarity={gift.rarity} />

      <div style={{
        animation: 'revealCard 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        background: 'linear-gradient(135deg, #0d0d1f 0%, #1a1040 100%)',
        border: `2px solid ${rarityColor}`,
        borderRadius: '24px',
        padding: '40px 48px',
        textAlign: 'center',
        maxWidth: 380,
        width: '90%',
        position: 'relative',
        animation: `revealCard 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards${isEpic ? ', epicPulse 2s ease-in-out 0.6s infinite' : ''}`,
      }}>
        {/* Rarity badge */}
        <div style={{
          position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
          background: glowColor,
          color: '#000',
          fontFamily: "'Lilita One', cursive",
          fontSize: 14,
          padding: '4px 20px',
          borderRadius: 20,
          letterSpacing: 2,
          textTransform: 'uppercase',
          boxShadow: `0 0 20px ${glowColor}`,
        }}>
          {isEpic ? '✨ EPIC ✨' : isRare ? '⭐ RARE ⭐' : 'NORMAL'}
        </div>

        <div style={{ marginBottom: 8 }}>
          <GiftPreview gift={gift} />
        </div>

        <div style={{ fontSize: 48, marginBottom: 4 }}>{gift.emoji}</div>

        <h2 style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: 28,
          color: '#fff',
          margin: '0 0 8px',
          textShadow: `0 0 20px ${glowColor}`,
          ...(isEpic ? {
            background: `linear-gradient(90deg, ${glowColor}, #fff, ${glowColor})`,
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 2s linear infinite',
          } : {}),
        }}>
          {gift.name}
        </h2>

        <p style={{
          fontFamily: "'Nunito', sans-serif",
          color: rarityColor,
          fontSize: 14,
          marginBottom: 28,
          opacity: 0.9,
        }}>
          {isEpic ? '🔥 Legendary find! Added to your collection!' :
           isRare ? '✨ What a rare gem! Nicely done!' :
           '🎁 A lovely gift added to your shelf!'}
        </p>

        <button
          onClick={onClose}
          style={{
            fontFamily: "'Lilita One', cursive",
            fontSize: 18,
            background: `linear-gradient(135deg, ${glowColor}, ${rarityColor})`,
            color: '#000',
            border: 'none',
            padding: '12px 40px',
            borderRadius: 50,
            cursor: 'pointer',
            letterSpacing: 1,
            boxShadow: `0 4px 20px ${glowColor}88`,
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
        >
          SWEET! 🎉
        </button>
      </div>
    </div>
  );
}
