import React from 'react';
import { Users, UserCheck, Building2, ArrowRightLeft, MousePointerClick, ShieldCheck, Activity, Layers, History } from 'lucide-react';

export default function StatCards({
  totalRecords,
  activeCount,
  departmentCount,
  transferCount,
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

  // Calculate percentage of active personnel
  const activePercent = totalRecords > 0 ? Math.round((activeCount / totalRecords) * 100) : 0;

  const stats = [
    {
      id: 'total',
      title: 'Total Personnel',
      code: 'STRENGTH',
      value: totalRecords,
      desc: 'Registered cadre in records',
      badge: '100% REGIMENTAL CADRE',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: Users,
      iconColor: 'text-slate-700',
      iconBg: 'bg-slate-100 border-slate-200',
      topBorder: 'border-t-2 border-t-slate-700',
      onClick: onTotalClick,
      activeRing: isTotalActive ? 'ring-2 ring-slate-800 shadow-sm' : '',
      actionHint: isTotalActive ? 'Viewing full cadre' : 'Click to show all personnel',
      actionColor: isTotalActive ? 'text-slate-800 font-semibold' : 'text-slate-500 font-medium underline',
    },
    {
      id: 'active',
      title: 'Active Employees',
      code: 'DUTY STATUS',
      value: activeCount,
      desc: `${activePercent}% operational readiness`,
      badge: `${activePercent}% ON DUTY`,
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: UserCheck,
      iconColor: 'text-[#1e3e26]',
      iconBg: 'bg-emerald-50 border-emerald-200',
      topBorder: 'border-t-2 border-t-[#244b2f]',
      onClick: onActiveClick,
      activeRing: isActiveFiltered ? 'ring-2 ring-[#244b2f] shadow-sm' : '',
      actionHint: isActiveFiltered ? 'Active filter on • Click to clear' : 'Click to filter active duty',
      actionColor: isActiveFiltered ? 'text-[#1e3e26] font-semibold' : 'text-slate-400',
    },
    {
      id: 'departments',
      title: 'Departments',
      code: 'CORPS & DIV',
      value: departmentCount || 5,
      desc: 'IT, HR, Fin, Sales, Admin',
      badge: '5 CORPS FORMATIONS',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
      icon: Building2,
      iconColor: 'text-amber-800',
      iconBg: 'bg-amber-50 border-amber-200',
      topBorder: 'border-t-2 border-t-amber-600',
      onClick: onDepartmentsClick,
      activeRing: isDeptFiltered ? 'ring-2 ring-amber-600 shadow-sm' : '',
      actionHint: isDeptFiltered ? 'Dept filter active • Click to view' : 'Click to manage departments',
      actionColor: isDeptFiltered ? 'text-amber-900 font-semibold' : 'text-slate-400',
    },
    {
      id: 'transfers',
      title: 'Department Transfers',
      code: 'POSTINGS',
      value: transferCount,
      desc: 'Audited cadre movement logs',
      badge: 'VERIFIED AUDIT LOG',
      badgeColor: 'bg-blue-50 text-blue-900 border-blue-300',
      icon: ArrowRightLeft,
      iconColor: 'text-blue-800',
      iconBg: 'bg-blue-50 border-blue-200',
      topBorder: 'border-t-2 border-t-blue-700',
      onClick: onTransfersClick,
      activeRing: '',
      actionHint: 'Click to view postings audit',
      actionColor: 'text-blue-800 hover:underline font-medium',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <button
            key={stat.id}
            type="button"
            onClick={stat.onClick}
            className={`w-full text-left bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-slate-300 cursor-pointer group ${stat.topBorder} ${stat.activeRing}`}
          >
            {/* Top row: Label + Badge + Icon */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  {stat.code}
                </span>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-0.5 group-hover:text-slate-900 transition">
                  {stat.title}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.iconBg} border ${stat.iconColor} shadow-2xs group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle: Big Metric Value + Badge */}
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {stat.value}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${stat.badgeColor}`}>
                {stat.badge}
              </span>
            </div>

            {/* Bottom: Description + Click Trigger */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium truncate max-w-[150px]">{stat.desc}</span>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <MousePointerClick className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                <span className={stat.actionColor}>{stat.actionHint}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
