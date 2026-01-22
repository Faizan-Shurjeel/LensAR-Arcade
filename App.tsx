import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { UIOverlay } from './components/UIOverlay';
import { ARObject } from './components/ARObject';
import { AppState } from './types';
import { Group } from 'three';

// --- AR Controller Component ---
interface ARControllerProps {
  onMarkerFound: () => void;
  onMarkerLost: () => void;
  gameActive: boolean;
  onCollectCoin: () => void;
}

const ARController = ({ onMarkerFound, onMarkerLost, gameActive, onCollectCoin }: ARControllerProps) => {
  const { gl, camera } = useThree();
  const arSourceRef = useRef<any>(null);
  const arContextRef = useRef<any>(null);
  const markerRootRef = useRef<Group>(null);
  const [arReady, setArReady] = useState(false);

  useEffect(() => {
    // 1. Initialize AR Source (Webcam)
    arSourceRef.current = new window.THREEx.ArToolkitSource({
      sourceType: 'webcam',
      // Fix: Use standard resolution for better compatibility, let CSS handle the scaling/cover
      sourceWidth: 640,
      sourceHeight: 480,
      displayWidth: window.innerWidth,
      displayHeight: window.innerHeight,
    });

    arSourceRef.current.init(() => {
        // Fix: Force video resize to handle different aspect ratios
        setTimeout(() => {
            onResize();
        }, 1000);
    });

    // 2. Initialize AR Context
    arContextRef.current = new window.THREEx.ArToolkitContext({
      cameraParametersUrl: window.THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
      detectionMode: 'mono',
    });

    arContextRef.current.init(() => {
      // Sync Three.js Camera with AR Context projection matrix
      camera.projectionMatrix.copy(arContextRef.current.getProjectionMatrix());
    });

    // 3. Initialize Marker Controls
    // We create a ghost group to track the marker
    const markerControls = new window.THREEx.ArMarkerControls(arContextRef.current, markerRootRef.current, {
      type: 'pattern',
      patternUrl: window.THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro',
      changeMatrixMode: 'modelViewMatrix'
    });

    setArReady(true);

    const onResize = () => {
      arSourceRef.current.onResizeElement();
      arSourceRef.current.copyElementSizeTo(gl.domElement);
      if (arContextRef.current.arController !== null) {
        arSourceRef.current.copyElementSizeTo(arContextRef.current.arController.canvas);
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
        window.removeEventListener('resize', onResize);
    };
  }, [gl, camera]);

  // Game Loop
  useFrame(() => {
    if (!arSourceRef.current || !arContextRef.current || !arReady) return;

    // Update AR.js context
    if (arSourceRef.current.ready === false) return;
    arContextRef.current.update(arSourceRef.current.domElement);

    // Check visibility manually to trigger React state
    if (markerRootRef.current?.visible) {
        onMarkerFound();
    } else {
        onMarkerLost();
    }
  });

  return (
    <group ref={markerRootRef}>
        {/* Render our 3D Object attached to the marker */}
       <ARObject gameActive={gameActive} onCollect={onCollectCoin} />
    </group>
  );
};


export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING_SCRIPTS);
  const [markerFound, setMarkerFound] = useState(false);
  
  // Game State
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);

  // Poll for script load
  useEffect(() => {
    const checkAR = setInterval(() => {
      if (window.THREEx && window.THREE) {
        clearInterval(checkAR);
        setAppState(AppState.READY);
      }
    }, 500);
    return () => clearInterval(checkAR);
  }, []);

  const handleStartGame = () => {
    setGameActive(true);
    setScore(0);
  };

  const handleResetGame = () => {
    setGameActive(false);
    setScore(0);
  };

  const handleCollectCoin = () => {
    setScore(prev => prev + 100);
  };

  if (appState === AppState.LOADING_SCRIPTS) {
      return (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center flex-col gap-4 relative z-50">
              <div className="w-8 h-8 border-4 border-arcade-yellow border-t-transparent rounded-full animate-spin"></div>
              <div className="text-white font-mono text-sm">LOADING AR ENGINE...</div>
          </div>
      );
  }

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="canvas-container">
          <Canvas
            camera={{ position: [0, 0, 0] }}
            gl={{ alpha: true, antialias: true, logarithmicDepthBuffer: true }}
            onCreated={({ gl }) => {
                gl.setPixelRatio(window.devicePixelRatio);
            }}
          >
            {/* Lighting */}
            {/* @ts-ignore */}
            <ambientLight intensity={1} />
            {/* @ts-ignore */}
            <directionalLight position={[5, 10, 5]} intensity={1.5} />
            
            {/* AR Logic */}
            <ARController 
                onMarkerFound={() => setMarkerFound(true)}
                onMarkerLost={() => setMarkerFound(false)}
                gameActive={gameActive}
                onCollectCoin={handleCollectCoin}
            />
          </Canvas>
      </div>

      {/* UI Overlay Layer */}
      <UIOverlay 
        appState={appState} 
        markerFound={markerFound}
        gameActive={gameActive}
        score={score}
        onStartGame={handleStartGame}
        onResetGame={handleResetGame}
      />
    </div>
  );
}