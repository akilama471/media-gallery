import React, { useState } from 'react';
import { KeyRound, Check, AlertCircle } from 'lucide-react';

interface SecuritySettingsProps {
  hasPassword: boolean;
  onSetPassword: (password: string) => Promise<boolean>;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ hasPassword, onSetPassword }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  return (
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
  );
};
