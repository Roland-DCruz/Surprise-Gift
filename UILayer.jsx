// components/UILayer.jsx
import React from 'react';
import { RARITY, RARITY_COLORS, RARITY_GLOW, getCollectionStats } from '../systems/GiftSystem';

const RARITY_LABELS = {
  [RARITY.NORMAL]: { label: 'Normal', icon: '🎀' },
  [RARITY.RARE]: { label: 'Rare', icon: '⭐' },
  [RARITY.EPIC]: { label: 'Epic', icon: '💎' },
};

function StatBadge({ label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: `1px solid ${color}44`,
      borderRadius: 12,
      padding: '8px 14px',
      textAlign: 'center',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, color }}>{value}</div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: '#aaa', marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function UILayer({ view, onSpin, onShowcase, onBack, isSpinning, collection }) {
  const stats = getCollectionStats(collection);

  return (
    <>
      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(5,2,20,0.9) 0%, transparent 100%)',
      }}>
        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: 26,
          color: '#ffd700',
          textShadow: '0 0 20px #ffd70088, 0 2px 4px rgba(0,0,0,0.8)',
          letterSpacing: 1,
        }}>
          🎁 Surprise Gift
        </div>

        {/* Collection summary pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.values(RARITY).map(r => (
            <div key={r} style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 12,
              background: `${RARITY_GLOW[r]}22`,
              border: `1px solid ${RARITY_GLOW[r]}55`,
              color: RARITY_COLORS[r],
              borderRadius: 20,
              padding: '4px 10px',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span>{RARITY_LABELS[r].icon}</span>
              <span style={{ fontWeight: 700 }}>{stats.byRarity[r]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        padding: '20px 24px 28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        background: 'linear-gradient(0deg, rgba(5,2,20,0.92) 0%, transparent 100%)',
      }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <StatBadge label="Total" value={stats.total} color="#ffd700" />
          <StatBadge label="Unique" value={stats.unique} color="#88aaff" />
          {Object.values(RARITY).map(r => (
            <StatBadge key={r} label={r} value={stats.byRarity[r]} color={RARITY_COLORS[r]} />
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 14 }}>
          {view === 'wheel' ? (
            <>
              <SpinButton onSpin={onSpin} isSpinning={isSpinning} />
              <NavButton onClick={onShowcase} icon="🗄️" label="SHOWCASE" color="#8866ff" />
            </>
          ) : (
            <NavButton onClick={onBack} icon="🎡" label="SPIN WHEEL" color="#ff6644" />
          )}
        </div>
      </div>

    </>
  );
}

function SpinButton({ onSpin, isSpinning }) {
  return (
    <button
      onClick={onSpin}
      disabled={isSpinning}
      style={{
        fontFamily: "'Lilita One', cursive",
        fontSize: 20,
        letterSpacing: 2,
        padding: '16px 48px',
        borderRadius: 50,
        border: 'none',
        cursor: isSpinning ? 'not-allowed' : 'pointer',
        background: isSpinning
          ? 'linear-gradient(135deg, #444 0%, #333 100%)'
          : 'linear-gradient(135deg, #ff6600 0%, #ffd700 50%, #ff6600 100%)',
        backgroundSize: '200% auto',
        color: isSpinning ? '#888' : '#1a0500',
        boxShadow: isSpinning ? 'none' : '0 4px 30px #ff660088, 0 0 60px #ffd70044',
        transition: 'all 0.3s',
        animation: isSpinning ? 'none' : 'btnPulse 2s ease-in-out infinite',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 4px 30px #ff660088, 0 0 60px #ffd70044; }
          50% { box-shadow: 0 4px 50px #ff6600cc, 0 0 100px #ffd70088; }
        }
        @keyframes btnShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      {isSpinning ? '🎡 SPINNING...' : '🎰 SPIN!'}
    </button>
  );
}

function NavButton({ onClick, icon, label, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Lilita One', cursive",
        fontSize: 15,
        letterSpacing: 1,
        padding: '14px 28px',
        borderRadius: 50,
        border: `2px solid ${color}`,
        cursor: 'pointer',
        background: `${color}22`,
        color: color,
        backdropFilter: 'blur(6px)',
        boxShadow: `0 0 20px ${color}44`,
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}44`;
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `${color}22`;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {icon} {label}
    </button>
  );
}
