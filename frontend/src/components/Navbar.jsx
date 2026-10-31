import React from 'react';
import { Shield, User, LogOut, LogIn, ExternalLink, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const { user, logout, hasRole } = useAuth();

  // Extract initials for user avatar
  const getUserInitials = (username) => {
    if (!username) return 'US';
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-[#0b1118] text-white border-b border-slate-800/80 sticky top-0 z-30 shadow-sm backdrop-blur-md">
      {/* Official Indian Tri-Color Precision Accent Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand Identity */}
          <div className="flex items-center space-x-3.5">
            {/* Tactical Crest Icon */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border border-slate-700/80 flex items-center justify-center text-amber-400 shadow-xs flex-shrink-0">
              <Shield className="w-5 h-5 fill-amber-400/10 text-amber-400" />
            </div>

            <div>
              {/* Brand Title + Formation Badge */}
              <div className="flex items-center space-x-2.5">
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white font-mono">IAIP</span>
                  <span className="text-slate-600 font-light text-sm">/</span>
                  <span className="font-bold text-sm tracking-tight text-slate-200">EMS</span>
                </div>

                {/* HQ Southern Command Live Beacon Badge */}
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 tracking-wider shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>HQ SOUTHERN COMMAND</span>
                </span>
              </div>

              {/* Sub-Brand Descriptor */}
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium mt-0.5">
                Indian Army • Personnel Automation & Cadre Information Directorate
              </p>
            </div>
          </div>

          {/* Right Navigation & Operational Controls */}
          <div className="flex items-center space-x-3">
            {/* Station / Base Metadata Indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-md border border-slate-800 shadow-2xs">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>PUNE MILITARY STATION</span>
            </div>

            {/* Quick Link to Interactive Swagger Docs */}
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-700/70 transition shadow-2xs font-medium"
              title="Open Backend Swagger REST API documentation"
            >
              <span className="font-mono text-[11px] text-amber-400 font-bold">API</span>
              <span>Docs</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {user ? (
              <div className="flex items-center space-x-2 pl-1 border-l border-slate-800">
                {/* User Identity Pill */}
                <div className="flex items-center space-x-2.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 shadow-2xs">
                  {/* Tactical User Initials Avatar */}
                  <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-amber-600 to-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                    {getUserInitials(user.username)}
                  </div>

                  <div className="text-left leading-tight">
                    <span className="text-xs font-semibold text-slate-200 block truncate max-w-[100px]">
                      {user.username}
                    </span>
                    <span className="text-[9px] text-amber-400 font-mono uppercase font-bold tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-xs text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 p-2 sm:px-2.5 sm:py-1.5 rounded-lg transition border border-transparent hover:border-rose-900/40"
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-1.5 text-xs bg-[#1b2e21] hover:bg-[#253f2d] text-white font-medium px-4 py-2 rounded-lg border border-[#2e4d36] shadow-sm transition"
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
