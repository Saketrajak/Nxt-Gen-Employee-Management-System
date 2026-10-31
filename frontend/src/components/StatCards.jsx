import React from 'react';
import { Users, UserCheck, Building2, ArrowRightLeft, MousePointerClick } from 'lucide-react';

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

  const stats = [
    {
      id: 'total',
      title: 'Total Personnel',
      subtitle: 'Strength on Roll',
      value: totalRecords,
      desc: 'Registered cadre in records',
      icon: Users,
      color: 'text-slate-800',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-300',
      borderAccent: 'border-l-4 border-l-slate-800',
      onClick: onTotalClick,
      activeRing: isTotalActive ? 'ring-2 ring-slate-700 border-slate-300 bg-slate-50/50 shadow-sm' : '',
      actionHint: isTotalActive ? 'Viewing full cadre' : 'Click to show all personnel',
      actionColor: isTotalActive ? 'text-slate-700 font-semibold' : 'text-slate-500 font-medium underline',
    },
    {
      id: 'active',
      title: 'Active Employees',
      subtitle: 'On Active Duty',
      value: activeCount,
      desc: 'Currently in regular service',
      icon: UserCheck,
      color: 'text-[#1e3e26]',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      borderAccent: 'border-l-4 border-l-[#244b2f]',
      onClick: onActiveClick,
      activeRing: isActiveFiltered ? 'ring-2 ring-[#244b2f] border-emerald-400 bg-emerald-50/30 shadow-sm' : '',
      actionHint: isActiveFiltered ? 'Active filter on • Click to clear' : 'Click to filter active duty',
      actionColor: isActiveFiltered ? 'text-[#1e3e26] font-semibold' : 'text-slate-400',
    },
    {
      id: 'departments',
      title: 'Departments',
      subtitle: 'Formations & Corps',
      value: departmentCount || 5,
      desc: 'IT, HR, Fin, Sales, Admin',
      icon: Building2,
      color: 'text-stone-800',
      bgColor: 'bg-stone-100',
      borderColor: 'border-stone-300',
      borderAccent: 'border-l-4 border-l-stone-700',
      onClick: onDepartmentsClick,
      activeRing: isDeptFiltered ? 'ring-2 ring-stone-700 border-stone-400 bg-stone-50/40 shadow-sm' : '',
      actionHint: isDeptFiltered ? 'Dept filter active • Click to view' : 'Click to manage departments',
      actionColor: isDeptFiltered ? 'text-stone-800 font-semibold' : 'text-slate-400',
    },
    {
      id: 'transfers',
      title: 'Department Transfers',
      subtitle: 'Postings & Movements',
      value: transferCount,
      desc: 'Verified service audit log',
      icon: ArrowRightLeft,
      color: 'text-amber-800',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      borderAccent: 'border-l-4 border-l-amber-700',
      onClick: onTransfersClick,
      activeRing: '',
      actionHint: 'Click to view postings audit',
      actionColor: 'text-amber-800 hover:underline font-medium',
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
            className={`w-full text-left bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group ${stat.borderAccent} ${stat.activeRing}`}
          >
            <div>
              <div className="flex items-center space-x-1.5">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider group-hover:text-slate-900 transition">
                  {stat.title}
                </p>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono tracking-tight">{stat.value}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{stat.desc}</p>
              <div className="flex items-center space-x-1 mt-2.5 text-[11px]">
                <MousePointerClick className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                <span className={stat.actionColor}>{stat.actionHint}</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.borderColor} border group-hover:scale-105 transition-transform flex-shrink-0 shadow-xs`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
