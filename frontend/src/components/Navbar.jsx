import React from 'react';
import { Shield, User, LogOut, LogIn, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const { user, logout, hasRole } = useAuth();

  return (
    <header className="bg-navy-950 text-white border-b border-navy-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-army-500/20 p-2 rounded-lg border border-army-500/40 text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-wide text-white">IAIP EMS</span>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                  HQ SOUTHERN COMMAND
                </span>
              </div>
              <p className="text-xs text-slate-400">Employee Management & Process Automation System</p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            {/* Quick Link to Swagger Docs */}
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-1 text-xs text-slate-300 hover:text-white bg-navy-800/80 hover:bg-navy-800 px-3 py-1.5 rounded-md border border-navy-700 transition"
              title="Open Backend Swagger REST API documentation"
            >
              <span>API Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-navy-900 px-3 py-1.5 rounded-lg border border-navy-800">
                  <User className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <span className="text-sm font-medium text-slate-200 block leading-tight">{user.username}</span>
                    <span className="text-[10px] text-emerald-400 font-mono uppercase font-semibold">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-xs text-rose-300 hover:text-white hover:bg-rose-900/40 px-2.5 py-1.5 rounded-md transition border border-rose-800/40"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-1.5 rounded-lg shadow-sm transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
