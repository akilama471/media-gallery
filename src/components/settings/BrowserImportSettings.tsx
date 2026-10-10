import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { BrowserImportModal } from './BrowserImportModal';

interface BrowserImportSettingsProps {
  onRefreshAll: () => void;
}

export const BrowserImportSettings: React.FC<BrowserImportSettingsProps> = ({ onRefreshAll }) => {
  const [showBrowserImport, setShowBrowserImport] = useState(false);

  return (
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

      {showBrowserImport && (
        <BrowserImportModal 
          onClose={() => setShowBrowserImport(false)}
          onImportComplete={() => {
            onRefreshAll();
          }}
        />
      )}
    </div>
  );
};
