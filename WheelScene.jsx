// components/WheelScene.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
  SEGMENT_COUNT, WHEEL_SEGMENTS, getGiftById,
  RARITY, RARITY_COLORS, RARITY_GLOW
} from '../systems/GiftSystem';

const TWO_PI = Math.PI * 2;
const SEGMENT_ANGLE = TWO_PI / SEGMENT_COUNT;
const WHEEL_RADIUS = 3.2;
const WHEEL_THICKNESS = 0.45;

const SEGMENT_BASE_COLORS = {
  [RARITY.NORMAL]: ['#1a1a3e', '#1e1e48'],
  [RARITY.RARE]:   ['#0d2a1a', '#0f3020'],
  [RARITY.EPIC]:   ['#2a0a2a', '#300d30'],
};

function WheelSegment({ index, total, gift, rotation }) {
  const angle = (index / total) * TWO_PI;
  const midAngle = angle + SEGMENT_ANGLE / 2;
  const colors = SEGMENT_BASE_COLORS[gift.rarity];
  const baseColor = index % 2 === 0 ? colors[0] : colors[1];
  const accentColor = RARITY_COLORS[gift.rarity];

  // Build segment shape
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const innerR = 0.5;
    const outerR = WHEEL_RADIUS;
    const halfA = SEGMENT_ANGLE / 2 - 0.02;

    s.moveTo(Math.cos(-halfA) * innerR, Math.sin(-halfA) * innerR);
    s.lineTo(Math.cos(-halfA) * outerR, Math.sin(-halfA) * outerR);
    
    const arcPoints = 12;
    for (let i = 0; i <= arcPoints; i++) {
      const a = -halfA + (i / arcPoints) * SEGMENT_ANGLE - 0.02;
      s.lineTo(Math.cos(a) * outerR, Math.sin(a) * outerR);
    }
    
    s.lineTo(Math.cos(halfA) * innerR, Math.sin(halfA) * innerR);
    
    for (let i = arcPoints; i >= 0; i--) {
      const a = -halfA + (i / arcPoints) * (SEGMENT_ANGLE - 0.04);
      s.lineTo(Math.cos(a) * innerR, Math.sin(a) * innerR);
    }

    return s;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: WHEEL_THICKNESS,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
  }), []);

  const textPos = [
    Math.cos(midAngle) * (WHEEL_RADIUS * 0.62),
    Math.sin(midAngle) * (WHEEL_RADIUS * 0.62),
    WHEEL_THICKNESS + 0.05
  ];

  return (
    <group rotation={[0, 0, angle]}>
      <mesh castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={baseColor}
          metalness={0.3}
          roughness={0.5}
          emissive={baseColor}
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Accent edge strip */}
      <mesh position={[Math.cos(SEGMENT_ANGLE / 2) * (WHEEL_RADIUS - 0.15), Math.sin(SEGMENT_ANGLE / 2) * (WHEEL_RADIUS - 0.15), WHEEL_THICKNESS / 2]}>
        <boxGeometry args={[0.08, 0.08, WHEEL_THICKNESS + 0.1]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
      </mesh>
      {/* Gift emoji text */}
      <Text
        position={textPos}
        rotation={[0, 0, midAngle - angle + Math.PI / 2]}
        fontSize={0.38}
        anchorX="center"
        anchorY="middle"
      >
        {gift.emoji}
      </Text>
      {/* Gift name */}
      <Text
        position={[
          Math.cos(midAngle) * (WHEEL_RADIUS * 0.68),
          Math.sin(midAngle) * (WHEEL_RADIUS * 0.68),
          WHEEL_THICKNESS + 0.05
        ]}
        rotation={[0, 0, midAngle - angle + Math.PI / 2]}
        fontSize={0.155}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.0}
      >
        {gift.name}
      </Text>
    </group>
  );
}

function Wheel({ rotation }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = rotation;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Hub center */}
      <mesh position={[0, 0, WHEEL_THICKNESS / 2]}>
        <cylinderGeometry args={[0.5, 0.5, WHEEL_THICKNESS + 0.1, 32]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} emissive="#cc9900" emissiveIntensity={0.3} />
      </mesh>
      {/* Hub star */}
      <mesh position={[0, 0, WHEEL_THICKNESS + 0.05]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 6]} />
        <meshStandardMaterial color="#ffee44" metalness={1} roughness={0} emissive="#ffcc00" emissiveIntensity={0.5} />
      </mesh>
      {/* Outer ring */}
      <mesh position={[0, 0, WHEEL_THICKNESS / 2]}>
        <torusGeometry args={[WHEEL_RADIUS, 0.1, 12, 80]} />
        <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.05} emissive="#aa7700" emissiveIntensity={0.2} />
      </mesh>
      {/* Segments */}
      {WHEEL_SEGMENTS.map((giftId, i) => (
        <WheelSegment
          key={i}
          index={i}
          total={SEGMENT_COUNT}
          gift={getGiftById(giftId)}
          rotation={rotation}
        />
      ))}
    </group>
  );
}

function Pointer() {
  return (
    <group position={[0, WHEEL_RADIUS + 0.55, WHEEL_THICKNESS + 0.2]}>
      {/* Arrow body */}
      <mesh rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.25, 0.7, 3]} />
        <meshStandardMaterial color="#ff3333" metalness={0.6} roughness={0.2} emissive="#ff0000" emissiveIntensity={0.4} />
      </mesh>
      {/* Arrow stem */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#cc1111" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Glow bulb */}
      <pointLight color="#ff4444" intensity={2} distance={2} />
    </group>
  );
}

function Pedestal() {
  return (
    <group position={[0, -4.2, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 2.0, 0.5, 32]} />
        <meshStandardMaterial color="#1a1235" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.5, 0.5, 32]} />
        <meshStandardMaterial color="#120d28" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Stars() {
  const points = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 200; i++) {
      arr.push(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        -15 - Math.random() * 20
      );
    }
    return new Float32Array(arr);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.7} />
    </points>
  );
}

export default function WheelScene({ rotation }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 55 }}
      shadows
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-5, 5, 5]} color="#6644ff" intensity={1.5} />
      <pointLight position={[5, -3, 3]} color="#ff4488" intensity={0.8} />
      <Stars />
      <Wheel rotation={rotation} />
      <Pointer />
      <Pedestal />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-0.4}
        maxAzimuthAngle={0.4}
      />
    </Canvas>
  );
}
