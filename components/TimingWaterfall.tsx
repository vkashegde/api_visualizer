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

  return (
    <div className="w-full mb-8">
      <h2 className="text-xl font-bold mb-4 text-center sm:text-left">TIMING WATERFALL</h2>
      <div className="space-y-3">
        {stages.map((stage) => {
          const isActive = stage.status === 'in-progress' || stage.status === 'completed';
          const width = stage.duration > 0 ? (stage.duration / maxDuration) * 100 : 0;
          return (
            <div key={stage.name} className="flex items-center gap-4">
              <div className={`w-16 sm:w-20 text-xs sm:text-sm font-medium transition-colors duration-500 ${
                isActive ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {stage.name.toUpperCase()}
              </div>
              <div className="flex-1 h-8 bg-gray-800 rounded overflow-hidden relative">
                {isActive && stage.duration > 0 ? (
                  <div
                    className={`h-full ${getColorClass(stage.color)} transition-all duration-700 
                               flex items-center justify-end pr-2`}
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-xs font-medium text-white">
                      ~{stage.duration}ms
                    </span>
                  </div>
                ) : stage.status === 'in-progress' ? (
                  <div className="h-full bg-gray-700 w-full flex items-center justify-end pr-2 animate-pulse">
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
          total: ~{totalTime}ms
        </div>
      </div>
    </div>
  );
}
