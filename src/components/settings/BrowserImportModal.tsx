import React, { useState } from 'react';
import { X, Globe, User, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface BrowserProfile {
  id: string;
  name: string;
  path: string;
}

interface BrowserImportModalProps {
  onClose: () => void;
  onImportComplete: () => void;
}

const BROWSERS = [
  { id: 'chrome', name: 'Google Chrome' },
  { id: 'edge', name: 'Microsoft Edge' },
  { id: 'opera', name: 'Opera' },
  { id: 'firefox', name: 'Mozilla Firefox' },
  { id: 'yandex', name: 'Yandex Browser' }
];

export const BrowserImportModal: React.FC<BrowserImportModalProps> = ({ onClose, onImportComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBrowser, setSelectedBrowser] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<BrowserProfile[]>([]);
  const [selectedProfilePath, setSelectedProfilePath] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importCount, setImportCount] = useState<number>(0);

  const handleBrowserSelect = async (browserId: string) => {
    setSelectedBrowser(browserId);
    setLoading(true);
    setError(null);
    try {
      // @ts-ignore
      const res = await window.electronAPI.browserImport.getProfiles(browserId);
      if (res.success) {
        setProfiles(res.data);
        if (res.data.length === 1) {
          // Auto-select if only one profile
          setSelectedProfilePath(res.data[0].path);
        }
        setStep(2);
      } else {
        setError(res.error || 'Failed to get profiles. Is this browser installed?');
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
    setLoading(false);
  };

  const handleImport = async () => {
    if (!selectedBrowser || !selectedProfilePath) return;
    setLoading(true);
    setError(null);
    try {
      // @ts-ignore
      const res = await window.electronAPI.browserImport.execute(selectedBrowser, selectedProfilePath);
      if (res.success) {
        setImportCount(res.data);
        setStep(3);
        onImportComplete();
      } else {
        setError(res.error || 'Import failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Import failed.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Import from Browser</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm border border-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-gray-600 mb-4">Select the browser you want to import bookmarks from:</p>
              <div className="grid gap-3">
                {BROWSERS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleBrowserSelect(b.id)}
                    disabled={loading}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left disabled:opacity-50"
                  >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-800">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-gray-600 mb-4">
                {profiles.length > 1 
                  ? 'Multiple profiles found. Please select which profile to import from:'
                  : 'Profile found. Ready to import.'}
              </p>
              
              <div className="grid gap-3 max-h-60 overflow-y-auto mb-6">
                {profiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProfilePath(p.path)}
                    className={`flex items-center gap-3 p-4 border rounded-xl transition-all text-left ${selectedProfilePath === p.path ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <div className={`p-2 rounded-lg ${selectedProfilePath === p.path ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      <User className="w-5 h-5" />
                    </div>
                    <span className={`font-medium ${selectedProfilePath === p.path ? 'text-blue-900' : 'text-gray-800'}`}>
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedProfilePath(null);
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleImport}
                  disabled={!selectedProfilePath || loading}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Import Now
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Import Successful</h3>
              <p className="text-gray-600 mb-6">
                Successfully imported <strong>{importCount}</strong> bookmarks!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
