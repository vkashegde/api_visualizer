'use client';

interface LogSectionProps {
  logs: string[];
}

export default function LogSection({ logs }: LogSectionProps) {
  const getLogColor = (log: string) => {
    if (log.includes('[DNS]')) return 'text-dns';
    if (log.includes('[TCP]')) return 'text-tcp';
    if (log.includes('[TLS]')) return 'text-tls';
    if (log.includes('[REQ]')) return 'text-req';
    if (log.includes('[RES]')) return 'text-res';
    if (log.includes('[RND]')) return 'text-render';
    return 'text-gray-400';
  };

  return (
    <div className="w-full mb-8">
      <h2 className="text-xl font-bold mb-4 text-center sm:text-left">LOG</h2>
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 min-h-[100px] max-h-[200px] overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">No logs yet...</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log, index) => (
              <li key={index} className={`text-sm ${getLogColor(log)}`}>
                • {log}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
