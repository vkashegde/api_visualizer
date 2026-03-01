'use client';

import { LifecycleStage } from '@/lib/apiTracker';

interface PipelineProps {
  stages: LifecycleStage[];
}

export default function Pipeline({ stages }: PipelineProps) {
  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      dns: 'text-dns border-dns bg-dns/10',
      tcp: 'text-tcp border-tcp bg-tcp/10',
      tls: 'text-tls border-tls bg-tls/10',
      req: 'text-req border-req bg-req/10',
      res: 'text-res border-res bg-res/10',
      render: 'text-render border-render bg-render/10',
    };
    return colors[color] || 'text-gray-400 border-gray-400';
  };

  return (
    <div className="w-full mb-8">
      <h2 className="text-xl font-bold mb-4 text-center sm:text-left">PIPELINE</h2>
      <div className="flex flex-wrap justify-between gap-4 sm:gap-6">
        {stages.map((stage, index) => {
          const isActive = stage.status === 'in-progress' || stage.status === 'completed';
          const isPending = stage.status === 'pending';
          
          return (
            <div
              key={stage.name}
              className="flex flex-col items-center min-w-[80px] sm:min-w-[100px]"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center 
                           justify-center transition-all duration-500 ${
                  stage.status === 'completed'
                    ? `${getColorClass(stage.color)} glow-border`
                    : stage.status === 'in-progress'
                    ? `${getColorClass(stage.color)} animate-pulse-glow`
                    : 'border-gray-700 text-gray-600 bg-gray-800/50'
                }`}
              >
                {stage.status === 'completed' && (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {stage.status === 'in-progress' && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                {isPending && (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-600" />
                )}
              </div>
              <p className={`mt-2 text-xs sm:text-sm font-medium transition-colors duration-500 ${
                isActive ? getColorClass(stage.color).split(' ')[0] : 'text-gray-500'
              }`}>
                {stage.label}
              </p>
              {stage.duration > 0 && (
                <p className="text-xs text-gray-400 mt-1">~{stage.duration}ms</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
