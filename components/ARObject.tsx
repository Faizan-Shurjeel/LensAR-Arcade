import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Vector3, Euler } from 'three';

interface ARObjectProps {
  gameActive: boolean;
  onCollect: () => void;
}

export const ARObject: React.FC<ARObjectProps> = ({ gameActive, onCollect }) => {
  const boxRef = useRef<Mesh>(null);
  const coinRef = useRef<Group>(null);
  
  // Local interaction state
  const [bumping, setBumping] = useState(false);
  const [coinVisible, setCoinVisible] = useState(false);

  // Animation constants
  const bumpHeight = 0.5;
  const hoverHeight = 0.5;

  // Reset local state when game stops
  useEffect(() => {
    if (!gameActive) {
      setCoinVisible(false);
      setBumping(false);
    } else {
      // Auto bump once on start
      setBumping(true);
      setTimeout(() => setBumping(false), 300);
      setCoinVisible(true);
    }
  }, [gameActive]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // BOX ANIMATION
    if (boxRef.current) {
      // Idle Rotation
      boxRef.current.rotation.y += delta * 0.5;
      
      // Bump Logic
      if (bumping) {
         boxRef.current.position.y = hoverHeight + bumpHeight;
      } else {
         // Smooth return to hover
         boxRef.current.position.y = hoverHeight + Math.sin(time * 2) * 0.05;
      }
    }

    // COIN ANIMATION
    if (coinRef.current && coinVisible) {
      // Spin fast
      coinRef.current.rotation.y += delta * 3;
      // Float up and down separate from box
      coinRef.current.position.y = 1.5 + Math.sin(time * 4) * 0.2;
    }
  });

  const handleBoxClick = (e: any) => {
    e.stopPropagation();
    if (!gameActive) return;

    setBumping(true);
    setTimeout(() => setBumping(false), 200);
    
    // Trigger collection
    if (coinVisible) {
      onCollect(); // Add score
      // Visual feedback could go here (particles)
    }
  };

  return (
    <group>
        {/* THE COIN (Only visible when game active) */}
        <group ref={coinRef} visible={coinVisible}>
            {/* @ts-ignore */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                {/* @ts-ignore */}
                <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
                {/* @ts-ignore */}
                <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} emissive="#fbbf24" emissiveIntensity={0.5} />
            </mesh>
            {/* Inner detail */}
             {/* @ts-ignore */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.06]}>
                 {/* @ts-ignore */}
                <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
                 {/* @ts-ignore */}
                <meshStandardMaterial color="#f59e0b" />
            </mesh>
        </group>

        {/* THE BLOCK */}
        {/* @ts-ignore */}
        <mesh
          ref={boxRef}
          onClick={handleBoxClick}
          scale={gameActive ? 0.8 : 1} // Shrink slightly when "used"
        >
          {/* @ts-ignore */}
          <boxGeometry args={[1, 1, 1]} />
          {/* @ts-ignore */}
          <meshStandardMaterial 
            color={gameActive ? "#cd7f32" : "#fbbf24"} // Turn bronze/brown when active
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>

        {/* Shadow Plane */}
        {/* @ts-ignore */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
             {/* @ts-ignore */}
             <circleGeometry args={[0.8, 32]} />
             {/* @ts-ignore */}
             <meshBasicMaterial color="black" transparent opacity={0.3} />
        </mesh>
    </group>
  );
};