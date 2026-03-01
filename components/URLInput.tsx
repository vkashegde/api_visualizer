'use client';

import { useState } from 'react';
import { RequestConfig } from '@/lib/apiTracker';

interface URLInputProps {
  onSubmit: (url: string, config: RequestConfig) => void;
  disabled?: boolean;
}

export default function URLInput({ onSubmit, disabled }: URLInputProps) {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'>('GET');
  const [showBody, setShowBody] = useState(false);
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    if (url) {
      let requestBody: string | undefined;
      
      if (showBody && body) {
        // Validate JSON if body is provided
        try {
          JSON.parse(body);
          requestBody = body;
        } catch (error) {
          alert('Invalid JSON in request body. Please check your JSON syntax.');
          return;
        }
      }
      
      const config: RequestConfig = {
        method,
        body: requestBody,
      };
      onSubmit(url, config);
    }
  };

  const methodsWithBody = ['POST', 'PUT', 'PATCH'];
  const shouldShowBody = methodsWithBody.includes(method);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto mb-8">
      <div className="space-y-4">
        {/* Method and URL Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Method Dropdown */}
          <select
            value={method}
            onChange={(e) => {
              const newMethod = e.target.value as RequestConfig['method'];
              setMethod(newMethod);
              setShowBody(methodsWithBody.includes(newMethod));
            }}
            disabled={disabled}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white focus:outline-none focus:border-blue-500 
                     focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50
                     min-w-[120px] font-medium"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>

          {/* URL Input */}
          <input
            type="url"
            name="url"
            placeholder="https://api.example.com/endpoint"
            disabled={disabled}
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 
                     focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={disabled}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 
                     rounded-lg font-medium transition-colors disabled:cursor-not-allowed
                     whitespace-nowrap"
          >
            {disabled ? 'Sending...' : 'Send'}
          </button>
        </div>

        {/* Body Input (for POST, PUT, PATCH) */}
        {shouldShowBody && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Request Body (JSON)
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={disabled}
              placeholder='{"key": "value"}'
              rows={6}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Enter valid JSON for the request body
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
