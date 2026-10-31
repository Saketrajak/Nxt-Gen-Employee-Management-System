import React from 'react';
import { Eye, Edit3, ArrowRightLeft, UserX, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

// Helper to extract initials from full name
const getInitials = (fullName) => {
  if (!fullName) return 'EM';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Tactical department color palette for avatars
const getAvatarClass = (deptName) => {
  const name = deptName?.toLowerCase() || '';
  if (name.includes('tech') || name.includes('it')) {
    return 'bg-[#142334] text-sky-300 border border-sky-800/60';
  }
  if (name.includes('human') || name.includes('hr')) {
    return 'bg-[#1b3824] text-emerald-300 border border-emerald-800/60';
  }
  if (name.includes('finance')) {
    return 'bg-[#3b2d15] text-amber-300 border border-amber-800/60';
  }
  if (name.includes('sales')) {
    return 'bg-[#2e1d3b] text-purple-300 border border-purple-800/60';
  }
  if (name.includes('admin')) {
    return 'bg-[#25282c] text-stone-300 border border-stone-700';
  }
  return 'bg-[#1e2e22] text-emerald-200 border border-emerald-800/60';
};

// Status dot indicator
const getStatusDotClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-emerald-500';
    case 'PROBATION':
      return 'bg-amber-500';
    case 'TERMINATED':
      return 'bg-rose-500';
    default:
      return 'bg-slate-400';
  }
};

export default function EmployeeTable({
  employees,
  sortBy,
  sortDir,
  onSort,
  onView,
  onEdit,
  onTransfer,
  onDeactivate,
  onDelete,
  loading,
}) {
  const { hasRole } = useAuth();
  const canModify = hasRole(['ADMIN', 'MANAGER']);
  const isAdmin = hasRole('ADMIN');

  const renderSortIcon = (column) => {
    if (sortBy?.toLowerCase() !== column.toLowerCase()) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 ml-1 inline opacity-60" />;
    }
    return sortDir === 'desc' ? (
      <ArrowDown className="w-3 h-3 text-[#1e3e26] ml-1 inline font-bold" />
    ) : (
      <ArrowUp className="w-3 h-3 text-[#1e3e26] ml-1 inline font-bold" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-[#1c2e21]/5 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          <tr>
            <th
              onClick={() => onSort('code')}
              className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition select-none"
            >
              <div className="flex items-center">
                <span>Code</span>
                {renderSortIcon('code')}
              </div>
            </th>
            <th
              onClick={() => onSort('name')}
              className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition select-none"
            >
              <div className="flex items-center">
                <span>Personnel Name & Dossier</span>
                {renderSortIcon('name')}
              </div>
            </th>
            <th
              onClick={() => onSort('department')}
              className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition select-none"
            >
              <div className="flex items-center">
                <span>Department / Corps</span>
                {renderSortIcon('department')}
              </div>
            </th>
            <th
              onClick={() => onSort('role')}
              className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition select-none"
            >
              <div className="flex items-center">
                <span>Designation</span>
                {renderSortIcon('role')}
              </div>
            </th>
            <th className="px-4 py-3">Official Contact</th>
            <th
              onClick={() => onSort('salary')}
              className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition select-none text-right"
            >
              <div className="flex items-center justify-end">
                <span>Annual CTC</span>
                {renderSortIcon('salary')}
              </div>
            </th>
            <th
              onClick={() => onSort('status')}
              className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition select-none text-center"
            >
              <div className="flex items-center justify-center">
                <span>Duty Status</span>
                {renderSortIcon('status')}
              </div>
            </th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {loading ? (
            <tr>
              <td colSpan={8} className="text-center py-14 text-slate-400">
                <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-[#1e3e26] border-t-transparent"></div>
                <p className="mt-2 text-xs font-medium">Synchronizing cadre records from database...</p>
              </td>
            </tr>
          ) : employees.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-14 text-slate-400">
                <p className="text-sm font-semibold text-slate-700">No matching personnel records found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your global search query or filter criteria.</p>
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/90 transition-colors group">
                {/* Tactical Employee Code */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => onView(emp.id)}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100/90 hover:bg-slate-200 text-[#1b3a23] hover:text-[#0e2113] border border-slate-300/80 font-mono font-bold text-xs shadow-2xs transition"
                    title="View personnel dossier"
                  >
                    <span>#{emp.employeeCode}</span>
                  </button>
                </td>

                {/* Personnel Avatar + Name + Joining Date */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs tracking-wider shadow-2xs ${getAvatarClass(
                          emp.departmentName
                        )}`}
                      >
                        {getInitials(emp.fullName)}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${getStatusDotClass(
                          emp.status
                        )} ring-2 ring-white`}
                        title={`Status: ${emp.status}`}
                      />
                    </div>
                    <div>
                      <button
                        onClick={() => onView(emp.id)}
                        className="font-semibold text-slate-900 group-hover:text-emerald-950 transition text-sm text-left hover:underline block leading-tight"
                      >
                        {emp.fullName}
                      </button>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        Joined {formatDate(emp.joiningDate)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200/90 shadow-2xs">
                    {emp.departmentName}
                  </span>
                </td>

                {/* Role */}
                <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-700 font-medium">
                  <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200/70">
                    {emp.roleName}
                  </span>
                </td>

                {/* Official Contact */}
                <td className="px-4 py-3 whitespace-nowrap text-xs">
                  <div className="text-slate-800 font-medium">{emp.email}</div>
                  <div className="text-slate-400 text-[11px] font-mono mt-0.5">{emp.mobile}</div>
                </td>

                {/* Annual CTC */}
                <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-slate-900 text-sm">
                  {formatCurrency(emp.annualSalary)}
                </td>

                {/* Live Status Pill */}
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {emp.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>ACTIVE</span>
                    </span>
                  ) : emp.status === 'PROBATION' ? (
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                      <span>PROBATION</span>
                    </span>
                  ) : emp.status === 'TERMINATED' ? (
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-900 border border-rose-300 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                      <span>TERMINATED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      <span>INACTIVE</span>
                    </span>
                  )}
                </td>

                {/* Actions Toolbar */}
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 shadow-2xs space-x-0.5">
                    {/* View Dossier Button */}
                    <button
                      onClick={() => onView(emp.id)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition"
                      title="View Personnel Dossier"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Button */}
                    {canModify && (
                      <button
                        onClick={() => onEdit(emp.id)}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-white rounded transition"
                        title="Edit Personnel Record"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Transfer Button */}
                    {canModify && (
                      <button
                        onClick={() => onTransfer(emp)}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-white rounded transition"
                        title="Initiate Department Transfer"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Deactivate Button */}
                    {isAdmin && emp.status === 'ACTIVE' && (
                      <button
                        onClick={() => onDeactivate(emp.id)}
                        className="p-1.5 text-slate-600 hover:text-amber-800 hover:bg-white rounded transition"
                        title="Deactivate Account"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete Button */}
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(emp.id)}
                        className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-white rounded transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
