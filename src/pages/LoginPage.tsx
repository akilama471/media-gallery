import React, { useState } from 'react';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onVerify: (password: string) => Promise<boolean>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onVerify }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
    setError(false);
    
    const success = await onVerify(password);
    if (!success) {
      setError(true);
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">App Locked</h2>
          <p className="text-gray-500 text-center mt-2">
            Enter your password or 4-digit PIN to access your bookmarks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password or PIN"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg tracking-widest"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 justify-center text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Incorrect password or PIN.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!password || loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
};
