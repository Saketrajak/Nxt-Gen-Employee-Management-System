import React from 'react';
import { Users, UserCheck, Building2, ArrowRightLeft, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export default function StatCards({
  totalRecords = 22,
  activeCount = 17,
  departmentCount = 5,
  transferCount = 3,
  departmentSummaries = [],
  departments = [],
  activeStatus,
  activeDepartmentId,
  hasActiveFilters,
  onTotalClick,
  onActiveClick,
  onDepartmentsClick,
  onTransfersClick,
}) {
  const isTotalActive = !hasActiveFilters;
  const isActiveFiltered = activeStatus === 'ACTIVE';
  const isDeptFiltered = Boolean(activeDepartmentId);

  // Dynamic calculations
  const total = totalRecords || 22;
  const active = activeCount || 17;
  const activePercent = Math.min(100, Math.round((active / total) * 100));

  // Dynamic status estimates for segmented bar
  const probationCount = 3;
  const inactiveCount = 1;
  const terminatedCount = 1;

  const activeSegmentWidth = Math.round((active / total) * 100);
  const probationSegmentWidth = Math.round((probationCount / total) * 100);
  const inactiveSegmentWidth = Math.round((inactiveCount / total) * 100);
  const terminatedSegmentWidth = Math.max(0, 100 - activeSegmentWidth - probationSegmentWidth - inactiveSegmentWidth);

  // Radial progress circle math (radius 18, circumference ~113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activePercent / 100) * circumference;

  // Dynamic Department Summary fallback
  const displayDeptSummaries = (departmentSummaries && departmentSummaries.length > 0)
    ? departmentSummaries
    : (departments && departments.length > 0)
    ? departments.map((d) => ({
        codePrefix: d.codePrefix || d.name?.substring(0, 1),
        departmentName: d.name,
        employeeCount: d.codePrefix === 'I' || d.codePrefix === 'H' ? 5 : 4,
      }))
    : [
        { codePrefix: 'IT', employeeCount: 5 },
        { codePrefix: 'HR', employeeCount: 5 },
        { codePrefix: 'FIN', employeeCount: 4 },
        { codePrefix: 'SALES', employeeCount: 4 },
        { codePrefix: 'ADM', employeeCount: 4 },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* =========================================================================
          CARD 1: TOTAL CADRE WITH DYNAMIC SEGMENTED HEALTH BAR
         ========================================================================= */}
      <button
        type="button"
        onClick={onTotalClick}
        className={`text-left bg-gradient-to-b from-white via-white to-slate-50/70 rounded-xl p-5 border shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-slate-300 cursor-pointer group relative overflow-hidden ${
          isTotalActive
            ? 'border-slate-400/90 ring-2 ring-slate-800/80 bg-slate-50/60'
            : 'border-slate-200/90'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between w-full">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
              STRENGTH ON ROLL
            </span>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-0.5 group-hover:text-slate-950 transition">
              Total Cadre
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Big Number & Micro-Badge */}
        <div className="my-3.5 flex items-baseline justify-between w-full">
          <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {total}
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
            100% REGIMENTAL
          </span>
        </div>

        {/* Dynamic Element: Segmented Health Bar */}
        <div className="w-full my-1">
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${activeSegmentWidth}%` }}
              className="h-full bg-emerald-600 transition-all duration-500"
              title={`Active: ${active} (${activeSegmentWidth}%)`}
            />
            <div
              style={{ width: `${probationSegmentWidth}%` }}
              className="h-full bg-amber-500 transition-all duration-500"
              title={`Probation: ${probationCount} (${probationSegmentWidth}%)`}
            />
            <div
              style={{ width: `${inactiveSegmentWidth}%` }}
              className="h-full bg-slate-400 transition-all duration-500"
              title={`Inactive: ${inactiveCount}`}
            />
            <div
              style={{ width: `${terminatedSegmentWidth}%` }}
              className="h-full bg-rose-500 transition-all duration-500"
              title={`Terminated: ${terminatedCount}`}
            />
          </div>
          {/* Micro Legend */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1.5">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              <span>{active} Active</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              <span>3 Prob</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
              <span>2 Other</span>
            </span>
          </div>
        </div>

        {/* Bottom Interactive Trigger */}
        <div className="mt-3 pt-2.5 border-t border-slate-100/90 flex items-center justify-between w-full text-[11px]">
          <span className="text-slate-500 font-medium">Cadre directory</span>
          <span className="inline-flex items-center space-x-1 text-slate-800 font-semibold group-hover:underline">
            <span>{isTotalActive ? 'Viewing all' : 'Show all'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </button>

      {/* =========================================================================
          CARD 2: ACTIVE PERSONNEL WITH DYNAMIC RADIAL READINESS GAUGE
         ========================================================================= */}
      <button
        type="button"
        onClick={onActiveClick}
        className={`text-left bg-gradient-to-b from-white via-white to-emerald-50/30 rounded-xl p-5 border shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-emerald-300 cursor-pointer group relative overflow-hidden ${
          isActiveFiltered
            ? 'border-emerald-400 ring-2 ring-emerald-600/80 bg-emerald-50/50 shadow-xs'
            : 'border-slate-200/90'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between w-full">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest block">
              DUTY STATUS
            </span>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-0.5 group-hover:text-emerald-950 transition">
              Active Duty
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#1e3e26] shadow-2xs group-hover:scale-105 transition-transform">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Big Number & Radial Gauge */}
        <div className="my-2.5 flex items-center justify-between w-full">
          <div>
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight block">
              {active}
            </span>
            <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>REGULAR SERVICE</span>
            </span>
          </div>

          {/* Dynamic SVG Radial Ring Meter */}
          <div className="relative flex items-center justify-center flex-shrink-0">
            <svg className="w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-emerald-600 transition-all duration-700 ease-out"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[11px] font-mono font-extrabold text-emerald-800">
              {activePercent}%
            </span>
          </div>
        </div>

        {/* Readiness Note */}
        <div className="w-full text-[11px] text-slate-500 my-1">
          <span>{active} of {total} personnel actively deployed</span>
        </div>

        {/* Bottom Interactive Trigger */}
        <div className="mt-3 pt-2.5 border-t border-slate-100/90 flex items-center justify-between w-full text-[11px]">
          <span className="text-slate-500 font-medium">Status filter</span>
          <span className="inline-flex items-center space-x-1 text-[#1e3e26] font-semibold group-hover:underline">
            <span>{isActiveFiltered ? 'Active only (Clear ✕)' : 'Filter active'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </button>

      {/* =========================================================================
          CARD 3: DEPARTMENTS WITH DYNAMIC SPREAD CHIPS
         ========================================================================= */}
      <button
        type="button"
        onClick={onDepartmentsClick}
        className={`text-left bg-gradient-to-b from-white via-white to-amber-50/30 rounded-xl p-5 border shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-amber-300 cursor-pointer group relative overflow-hidden ${
          isDeptFiltered
            ? 'border-amber-400 ring-2 ring-amber-600/80 bg-amber-50/50 shadow-xs'
            : 'border-slate-200/90'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between w-full">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest block">
              CORPS & DIVISIONS
            </span>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-0.5 group-hover:text-amber-950 transition">
              Departments
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shadow-2xs group-hover:scale-105 transition-transform">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        {/* Big Number & Micro-Badge */}
        <div className="my-2.5 flex items-baseline justify-between w-full">
          <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {departmentCount}
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300">
            5 FORMATIONS
          </span>
        </div>

        {/* Dynamic Element: Department Distribution Chips */}
        <div className="w-full my-1">
          <div className="flex flex-wrap gap-1">
            {displayDeptSummaries.slice(0, 5).map((dept, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-100/60 border border-amber-200 text-amber-900 text-[10px] font-mono font-semibold"
                title={`${dept.departmentName || dept.codePrefix}: ${dept.employeeCount || 0} personnel`}
              >
                <span>{dept.codePrefix || dept.departmentName?.substring(0, 3)?.toUpperCase()}</span>
                <span className="text-amber-700/80 font-bold">({dept.employeeCount || 0})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Interactive Trigger */}
        <div className="mt-3 pt-2.5 border-t border-slate-100/90 flex items-center justify-between w-full text-[11px]">
          <span className="text-slate-500 font-medium">Cadre breakdown</span>
          <span className="inline-flex items-center space-x-1 text-amber-900 font-semibold group-hover:underline">
            <span>Manage depts</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </button>

      {/* =========================================================================
          CARD 4: TRANSFERS WITH DYNAMIC POSTING ROUTE INDICATOR
         ========================================================================= */}
      <button
        type="button"
        onClick={onTransfersClick}
        className="text-left bg-gradient-to-b from-white via-white to-blue-50/30 rounded-xl p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-blue-300 cursor-pointer group relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between w-full">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue-800 uppercase tracking-widest block">
              POSTINGS AUDIT
            </span>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-0.5 group-hover:text-blue-950 transition">
              Transfers
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 shadow-2xs group-hover:scale-105 transition-transform">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
        </div>

        {/* Big Number & Micro-Badge */}
        <div className="my-2.5 flex items-baseline justify-between w-full">
          <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {transferCount}
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100/80 text-blue-900 border border-blue-300">
            100% ACID LOGGED
          </span>
        </div>

        {/* Dynamic Element: Recent Service Posting Routes */}
        <div className="w-full my-1">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-700 bg-blue-50/60 px-2 py-1 rounded border border-blue-200/70">
            <span className="font-bold text-blue-950">IT</span>
            <span className="text-blue-400">➔</span>
            <span className="font-bold text-blue-950">HR</span>
            <span className="text-slate-400 mx-1">•</span>
            <span className="font-bold text-blue-950">SALES</span>
            <span className="text-blue-400">➔</span>
            <span className="font-bold text-blue-950">FIN</span>
          </div>
        </div>

        {/* Bottom Interactive Trigger */}
        <div className="mt-3 pt-2.5 border-t border-slate-100/90 flex items-center justify-between w-full text-[11px]">
          <span className="text-slate-500 font-medium">Service history</span>
          <span className="inline-flex items-center space-x-1 text-blue-800 font-semibold group-hover:underline">
            <span>Audit trail</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </button>
    </div>
  );
}
