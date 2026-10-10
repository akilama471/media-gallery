import React, { useState } from 'react';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';

export const BackupSettings: React.FC = () => {
  const [backupStatus, setBackupStatus] = useState<{ type: 'export' | 'import', status: 'loading' | 'success' | 'error', message?: string } | null>(null);

  const handleExport = async () => {
    try {
      setBackupStatus({ type: 'export', status: 'loading' });
      // @ts-ignore
      const res = await window.electronAPI.backup.export();
      if (res.success) {
        setBackupStatus({ type: 'export', status: 'success', message: 'Backup exported successfully.' });
      } else if (res.canceled) {
        setBackupStatus(null);
      } else {
        setBackupStatus({ type: 'export', status: 'error', message: res.error || 'Export failed.' });
      }
    } catch (err: any) {
      setBackupStatus({ type: 'export', status: 'error', message: err.message });
    }
  };

  const handleImport = async () => {
    try {
      setBackupStatus({ type: 'import', status: 'loading' });
      // @ts-ignore
      const res = await window.electronAPI.backup.import();
      if (res.success) {
        // App will restart, won't reach here usually.
      } else if (res.canceled) {
        setBackupStatus(null);
      } else {
        setBackupStatus({ type: 'import', status: 'error', message: res.error || 'Import failed.' });
      }
    } catch (err: any) {
      setBackupStatus({ type: 'import', status: 'error', message: err.message });
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
          <Download className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Data Backup</h2>
          <p className="text-gray-500 text-sm">Export or import your bookmarks, collections, and tags.</p>
        </div>
      </div>

      {backupStatus?.status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
          <Check className="w-5 h-5 text-green-600" />
          <p>{backupStatus.message}</p>
        </div>
      )}

      {backupStatus?.status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p>{backupStatus.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleExport}
          disabled={backupStatus?.status === 'loading'}
          className="flex items-center justify-center gap-2 bg-white border-2 border-purple-200 text-purple-700 font-medium px-6 py-4 rounded-xl hover:bg-purple-50 transition-colors disabled:opacity-50"
        >
          <Upload className="w-5 h-5" />
          Export Backup (ZIP)
        </button>
        
        <button
          onClick={handleImport}
          disabled={backupStatus?.status === 'loading'}
          className="flex items-center justify-center gap-2 bg-white border-2 border-orange-200 text-orange-700 font-medium px-6 py-4 rounded-xl hover:bg-orange-50 transition-colors disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          Import Backup (ZIP)
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Warning: Importing a backup will overwrite your current data and restart the application.
      </p>
    </div>
  );
};
