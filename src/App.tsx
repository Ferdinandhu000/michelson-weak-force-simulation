import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';

// Constants for simulation
const K_SPRING = 0.485; 

const InterferencePattern = ({ displacement }: { displacement: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const { width, height } = canvas;
      const centerX = width / 2;
      const centerY = height / 2;
      
      const pathDifference = 2 * displacement;
      // Real He-Ne wavelength for accurate cycle count
      const lambda = 632.8e-9; 

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // Adjusted radial factor for clear concentric rings at nano-scale
      const radialFactor = 4e-10; 

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const rSq = dx * dx + dy * dy;
          
          const phase = (2 * Math.PI / lambda) * (pathDifference + rSq * radialFactor);
          const intensity = (1 + Math.cos(phase)) / 2;
          
          const index = (y * width + x) * 4;
          const color = Math.floor(intensity * 255);
          
          data[index] = color;     
          data[index + 1] = 0;     
          data[index + 2] = 0;     
          data[index + 3] = 255;   
        }
      }
      ctx.putImageData(imageData, 0, 0);
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [displacement]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative aspect-square w-full max-w-[280px] rounded-full overflow-hidden border border-slate-200 bg-black shadow-inner">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={300} 
          className="w-full h-full"
        />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-px bg-white/10" />
          <div className="h-full w-px bg-white/10 absolute left-1/2" />
        </div>
      </div>
    </div>
  );
};

const MichelsonDiagram = ({ displacement, isActive }: { displacement: number; isActive: boolean }) => {
  const centerX = 240;
  const centerY = 200;
  const laserX = 60;
  const laserY = centerY;
  const m1X = centerX;
  const m1Y = 60;
  const screenX = centerX;
  const screenY = 340;
  const m2X_base = 420;
  const m2Y = centerY;

  const mirrorShift = displacement * 5e7; 

  const movingPlateX = m2X_base + 45 + mirrorShift;
  const fixedWallX = 565;
  const springY = m2Y - 40;
  
  const springWidth = fixedWallX - movingPlateX;
  const coilCount = 5;
  const coilWidth = springWidth / coilCount;
  
  let springPath = `M ${movingPlateX} ${springY}`;
  for (let i = 0; i < coilCount; i++) {
    const x1 = movingPlateX + (i * coilWidth) + (coilWidth * 0.25);
    const x2 = movingPlateX + (i * coilWidth) + (coilWidth * 0.75);
    const x3 = movingPlateX + (i + 1) * coilWidth;
    springPath += ` L ${x1} ${springY - 5} L ${x2} ${springY + 5} L ${x3} ${springY}`;
  }

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full select-none bg-white">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
        </marker>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f8fafc" strokeWidth="1" />
        </pattern>
        
        {/* Beam A: Reflects at BS */}
        <path id="pathA" d={`M ${laserX} ${laserY} L ${centerX} ${centerY} L ${m1X} ${m1Y} L ${centerX} ${centerY} L ${screenX} ${screenY}`} />
        {/* Beam B: Transmits through BS */}
        <motion.path 
          id="pathB" 
          animate={{ d: `M ${laserX} ${laserY} L ${centerX} ${centerY} L ${m2X_base + mirrorShift} ${m2Y} L ${centerX} ${centerY} L ${screenX} ${screenY}` }}
        />
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Beam Splitter (Diagonal) */}
      <line x1={centerX - 25} y1={centerY + 25} x2={centerX + 25} y2={centerY - 25} className="stroke-slate-900" strokeWidth="2" />
      
      {/* Mirror M1 (Fixed Top) */}
      <rect x={m1X - 25} y={m1Y - 10} width={50} height={6} className="fill-slate-800" />
      <text x={m1X - 10} y={m1Y - 20} className="fill-slate-400 text-[12px] font-serif italic">M₁</text>

      {/* Experimental Data Overlay */}
      <g className="font-mono" transform="translate(420, 280)">
        <rect width="160" height="75" rx="10" className="fill-slate-50/90 backdrop-blur-sm stroke-slate-200" strokeWidth="1.5" />
        <text x="12" y="22" className="fill-slate-500 text-[10px] uppercase font-bold tracking-widest">Live Metrics</text>
        <text x="12" y="44" className="fill-slate-700 text-[12px]">Δx: <tspan className="fill-blue-600 font-bold">{(displacement * 1e9).toFixed(1)} nm</tspan></text>
        <text x="12" y="62" className="fill-slate-700 text-[12px]">OPD: <tspan className="fill-red-600 font-bold">{(displacement * 2 * 1e9).toFixed(1)} nm</tspan></text>
      </g>

      {/* Movable Mechanism for M2 */}
      <motion.g animate={{ x: mirrorShift }}>
        <rect x={m2X_base} y={m2Y - 25} width={6} height={50} className="fill-slate-800" />
        <text x={m2X_base - 5} y={m2Y + 45} className="fill-slate-400 text-[12px] font-serif italic">M₂</text>
        <path d={`M ${m2X_base + 6} ${m2Y} H ${m2X_base + 25} V ${m2Y - 40} H ${m2X_base + 45}`} stroke="#334155" fill="none" strokeWidth="2.5" />
        <line x1={m2X_base + 45} y1={m2Y - 60} x2={m2X_base + 45} y2={m2Y - 20} stroke="#334155" strokeWidth="3" />
        {isActive && (
           <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
             <path d={`M ${m2X_base + 15} ${m2Y - 75} H ${m2X_base + 45}`} stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" />
             <text x={m2X_base + 20} y={m2Y - 85} className="fill-red-500 text-[14px] font-serif font-bold italic">F</text>
           </motion.g>
        )}
      </motion.g>

      <path d={springPath} stroke="#64748b" fill="none" strokeWidth="1.5" />
      <line x1={fixedWallX} y1={m2Y - 60} x2={fixedWallX} y2={m2Y - 20} stroke="#94a3b8" strokeWidth="4" />
      <line x1={fixedWallX + 4} y1={m2Y - 65} x2={fixedWallX + 4} y2={m2Y - 15} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />

      {/* Light Beams and Photons */}
      <g strokeWidth="1.2" opacity="0.8">
        {/* Arm 1 (Blue Path: Reflected up) */}
        <circle r="2.5" fill="#3b82f6">
          <animateMotion dur="2.5s" repeatCount="indefinite">
            <mpath xlinkHref="#pathA" />
          </animateMotion>
        </circle>
        
        {/* Arm 2 (Green Path: Transmitted through) */}
        <circle r="2.5" fill="#10b981">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath xlinkHref="#pathB" />
          </animateMotion>
        </circle>

        {/* Static guidelines */}
        <line x1={laserX} y1={laserY} x2={centerX} y2={centerY} stroke="#ef4444" opacity="0.2" />
        <line x1={centerX} y1={centerY} x2={m1X} y2={m1Y} stroke="#3b82f6" opacity="0.2" />
        <motion.line animate={{ x2: m2X_base + mirrorShift }} x1={centerX} y1={centerY} x2={m2X_base} y2={m2Y} stroke="#10b981" opacity="0.2" />
        <line x1={centerX} y1={centerY} x2={screenX} y2={screenY} stroke="#a855f7" opacity="0.2" strokeDasharray="3 3" />
      </g>

      <rect x={screenX - 25} y={screenY} width={50} height={6} className="fill-slate-800" />
      <text x={screenX - 15} y={screenY + 25} className="fill-slate-400 text-[12px] font-serif italic">Screen</text>
      <rect x={laserX - 45} y={laserY - 15} width={45} height={30} className="fill-slate-100 stroke-slate-300" />
      <text x={laserX - 40} y={laserY - 20} className="fill-slate-400 text-[12px] font-serif italic uppercase tracking-tighter">S</text>
    </svg>
  );
};

