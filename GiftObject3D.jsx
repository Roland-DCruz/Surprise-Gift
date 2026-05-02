// components/GiftObject3D.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RARITY, RARITY_GLOW } from '../systems/GiftSystem';

function GiftMesh({ gift, scale = 1, animate = false, pulse = false }) {
  const meshRef = useRef();
  const glowColor = RARITY_GLOW[gift.rarity];
  const emissiveIntensity = gift.rarity === RARITY.EPIC ? 0.6 : gift.rarity === RARITY.RARE ? 0.4 : 0.2;

  useFrame((state) => {
    if (!meshRef.current) return;
    if (animate) {
      meshRef.current.rotation.y += 0.02;
    }
    if (pulse) {
      const t = state.clock.getElapsedTime();
      meshRef.current.scale.setScalar(scale * (1 + Math.sin(t * 3) * 0.06));
    }
  });

  const material = (
    <meshStandardMaterial
      color={gift.color}
      metalness={gift.rarity === RARITY.EPIC ? 0.8 : gift.rarity === RARITY.RARE ? 0.5 : 0.2}
      roughness={gift.rarity === RARITY.EPIC ? 0.1 : 0.4}
      emissive={glowColor}
      emissiveIntensity={emissiveIntensity}
    />
  );

  return (
    <group>
      <mesh ref={meshRef} scale={scale} castShadow>
        {gift.shape === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
        {gift.shape === 'box' && <boxGeometry args={[0.9, 0.9, 0.9]} />}
        {gift.shape === 'torus' && <torusGeometry args={[0.38, 0.15, 16, 40]} />}
        {gift.shape === 'cone' && <coneGeometry args={[0.45, 0.9, 6]} />}
        {gift.shape === 'cylinder' && <cylinderGeometry args={[0.3, 0.3, 0.9, 16]} />}
        {material}
      </mesh>
      {gift.rarity !== RARITY.NORMAL && (
        <pointLight color={glowColor} intensity={gift.rarity === RARITY.EPIC ? 3 : 1.5} distance={2} />
      )}
    </group>
  );
}

export default GiftMesh;
