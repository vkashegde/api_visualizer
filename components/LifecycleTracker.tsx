'use client';

import { useState } from 'react';
import { APITracker, LifecycleData, RequestConfig } from '@/lib/apiTracker';
import URLInput from './URLInput';
import Pipeline from './Pipeline';
import TimingWaterfall from './TimingWaterfall';
import BrowserRender from './BrowserRender';
import LogSection from './LogSection';
import ResponseDisplay from './ResponseDisplay';

export default function LifecycleTracker() {
  const [data, setData] = useState<LifecycleData>({
    url: '',
    totalTime: 0,
    stages: [],
    logs: [],
  });
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = async (url: string, config: RequestConfig) => {
    setIsTracking(true);
    setData({
      url: '',
      totalTime: 0,
      stages: [],
      logs: [],
    });
    
    const tracker = new APITracker((updateData) => {
      setData({ ...updateData, url });
    });

    const result = await tracker.track(url, config);
    setData(result);
    setIsTracking(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
      
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 neon-text">
            HTTP Request Lifecycle
          </h1>
   
        </div>

        {/* URL Input */}
        <div className="mb-8">
          <URLInput onSubmit={handleTrack} disabled={isTracking} />
        </div>

        {/* Main Content */}
        {data.stages.length > 0 && (
          <div className="space-y-6">
            {/* Pipeline */}
            <Pipeline stages={data.stages} />

            {/* Browser Render Details */}
            <BrowserRender renderStage={data.stages.find(s => s.name === 'render')} />

            {/* Timing Waterfall */}
            <TimingWaterfall stages={data.stages} totalTime={data.totalTime} />

            {/* Log Section */}
            <LogSection logs={data.logs} />

            {/* Response Display */}
            <ResponseDisplay response={data.response} error={data.error} />
          </div>
        )}

    
      </div>
    </div>
  );
}
