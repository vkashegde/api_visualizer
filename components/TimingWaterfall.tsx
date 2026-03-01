'use client';

import { LifecycleStage } from '@/lib/apiTracker';

interface TimingWaterfallProps {
  stages: LifecycleStage[];
  totalTime: number;
}

export default function TimingWaterfall({ stages, totalTime }: TimingWaterfallProps) {
  const maxDuration = Math.max(...stages.map(s => s.duration), 1);

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      dns: 'bg-dns',
      tcp: 'bg-tcp',
      tls: 'bg-tls',
      req: 'bg-req',
      res: 'bg-res',
      render: 'bg-render',
    };
    return colors[color] || 'bg-gray-600';
  };

  const getNeonGlowClass = (color: string) => {
    const glows: Record<string, string> = {
      dns: 'shadow-[0_0_10px_rgba(255,107,53,0.5),0_0_20px_rgba(255,107,53,0.3)]',
      tcp: 'shadow-[0_0_10px_rgba(255,210,63,0.5),0_0_20px_rgba(255,210,63,0.3)]',
      tls: 'shadow-[0_0_10px_rgba(167,139,250,0.5),0_0_20px_rgba(167,139,250,0.3)]',
      req: 'shadow-[0_0_10px_rgba(96,165,250,0.5),0_0_20px_rgba(96,165,250,0.3)]',
      res: 'shadow-[0_0_10px_rgba(52,211,153,0.5),0_0_20px_rgba(52,211,153,0.3)]',
      render: 'shadow-[0_0_10px_rgba(244,114,182,0.5),0_0_20px_rgba(244,114,182,0.3)]',
    };
    return glows[color] || '';
  };

  const getNeonTextClass = (color: string) => {
    const texts: Record<string, string> = {
      dns: 'text-dns drop-shadow-[0_0_8px_rgba(255,107,53,0.8)]',
      tcp: 'text-tcp drop-shadow-[0_0_8px_rgba(255,210,63,0.8)]',
      tls: 'text-tls drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]',
      req: 'text-req drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]',
      res: 'text-res drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]',
      render: 'text-render drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]',
    };
    return texts[color] || 'text-gray-300';
  };

  return (
    <div className="w-full mb-8">
      <h2 className="text-xl font-bold mb-4 text-center sm:text-left neon-text-waterfall">
        TIMING WATERFALL
      </h2>
      <div className="space-y-3">
        {stages.map((stage) => {
          const isActive = stage.status === 'in-progress' || stage.status === 'completed';
          const width = stage.duration > 0 ? (stage.duration / maxDuration) * 100 : 0;
          return (
            <div key={stage.name} className="flex items-center gap-4">
              <div className={`w-16 sm:w-20 text-xs sm:text-sm font-medium transition-all duration-500 ${
                isActive ? getNeonTextClass(stage.color) : 'text-gray-600'
              }`}>
                {stage.name.toUpperCase()}
              </div>
              <div className="flex-1 h-8 bg-gray-800 rounded overflow-hidden relative border border-gray-700">
                {isActive && stage.duration > 0 ? (
                  <div
                    className={`h-full ${getColorClass(stage.color)} transition-all duration-700 
                               flex items-center justify-end pr-2 relative ${getNeonGlowClass(stage.color)}
                               border-r-2 border-white/20`}
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-xs font-medium text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]">
                      ~{stage.duration}ms
                    </span>
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                ) : stage.status === 'in-progress' ? (
                  <div className="h-full bg-gray-700 w-full flex items-center justify-end pr-2 animate-pulse border-r-2 border-gray-500/30">
                    <span className="text-xs font-medium text-gray-400">in progress...</span>
                  </div>
                ) : (
                  <div className="h-full bg-gray-700/30 w-full flex items-center justify-end pr-2">
                    <span className="text-xs font-medium text-gray-600">pending</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="flex justify-end mt-4 text-sm text-gray-400">
          <span className="neon-text-total">total: ~{totalTime}ms</span>
        </div>
      </div>
    </div>
  );
}
