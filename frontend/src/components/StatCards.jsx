import React from 'react';
import { Users, UserCheck, Building2, ArrowRightLeft, MousePointerClick } from 'lucide-react';

export default function StatCards({
  totalRecords,
  activeCount,
  departmentCount,
  transferCount,
  activeStatus,
  activeDepartmentId,
  onTotalClick,
  onActiveClick,
  onDepartmentsClick,
  onTransfersClick,
}) {
  const isTotalActive = !activeStatus && !activeDepartmentId;
  const isActiveFiltered = activeStatus === 'ACTIVE';
  const isDeptFiltered = Boolean(activeDepartmentId);

  const stats = [
    {
      id: 'total',
      title: 'Total Personnel',
      value: totalRecords,
      desc: 'Registered in database',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      onClick: onTotalClick,
      activeRing: isTotalActive ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50/20' : '',
      actionHint: isTotalActive ? 'Viewing all records' : 'Click to show all',
      actionColor: isTotalActive ? 'text-blue-600 font-semibold' : 'text-slate-400',
    },
    {
      id: 'active',
      title: 'Active Employees',
      value: activeCount,
      desc: 'Currently on duty',
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      onClick: onActiveClick,
      activeRing: isActiveFiltered ? 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/30' : '',
      actionHint: isActiveFiltered ? 'Filtered: Active only' : 'Click to filter active',
      actionColor: isActiveFiltered ? 'text-emerald-700 font-semibold' : 'text-slate-400',
    },
    {
      id: 'departments',
      title: 'Departments',
      value: departmentCount || 5,
      desc: 'IT, HR, Fin, Sales, Admin',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      onClick: onDepartmentsClick,
      activeRing: isDeptFiltered ? 'ring-2 ring-purple-500 border-purple-300 bg-purple-50/30' : '',
      actionHint: isDeptFiltered ? 'Filtered: 1 Dept active' : 'Click to view breakdown',
      actionColor: isDeptFiltered ? 'text-purple-700 font-semibold' : 'text-slate-400',
    },
    {
      id: 'transfers',
      title: 'Department Transfers',
      value: transferCount,
      desc: 'Complete audit history',
      icon: ArrowRightLeft,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      onClick: onTransfersClick,
      activeRing: '',
      actionHint: 'Click to view audit log',
      actionColor: 'text-amber-700 hover:underline',
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
            className={`w-full text-left bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group ${stat.activeRing}`}
          >
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{stat.desc}</p>
              <div className="flex items-center space-x-1 mt-2 text-[11px]">
                <MousePointerClick className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                <span className={stat.actionColor}>{stat.actionHint}</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.borderColor} border group-hover:scale-105 transition-transform flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
