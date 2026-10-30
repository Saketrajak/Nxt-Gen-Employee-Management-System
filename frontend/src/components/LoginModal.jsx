import React, { useState } from 'react';
import { X, Lock, User, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(username, password);
    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  const setPreset = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-navy-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold">Secure Access Sign In</h2>
              <p className="text-xs text-slate-400">IAIP EMS Role-Based Authorization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Quick Demo Role Presets */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
              Quick Test Credentials:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPreset('admin', 'Admin@123')}
                className="px-2 py-1.5 text-[11px] bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-md font-semibold text-slate-700 transition"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setPreset('manager', 'Manager@123')}
                className="px-2 py-1.5 text-[11px] bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-md font-semibold text-slate-700 transition"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => setPreset('employee', 'Employee@123')}
                className="px-2 py-1.5 text-[11px] bg-white hover:bg-purple-50 hover:text-purple-700 border border-slate-200 rounded-md font-semibold text-slate-700 transition"
              >
                Employee
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
