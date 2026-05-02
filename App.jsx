// App.jsx
import React, { useState, useCallback } from 'react';
import WheelScene from './components/WheelScene';
import ShowcaseScene from './components/ShowcaseScene';
import RewardReveal from './components/RewardReveal';
import UILayer from './components/UILayer';
import { useSpinMechanics } from './hooks/useSpinMechanics';
import { useCollection } from './hooks/useCollection';
import planetImage from './assets/planet.png';

export default function App() {
  const [view, setView] = useState('wheel'); // 'wheel' | 'showcase'
  const [pendingGift, setPendingGift] = useState(null);
  const { collection, addGift } = useCollection();
  const { isSpinning, rotation, winner, spin, clearWinner } = useSpinMechanics();

  const handleSpin = useCallback(() => {
    spin((wonGiftId) => {
      // Small delay before showing reveal
      setTimeout(() => {
        addGift(wonGiftId);
        setPendingGift(wonGiftId);
      }, 400);
    });
  }, [spin, addGift]);

  const handleCloseReveal = useCallback(() => {
    setPendingGift(null);
    clearWinner();
  }, [clearWinner]);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'radial-gradient(ellipse at 30% 20%, #0d0826 0%, #050210 60%, #000 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, #3322aa22 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'floatOrb 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '10%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, #aa224422 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'floatOrb 6s ease-in-out infinite reverse',
      }} />
      <img
        src={planetImage}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 'clamp(56px, 8vh, 72px)',
          right: 'clamp(16px, 3vw, 32px)',
          width: 'clamp(56px, 9vw, 120px)',
          height: 'auto',
          pointerEvents: 'none',
          zIndex: 2,
          animation: isSpinning ? 'planetSpin 5s linear infinite' : 'none',
        }}
      />

      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        @keyframes planetSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow: hidden; }
      `}</style>

      {/* 3D Scene */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {view === 'wheel' && <WheelScene rotation={rotation} />}
        {view === 'showcase' && <ShowcaseScene collection={collection} />}
      </div>

      {/* UI Overlay */}
      <UILayer
        view={view}
        onSpin={handleSpin}
        onShowcase={() => setView('showcase')}
        onBack={() => setView('wheel')}
        isSpinning={isSpinning}
        collection={collection}
      />

      {/* Reward reveal modal */}
      {pendingGift && (
        <RewardReveal
          giftId={pendingGift}
          onClose={handleCloseReveal}
        />
      )}
    </div>
  );
}
