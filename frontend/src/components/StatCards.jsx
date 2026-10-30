import React from 'react';
import { Users, UserCheck, Building2, ArrowRightLeft } from 'lucide-react';

export default function StatCards({ totalRecords, activeCount, departmentCount, transferCount }) {
  const stats = [
    {
      title: 'Total Personnel',
      value: totalRecords,
      desc: 'Registered in database',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Active Employees',
      value: activeCount,
      desc: 'Currently on duty',
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      title: 'Departments',
      value: departmentCount || 5,
      desc: 'IT, HR, Fin, Sales, Admin',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
    },
    {
      title: 'Department Transfers',
      value: transferCount,
      desc: 'Complete audit history',
      icon: ArrowRightLeft,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between hover:border-slate-300 transition"
          >
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{stat.desc}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
