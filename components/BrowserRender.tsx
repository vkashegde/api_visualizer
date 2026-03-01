'use client';

import { LifecycleStage } from '@/lib/apiTracker';

interface BrowserRenderProps {
  renderStage: LifecycleStage | undefined;
}

export default function BrowserRender({ renderStage }: BrowserRenderProps) {
  const renderSteps = [
    { step: 'HTML → DOM parsed', output: 'tree built' },
    { step: 'CSS → CSSOM built', output: 'styles computed' },
    { step: 'Render tree created', output: 'DOM + CSSOM' },
    { step: 'Layout calculated', output: 'box positions' },
    { step: 'Page painted', output: 'visible' },
  ];

  const isActive = renderStage?.status === 'in-progress' || renderStage?.status === 'completed';

  return (
    <div className="w-full mb-8">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-xl font-bold transition-colors duration-500 ${
              isActive ? 'text-render' : 'text-gray-600'
            }`}>
              RND Browser Render
            </h2>
            <p className="text-sm text-gray-400">typical: ~16ms</p>
          </div>
          {isActive && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                renderStage?.status === 'completed' ? 'bg-render' : 'bg-render'
              }`}></div>
              <span className="text-xs text-gray-400">
                {renderStage?.status === 'completed' ? 'completed' : 'in progress'}
              </span>
            </div>
          )}
        </div>
        {isActive && (
          <div className="space-y-3 mt-4">
            {renderSteps.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                           gap-2 p-2 rounded bg-gray-700/50"
              >
                <span className="text-sm text-gray-300">{item.step}</span>
                <span className="text-xs text-gray-500 sm:text-sm">({item.output})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