export default function App() {
  const [isActive, setIsActive] = useState(false);
  const [displacement, setDisplacement] = useState(0);

  // Real parameters for He-Ne Laser
  const REAL_LAMBDA = 632.8e-9; 
  const forceDisplacement = 1.582e-6; // Exactly 5.0 cycles (2*dL / lambda = 2*1.582e-6 / 632.8e-9 = 5)

  useEffect(() => {
    let interval: number;
    const step = 0.00000002; // Adjusted step for 5 cycles motion speed
    
    if (isActive) {
      interval = window.setInterval(() => {
        setDisplacement(prev => (prev < forceDisplacement ? prev + step : forceDisplacement));
      }, 16);
    } else {
      interval = window.setInterval(() => {
        setDisplacement(prev => (prev > 0 ? prev - step : 0));
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const cycleCount = (2 * displacement) / REAL_LAMBDA;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 flex flex-col items-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Schematic */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden h-full min-h-[450px] flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Interferometer Schematic</h2>
            <div className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border ${isActive ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              {isActive ? '• ACQUIRING DATA' : 'SYSTEM STANDBY'}
            </div>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <MichelsonDiagram displacement={displacement} isActive={isActive} />
          </div>
        </div>

        {/* Right Column: Patterns and Controls */}
        <div className="space-y-6">
          {/* Observation Screen */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 font-mono">Real-time Fringe Pattern</h2>
            <InterferencePattern displacement={displacement} />
            <div className="mt-6 w-full flex justify-between items-end border-t border-slate-100 pt-4">
               <div className="flex flex-col">
                 <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Shift cycles</span>
                 <span className="text-2xl font-mono font-bold text-red-600 italic">N = {cycleCount.toFixed(3)}</span>
               </div>
               <div className="text-[10px] text-slate-300 font-mono italic">λ = 632.8nm</div>
            </div>
          </div>

          {/* Stats and Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
             <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-3">
                 <span className="text-slate-500 font-medium">Stiffness (k)</span>
                 <span className="font-mono font-bold bg-slate-50 px-2 py-0.5 rounded text-slate-700">{K_SPRING} N/m</span>
               </div>
               <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-3">
                 <span className="text-slate-500 font-medium whitespace-nowrap">Displacement (Δx)</span>
                 <span className="font-mono font-bold text-blue-600">{(displacement * 1e9).toFixed(1)} nm</span>
               </div>
               <div className="flex flex-col gap-1 pt-2">
                 <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Measured Force</span>
                 <div className="flex items-baseline gap-1">
                   <span className="text-3xl font-bold text-slate-900">{(displacement * K_SPRING * 1e6).toFixed(3)}</span>
                   <span className="text-xs font-bold text-slate-400">µN</span>
                 </div>
               </div>
             </div>

             <button 
                onClick={() => setIsActive(!isActive)}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                  isActive 
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100' 
                  : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200'
                }`}
              >
                {isActive ? <RotateCcw size={18} /> : <Play size={18} />}
                <span className="tracking-widest uppercase text-xs">{isActive ? 'Release Pressure' : 'Apply Weak Force'}</span>
              </button>
          </div>
        </div>

      </div>

      <footer className="mt-12 text-[9px] text-slate-300 uppercase tracking-[0.4em] font-bold">
        Michelson Weak-Force Detection Simulation
      </footer>
    </div>
  );
}
