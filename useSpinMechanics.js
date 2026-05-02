// hooks/useSpinMechanics.js
import { useState, useRef, useCallback } from 'react';
import { SEGMENT_COUNT, WHEEL_SEGMENTS } from '../systems/GiftSystem';
import { playSpinStart, playTick } from '../systems/SoundSystem';

const TWO_PI = Math.PI * 2;
const SEGMENT_ANGLE = TWO_PI / SEGMENT_COUNT;

// Easing: ease-out cubic
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function useSpinMechanics() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);

  const animRef = useRef(null);
  const rotationRef = useRef(0);
  const lastTickSegment = useRef(-1);

  const spin = useCallback((onComplete) => {
    if (isSpinning) return;

    // Determine random winner segment
    const winSegment = Math.floor(Math.random() * SEGMENT_COUNT);
    
    // Calculate target rotation:
    // Spin at least 5 full rotations + land on win segment
    const minSpins = 5 + Math.random() * 3;
    const currentRot = rotationRef.current;
    
    // Normalize current rotation to find where we are in the wheel
    const currentAngle = ((currentRot % TWO_PI) + TWO_PI) % TWO_PI;
    
    // Target angle for the win segment (center of segment, pointer at top = 0)
    const targetAngle = (winSegment + 0.5) * SEGMENT_ANGLE;
    
    // How much to rotate to reach target from current angle
    let delta = targetAngle - currentAngle;
    if (delta < 0) delta += TWO_PI;
    
    const totalRotation = minSpins * TWO_PI + delta;
    const duration = 4000 + Math.random() * 1500; // 4–5.5 seconds
    
    const startRot = currentRot;
    const startTime = performance.now();

    setIsSpinning(true);
    setWinner(null);
    playSpinStart();

    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOut(t);

      const newRot = startRot + totalRotation * easedT;
      rotationRef.current = newRot;
      setRotation(newRot);

      // Tick sound on segment change
      const currentSeg = Math.floor(((newRot % TWO_PI) + TWO_PI) % TWO_PI / SEGMENT_ANGLE);
      if (currentSeg !== lastTickSegment.current) {
        lastTickSegment.current = currentSeg;
        // Only tick when still moving decently fast
        if (t < 0.85) playTick();
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        rotationRef.current = startRot + totalRotation;
        setRotation(startRot + totalRotation);
        setIsSpinning(false);
        const wonGiftId = WHEEL_SEGMENTS[winSegment];
        setWinner(wonGiftId);
        if (onComplete) onComplete(wonGiftId);
      }
    }

    animRef.current = requestAnimationFrame(animate);
  }, [isSpinning]);

  return { isSpinning, rotation, winner, spin, clearWinner: () => setWinner(null) };
}
