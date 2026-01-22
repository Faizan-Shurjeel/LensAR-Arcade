import React, { useState } from 'react';
import { AppState } from '../types';
import { Scan, HelpCircle, X, Trophy, RotateCcw } from 'lucide-react';
import { HIRO_MARKER_IMAGE } from '../constants';

interface UIOverlayProps {
  appState: AppState;
  markerFound: boolean;
  gameActive: boolean;
  score: number;
  onStartGame: () => void;
  onResetGame: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ 
  appState, 
  markerFound, 
  gameActive, 
  score, 
  onStartGame,
  onResetGame
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="pointer-events-auto">
             <div className="bg-arcade-glass backdrop-blur-md rounded-lg px-4 py-2 border border-white/20 shadow-lg transition-all duration-300">
                {gameActive ? (
                   <div className="flex items-center gap-3">
                      <Trophy className="text-arcade-yellow w-6 h-6 animate-bounce-slow" />
                      <div>
                        <div className="text-[10px] text-gray-300 font-mono leading-none">SCORE</div>
                        <div className="text-2xl font-black text-white leading-none font-mono">{score.toString().padStart(4, '0')}</div>
                      </div>
                   </div>
                ) : (
                  <>
                    <h1 className="text-white font-black italic tracking-widest text-xl flex items-center gap-2">
                        <span className="text-arcade-yellow">ARCADE</span>
                        <span className="text-white">AR</span>
                    </h1>
                    <div className="text-[10px] text-gray-300 font-mono">NINTENDO-STYLE DEMO</div>
                  </>
                )}
             </div>
        </div>

        {!gameActive && (
          <button 
              onClick={() => setShowHelp(!showHelp)}
              className="pointer-events-auto bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/20 active:scale-95 transition-transform"
          >
              <HelpCircle className="text-white w-6 h-6" />
          </button>
        )}
        
        {gameActive && (
          <button 
              onClick={onResetGame}
              className="pointer-events-auto bg-red-500/80 p-2 rounded-full backdrop-blur-md border border-white/20 active:scale-95 transition-transform hover:bg-red-600"
          >
              <RotateCcw className="text-white w-6 h-6" />
          </button>
        )}
      </div>

      {/* Help Modal */}
      {showHelp && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8 pointer-events-auto">
              <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full relative">
                  <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
                      <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-white font-bold text-lg mb-2">How to Play</h2>
                  <p className="text-gray-400 text-sm mb-4">Point your camera at a "Hiro" marker to summon the Mystery Block.</p>
                  <div className="bg-white p-4 rounded-lg mb-4 flex justify-center">
                      <img src={HIRO_MARKER_IMAGE} alt="Hiro Marker" className="w-48 h-48" />
                  </div>
                  <p className="text-center text-xs text-gray-500">Scan this image with your camera</p>
              </div>
          </div>
      )}

      {/* Center Reticle */}
      {!markerFound && appState === AppState.READY && !showHelp && !gameActive && (
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-white/30 rounded-xl opacity-50 flex items-center justify-center">
            <span className="text-white/50 font-mono text-xs animate-pulse">SCAN MARKER</span>
         </div>
      )}

      {/* Footer Status */}
      <div className="flex justify-center pointer-events-auto pb-8">
         {appState !== AppState.READY ? (
             <div className="bg-arcade-red text-white px-6 py-2 rounded-full font-bold animate-pulse shadow-lg flex items-center gap-2">
                 <Scan className="w-4 h-4 animate-spin" />
                 INITIALIZING SYSTEM...
             </div>
         ) : gameActive ? (
             <div className="bg-transparent">
                 {/* Empty footer when playing to clear view */}
             </div>
         ) : markerFound ? (
             <button 
                onClick={onStartGame}
                className="bg-arcade-yellow text-black px-8 py-4 rounded-full font-black tracking-wider shadow-lg shadow-yellow-500/20 scale-110 transition-transform hover:scale-115 active:scale-95 flex items-center gap-2"
             >
                 PRESS START!
             </button>
         ) : (
             <div className="bg-arcade-glass backdrop-blur-md text-white px-6 py-3 rounded-full font-bold border border-white/10 shadow-lg">
                 Find the Hiro Marker
             </div>
         )}
      </div>
    </div>
  );
};