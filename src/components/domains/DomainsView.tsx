import React from 'react';
import { Domain } from '../../types/models';
import { Globe, Loader2 } from 'lucide-react';

interface DomainsViewProps {
  domains: Domain[];
  loading: boolean;
  onSelectDomain: (domain: Domain) => void;
}

export const DomainsView: React.FC<DomainsViewProps> = ({ domains, loading, onSelectDomain }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p>Loading websites...</p>
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <div className="bg-gray-100 p-6 rounded-full mb-4 text-gray-300">
          <Globe className="w-12 h-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No websites found</h3>
        <p>Add some bookmarks to see their domains here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {domains.map((domain) => {
        const iconUrl = domain.favicon_path ? `asset://${domain.favicon_path}` : null;
        return (
          <button
            key={domain.id}
            onClick={() => onSelectDomain(domain)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 overflow-hidden border border-gray-100 group-hover:scale-110 transition-transform">
              {iconUrl ? (
                <img src={iconUrl} alt={domain.domain} className="w-8 h-8 object-contain" />
              ) : (
                <Globe className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <span className="font-medium text-gray-800 text-sm truncate w-full text-center" title={domain.domain}>
              {domain.domain}
            </span>
          </button>
        );
      })}
    </div>
  );
};
