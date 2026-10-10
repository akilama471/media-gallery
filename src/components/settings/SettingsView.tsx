import React, { useState } from 'react';
import { KeyRound, Check, AlertCircle, Download, Upload, Globe, Trash2 } from 'lucide-react';
import { BrowserImportModal } from './BrowserImportModal';

interface SettingsViewProps {
  hasPassword: boolean;
  onSetPassword: (password: string) => Promise<boolean>;
  onRefreshBookmarks: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ hasPassword, onSetPassword, onRefreshBookmarks }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [backupStatus, setBackupStatus] = useState<{ type: 'export' | 'import' | 'wipe', status: 'loading' | 'success' | 'error', message?: string } | null>(null);
  const [showBrowserImport, setShowBrowserImport] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      return;
    }

    const success = await onSetPassword(password);
    if (success) {
      setStatus('success');
      setPassword('');
      setConfirmPassword('');
    } else {
      setStatus('error');
    }
  };

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

  const handleWipeData = async () => {
    try {
      setBackupStatus({ type: 'wipe', status: 'loading' });
      // @ts-ignore
      const res = await window.electronAPI.backup.wipeData();
      if (res.success) {
        setBackupStatus({ type: 'wipe', status: 'success', message: 'All data has been permanently deleted. Reloading...' });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (res.canceled) {
        setBackupStatus(null);
      } else {
        setBackupStatus({ type: 'wipe', status: 'error', message: res.error || 'Failed to wipe data.' });
      }
    } catch (err: any) {
      setBackupStatus({ type: 'wipe', status: 'error', message: err.message });
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
            <p className="text-gray-500 text-sm">Set a password or 4-digit PIN to protect your bookmarks.</p>
          </div>
        </div>

        {hasPassword && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
            <Check className="w-5 h-5 text-green-600" />
            <p>Your application is currently protected with a password/PIN.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password or PIN</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setStatus('idle'); }}
              placeholder="Leave blank to remove (Not implemented yet)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password or PIN</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setStatus('idle'); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Passwords do not match or an error occurred.</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <Check className="w-4 h-4" />
              <span>Password updated successfully!</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={!password || !confirmPassword}
              className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {hasPassword ? 'Change Password' : 'Set Password'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Browser Import</h2>
            <p className="text-gray-500 text-sm">Import bookmarks directly from your web browsers.</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowBrowserImport(true)}
          className="flex items-center justify-center gap-2 bg-white border-2 border-blue-200 text-blue-700 font-medium px-6 py-4 rounded-xl hover:bg-blue-50 transition-colors w-full sm:w-auto"
        >
          <Globe className="w-5 h-5" />
          Import from Browser
        </button>
      </div>

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
        
        <button
          onClick={handleWipeData}
          disabled={backupStatus?.status === 'loading'}
          className="flex items-center justify-center gap-2 bg-white border-2 border-red-300 text-red-700 font-medium px-6 py-4 rounded-xl hover:bg-red-100 transition-colors w-full sm:w-auto disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
          Wipe All Data
        </button>
      </div>
      
      {showBrowserImport && (
        <BrowserImportModal 
          onClose={() => setShowBrowserImport(false)}
          onImportComplete={() => {
            onRefreshBookmarks();
          }}
        />
      )}
    </div>
  );
};
