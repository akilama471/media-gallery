import React from 'react';
import { Activity, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';

export const JobsPage: React.FC = () => {
  const { logs, loading } = useJobs();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const processingCount = logs.filter(l => l.status === 'processing').length;

  return (
    <div className="h-full flex flex-col p-8 pb-32">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Background Jobs</h1>
          <p className="text-gray-500">Monitor bookmark enrichment and metadata processing.</p>
        </div>
      </div>

      <div className="mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Enrichment Queue Status</h3>
          <p className="text-sm text-gray-500">Jobs process missing thumbnails and metadata.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-medium">
          {processingCount > 0 ? (
            <><Clock className="w-4 h-4 animate-spin" /> {processingCount} items processing...</>
          ) : (
            <><CheckCircle2 className="w-4 h-4 text-green-600" /> Queue is empty</>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">Recent Logs</h3>
          <span className="text-xs text-gray-400">Showing last {logs.length} logs</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <Activity className="w-8 h-8 opacity-20" />
              <p>No recent jobs found.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors flex gap-4">
                <div className="pt-1">
                  {log.status === 'processing' && <Clock className="w-5 h-5 text-blue-500 animate-pulse" />}
                  {log.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {log.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2 truncate">
                      Bookmark #{log.bookmarkId}
                    </h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mb-2">{log.url}</p>
                  
                  {log.status === 'error' ? (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="break-all">{log.message}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">{log.message}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
