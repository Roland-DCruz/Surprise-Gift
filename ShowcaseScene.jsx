// components/ShowcaseScene.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { RARITY_COLORS, RARITY_GLOW, getGiftById } from '../systems/GiftSystem';
import GiftMesh from './GiftObject3D';

const SHELF_WIDTH = 9;
const SHELF_ITEMS_PER_ROW = 5;
const SHELF_Y_POSITIONS = [1.5, -0.8, -3.1];

function Shelf({ y }) {
  return (
    <group position={[0, y, 0]}>
      {/* Shelf board */}
      <mesh receiveShadow position={[0, -0.07, 0]}>
        <boxGeometry args={[SHELF_WIDTH, 0.14, 1.0]} />
        <meshStandardMaterial color="#2a1a0a" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Shelf back wall */}
      <mesh position={[0, 0.6, -0.55]} receiveShadow>
        <boxGeometry args={[SHELF_WIDTH, 1.4, 0.08]} />
        <meshStandardMaterial color="#1a0f08" metalness={0} roughness={1} />
      </mesh>
      {/* Shelf supports */}
      {[-SHELF_WIDTH / 2, 0, SHELF_WIDTH / 2].map((x, i) => (
        <mesh key={i} position={[x, -0.5, 0]} castShadow>
          <boxGeometry args={[0.12, 1.0, 0.9]} />
          <meshStandardMaterial color="#2a1a0a" />
        </mesh>
      ))}
      {/* Shelf edge gold trim */}
      <mesh position={[0, -0.01, 0.5]}>
        <boxGeometry args={[SHELF_WIDTH, 0.06, 0.06]} />
        <meshStandardMaterial color="#aa8800" metalness={0.9} roughness={0.1} emissive="#886600" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function GiftOnShelf({ collectionEntry, position }) {
  const gift = getGiftById(collectionEntry.id);
  if (!gift) return null;
  const glowColor = RARITY_GLOW[gift.rarity];
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group position={position}>
      <group ref={meshRef}>
        <GiftMesh gift={gift} scale={0.7} />
      </group>
      {/* Count badge */}
      {collectionEntry.count > 1 && (
        <group position={[0.4, 0.6, 0.2]}>
          <mesh>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#ff3366" emissive="#ff0033" emissiveIntensity={0.6} />
          </mesh>
          <Text position={[0, 0, 0.23]} fontSize={0.2} color="white" anchorX="center" anchorY="middle" fontWeight="bold">
            {collectionEntry.count > 99 ? '99+' : `×${collectionEntry.count}`}
          </Text>
        </group>
      )}
      {/* Name label */}
      <Text
        position={[0, -0.6, 0.3]}
        fontSize={0.13}
        color={RARITY_COLORS[gift.rarity]}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.2}
      >
        {gift.name}
      </Text>
    </group>
  );
}

function EmptySlot({ position }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} wireframe />
      </mesh>
      <Text position={[0, -0.6, 0.3]} fontSize={0.13} color="#333355" anchorX="center" anchorY="middle">
        ???
      </Text>
    </group>
  );
}

function CabinetFrame() {
  return (
    <group>
      {/* Back panel */}
      <mesh position={[0, -0.5, -0.9]} receiveShadow>
        <boxGeometry args={[SHELF_WIDTH + 0.4, 6.5, 0.12]} />
        <meshStandardMaterial color="#110a04" />
      </mesh>
      {/* Side panels */}
      {[-SHELF_WIDTH / 2 - 0.15, SHELF_WIDTH / 2 + 0.15].map((x, i) => (
        <mesh key={i} position={[x, -0.5, -0.15]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 6.5, 1.8]} />
          <meshStandardMaterial color="#1e0f05" metalness={0.1} roughness={0.9} />
        </mesh>
      ))}
      {/* Top panel */}
      <mesh position={[0, 2.75, -0.15]} castShadow>
        <boxGeometry args={[SHELF_WIDTH + 0.55, 0.25, 1.8]} />
        <meshStandardMaterial color="#1e0f05" />
      </mesh>
      {/* Bottom panel */}
      <mesh position={[0, -3.75, -0.15]} receiveShadow>
        <boxGeometry args={[SHELF_WIDTH + 0.55, 0.25, 1.8]} />
        <meshStandardMaterial color="#1e0f05" />
      </mesh>
      {/* Ambient top light */}
      <rectAreaLight position={[0, 2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} width={8} height={1} intensity={3} color="#ffe4b5" />
      {/* Corner gold accents */}
      {[[-SHELF_WIDTH / 2 - 0.02, 2.75], [SHELF_WIDTH / 2 + 0.02, 2.75],
        [-SHELF_WIDTH / 2 - 0.02, -3.75], [SHELF_WIDTH / 2 + 0.02, -3.75]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.15]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0} emissive="#aa8800" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function SignBoard() {
  return (
    <group position={[0, 3.5, 0]}>
      <mesh>
        <boxGeometry args={[5, 0.8, 0.15]} />
        <meshStandardMaterial color="#3d1a00" metalness={0.2} roughness={0.8} />
      </mesh>
      <Text position={[0, 0, 0.1]} fontSize={0.4} color="#ffd700" anchorX="center" anchorY="middle"
        outlineWidth={0.015} outlineColor="#aa5500">
        🎁 MY COLLECTION
      </Text>
    </group>
  );
}

function Floor() {
  return (
    <mesh receiveShadow position={[0, -4.5, -1]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#080510" roughness={0.9} />
    </mesh>
  );
}

export default function ShowcaseScene({ collection }) {
  // Build a 3-shelf layout; fill slots from collection, rest are empty
  const TOTAL_SLOTS = SHELF_ITEMS_PER_ROW * SHELF_Y_POSITIONS.length;

  // Sort: Epic first, Rare, Normal
  const sorted = useMemo(() => {
    const rarityOrder = { Epic: 0, Rare: 1, Normal: 2 };
    return [...collection].sort((a, b) => {
      const ga = getGiftById(a.id);
      const gb = getGiftById(b.id);
      return (rarityOrder[ga?.rarity] ?? 3) - (rarityOrder[gb?.rarity] ?? 3);
    });
  }, [collection]);

  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => sorted[i] || null);

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 55 }}
      shadows
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <pointLight position={[-6, 2, 3]} color="#4433ff" intensity={1} />
      <pointLight position={[6, 2, 3]} color="#ff3399" intensity={0.8} />

      <CabinetFrame />
      <SignBoard />
      <Floor />

      {SHELF_Y_POSITIONS.map((shelfY, shelfIdx) => (
        <React.Fragment key={shelfIdx}>
          <Shelf y={shelfY} />
          {Array.from({ length: SHELF_ITEMS_PER_ROW }, (_, itemIdx) => {
            const slotIdx = shelfIdx * SHELF_ITEMS_PER_ROW + itemIdx;
            const x = (itemIdx - (SHELF_ITEMS_PER_ROW - 1) / 2) * 1.7;
            const pos = [x, shelfY + 0.5, 0.1];
            const entry = slots[slotIdx];
            return entry
              ? <GiftOnShelf key={slotIdx} collectionEntry={entry} position={pos} />
              : <EmptySlot key={slotIdx} position={pos} />;
          })}
        </React.Fragment>
      ))}

      <OrbitControls
        enableZoom={true}
        minDistance={5}
        maxDistance={18}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
