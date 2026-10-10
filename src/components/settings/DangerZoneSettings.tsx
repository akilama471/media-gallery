import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface DangerZoneSettingsProps {
  onRefreshAll: () => void;
}

export const DangerZoneSettings: React.FC<DangerZoneSettingsProps> = ({ onRefreshAll }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ status: 'success' | 'error', message: string } | null>(null);

  const handleWipeData = async () => {
    try {
      setLoading(true);
      // @ts-ignore
      const res = await window.electronAPI.backup.wipeData();
      if (res.success) {
        setStatus({ status: 'success', message: 'All data has been permanently deleted.' });
        onRefreshAll();
      } else if (res.canceled) {
        setStatus(null);
      } else {
        setStatus({ status: 'error', message: res.error || 'Failed to wipe data.' });
      }
    } catch (err: any) {
      setStatus({ status: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-50 p-8 rounded-2xl shadow-sm border border-red-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
          <Trash2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
          <p className="text-red-700 text-sm">Permanently delete all bookmarks, collections, tags, and cached images.</p>
        </div>
      </div>
      
      {status?.status === 'error' && (
        <div className="mb-6 p-4 bg-white border border-red-200 rounded-lg text-red-800 text-sm">
          {status.message}
        </div>
      )}

      {status?.status === 'success' && (
        <div className="mb-6 p-4 bg-white border border-green-200 rounded-lg text-green-800 text-sm">
          {status.message}
        </div>
      )}

      <button
        onClick={handleWipeData}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-white border-2 border-red-300 text-red-700 font-medium px-6 py-4 rounded-xl hover:bg-red-100 transition-colors w-full sm:w-auto disabled:opacity-50"
      >
        <Trash2 className="w-5 h-5" />
        {loading ? 'Wiping Data...' : 'Wipe All Data'}
      </button>
    </div>
  );
};
