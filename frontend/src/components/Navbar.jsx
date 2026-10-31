import React from 'react';
import { Shield, User, LogOut, LogIn, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const { user, logout, hasRole } = useAuth();

  return (
    <header className="bg-[#131d16] text-white border-b border-[#253629] sticky top-0 z-30 shadow-md">
      {/* Indian Tri-Color Subtle Accent Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-[#1c2d21] p-2.5 rounded-lg border border-amber-500/40 text-amber-400 shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-wide text-white">IAIP EMS</span>
                <span className="bg-amber-950/60 text-amber-300 text-[11px] px-2.5 py-0.5 rounded font-mono font-semibold border border-amber-500/40 tracking-wider">
                  HQ SOUTHERN COMMAND
                </span>
              </div>
              <p className="text-[11px] text-slate-300 tracking-tight">Personnel Automation & Cadre Management System</p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3.5">
            {/* Quick Link to Swagger Docs */}
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-1.5 text-xs text-amber-200/90 hover:text-white bg-[#1c2a20] hover:bg-[#25382b] px-3 py-1.5 rounded-md border border-[#2f4233] transition shadow-sm font-medium"
              title="Open Backend Swagger REST API documentation"
            >
              <span>API Docs</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-[#18251c] px-3 py-1.5 rounded-lg border border-[#273a2c]">
                  <User className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <span className="text-sm font-medium text-slate-200 block leading-tight">{user.username}</span>
                    <span className="text-[10px] text-amber-300 font-mono uppercase font-bold tracking-wider">
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
                className="flex items-center space-x-1.5 text-xs bg-[#243a29] hover:bg-[#2e4a34] text-white font-medium px-4 py-2 rounded-lg border border-[#3b5c43] shadow-sm transition"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
