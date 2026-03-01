'use client';

import { useState } from 'react';

interface ResponseDisplayProps {
  response?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    size: number;
  };
  error?: string;
}

export default function ResponseDisplay({ response, error }: ResponseDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!response && !error) return null;

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-res';
    if (status >= 300 && status < 400) return 'text-tcp';
    if (status >= 400 && status < 500) return 'text-dns';
    if (status >= 500) return 'text-red-500';
    return 'text-gray-400';
  };

  const formatData = (data: any): string => {
    if (data === null || data === undefined) {
      return '[Empty response]';
    }
    
    if (typeof data === 'string') {
      // Try to parse as JSON for pretty printing
      try {
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return data;
      }
    }
    
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const getFormattedData = (): string => {
    if (!response) return '';
    return formatData(response.data);
  };

  const handleCopy = async () => {
    const textToCopy = getFormattedData();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const syntaxHighlight = (json: string): JSX.Element[] => {
    if (!json || json === '[Empty response]') {
      return [<span key="empty" className="text-gray-500">{json}</span>];
    }

    const parts: JSX.Element[] = [];
    let keyIndex = 0;
    let i = 0;

    while (i < json.length) {
      const char = json[i];

      // Handle string values (both keys and values)
      if (char === '"') {
        const start = i;
        i++; // Skip opening quote
        while (i < json.length && (json[i] !== '"' || json[i - 1] === '\\')) {
          i++;
        }
        i++; // Skip closing quote
        
        const stringContent = json.substring(start, i);
        // Check if it's a key (followed by whitespace and colon)
        const nextChars = json.substring(i).trim();
        if (nextChars.startsWith(':')) {
          parts.push(
            <span key={keyIndex++} className="text-blue-400 font-semibold">
              {stringContent}
            </span>
          );
        } else {
          parts.push(
            <span key={keyIndex++} className="text-green-400">
              {stringContent}
            </span>
          );
        }
        continue;
      }

      // Handle numbers
      if ((char >= '0' && char <= '9') || char === '-') {
        const start = i;
        while (i < json.length && (
          (json[i] >= '0' && json[i] <= '9') ||
          json[i] === '.' ||
          json[i] === 'e' ||
          json[i] === 'E' ||
          json[i] === '+' ||
          json[i] === '-'
        )) {
          i++;
        }
        parts.push(
          <span key={keyIndex++} className="text-yellow-400">
            {json.substring(start, i)}
          </span>
        );
        continue;
      }

      // Handle booleans and null
      if (json.substring(i).startsWith('true')) {
        parts.push(
          <span key={keyIndex++} className="text-purple-400">true</span>
        );
        i += 4;
        continue;
      }
      if (json.substring(i).startsWith('false')) {
        parts.push(
          <span key={keyIndex++} className="text-purple-400">false</span>
        );
        i += 5;
        continue;
      }
      if (json.substring(i).startsWith('null')) {
        parts.push(
          <span key={keyIndex++} className="text-purple-400">null</span>
        );
        i += 4;
        continue;
      }

      // Handle punctuation (brackets, braces, commas, colons)
      if (char === '{' || char === '}' || char === '[' || char === ']' || char === ',' || char === ':') {
        parts.push(
          <span key={keyIndex++} className="text-gray-400">
            {char}
          </span>
        );
        i++;
        continue;
      }

      // Handle whitespace
      if (char === ' ' || char === '\n' || char === '\t') {
        parts.push(
          <span key={keyIndex++} className="text-gray-300">
            {char}
          </span>
        );
        i++;
        continue;
      }

      // Default: regular text
      parts.push(
        <span key={keyIndex++} className="text-gray-300">
          {char}
        </span>
      );
      i++;
    }

    return parts.length > 0 ? parts : [<span key="default" className="text-gray-300">{json}</span>];
  };

  return (
    <div className="w-full mb-8">
      <h2 className="text-xl font-bold mb-4 text-center sm:text-left">RESPONSE</h2>
      
      {error ? (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 font-bold">ERROR</span>
          </div>
          <p className="text-red-400">{error}</p>
        </div>
      ) : response ? (
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 space-y-4">
          {/* Status */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-700">
            <span className={`text-2xl font-bold ${getStatusColor(response.status)}`}>
              {response.status}
            </span>
            <span className="text-gray-400">{response.statusText}</span>
            <span className="ml-auto text-sm text-gray-500">
              {formatBytes(response.size)}
            </span>
          </div>

          {/* Headers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Headers</h3>
            <div className="bg-gray-900 rounded p-3 max-h-48 overflow-y-auto">
              <div className="space-y-1">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="text-xs font-mono">
                    <span className="text-blue-400 font-semibold">{key}:</span>{' '}
                    <span className="text-green-400">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-300">Body</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 
                         rounded text-xs font-medium text-gray-300 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-900 rounded p-4 max-h-96 overflow-y-auto relative">
              <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                {syntaxHighlight(formatData(response.data))}
              </pre>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
