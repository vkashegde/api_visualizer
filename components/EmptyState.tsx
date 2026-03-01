'use client';

interface EmptyStateProps {
  onExampleClick?: (url: string) => void;
}

export default function EmptyState({ onExampleClick }: EmptyStateProps) {
  const handleExampleClick = (url: string) => {
    if (onExampleClick) {
      onExampleClick(url);
    } else {
      // Fallback: try to set input value directly
      const input = document.querySelector('input[name="url"]') as HTMLInputElement;
      if (input) {
        input.value = url;
        input.focus();
      }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
      {/* Animated Icon/Illustration */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-blue-500/10 animate-pulse"></div>
        </div>
        <div className="relative">
          <svg
            className="w-32 h-32 sm:w-40 sm:h-40 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
        Ready to Visualize API Requests?
      </h2>

      {/* Description */}
      <p className="text-gray-400 text-center max-w-md mb-8 text-sm sm:text-base">
        Enter an API endpoint above to see the complete HTTP request lifecycle in real-time.
        Watch as each stage unfolds with beautiful animations and detailed timing information.
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-dns/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-dns" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Real-time Tracking</h3>
          <p className="text-xs text-gray-400">Watch each stage animate</p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-res/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-res" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Response Details</h3>
          <p className="text-xs text-gray-400">Full response with syntax highlighting</p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-req/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-req" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">All HTTP Methods</h3>
          <p className="text-xs text-gray-400">GET, POST, PUT, DELETE & more</p>
        </div>
      </div>

      {/* Example URLs */}
      <div className="mt-12 w-full max-w-2xl">
        <p className="text-sm text-gray-500 text-center mb-4">Try these example endpoints:</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => handleExampleClick('https://jsonplaceholder.typicode.com/posts/1')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
          >
            JSONPlaceholder API
          </button>
          <button
            onClick={() => handleExampleClick('https://api.github.com/users/octocat')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
          >
            GitHub API
          </button>
          <button
            onClick={() => handleExampleClick('https://httpbin.org/get')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
          >
            HTTPBin
          </button>
        </div>
      </div>
    </div>
  );
}
