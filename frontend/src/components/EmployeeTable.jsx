import React from 'react';
import { Eye, Edit3, ArrowRightLeft, UserX, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency, getStatusBadgeClass } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

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
      return <ArrowUpDown className="w-3 h-3 text-slate-400 ml-1 inline" />;
    }
    return sortDir === 'desc' ? (
      <ArrowDown className="w-3 h-3 text-[#1e3e26] ml-1 inline" />
    ) : (
      <ArrowUp className="w-3 h-3 text-[#1e3e26] ml-1 inline" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-[#1c2e21]/5 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          <tr>
            <th
              onClick={() => onSort('code')}
              className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition select-none"
            >
              <div className="flex items-center">
                <span>Employee Code</span>
                {renderSortIcon('code')}
              </div>
            </th>
            <th
              onClick={() => onSort('name')}
              className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition select-none"
            >
              <div className="flex items-center">
                <span>Name & Rank</span>
                {renderSortIcon('name')}
              </div>
            </th>
            <th
              onClick={() => onSort('department')}
              className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition select-none"
            >
              <div className="flex items-center">
                <span>Department</span>
                {renderSortIcon('department')}
              </div>
            </th>
            <th
              onClick={() => onSort('role')}
              className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition select-none"
            >
              <div className="flex items-center">
                <span>Role / Designation</span>
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
                <span>Status</span>
                {renderSortIcon('status')}
              </div>
            </th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-slate-400">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#1e3e26] border-t-transparent"></div>
                <p className="mt-2 text-xs">Loading cadre records...</p>
              </td>
            </tr>
          ) : employees.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-slate-400">
                <p className="text-sm font-medium text-slate-500">No matching personnel records found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your global search query or filter criteria.</p>
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                {/* Tactical Employee Code Badge */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => onView(emp.id)}
                    className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[#1b3a23] border border-slate-300 font-mono font-bold text-xs shadow-2xs transition"
                    title="View personnel dossier"
                  >
                    <span>{emp.employeeCode}</span>
                  </button>
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{emp.fullName}</div>
                  <div className="text-[11px] text-slate-400">Joined {emp.joiningDate}</div>
                </td>

                {/* Department */}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                    {emp.departmentName}
                  </span>
                </td>

                {/* Role */}
                <td className="px-4 py-3 text-xs text-slate-600 font-medium">{emp.roleName}</td>

                {/* Contact (Email + Mobile) */}
                <td className="px-4 py-3 text-xs">
                  <div className="text-slate-800">{emp.email}</div>
                  <div className="text-slate-500 text-[11px] font-mono">{emp.mobile}</div>
                </td>

                {/* Salary */}
                <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800 text-xs">
                  {formatCurrency(emp.annualSalary)}
                </td>

                {/* Status Badge */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded border ${getStatusBadgeClass(
                      emp.status
                    )}`}
                  >
                    {emp.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center space-x-1">
                    {/* View Button */}
                    <button
                      onClick={() => onView(emp.id)}
                      className="p-1.5 text-slate-600 hover:text-[#1e3e26] hover:bg-emerald-50 rounded transition"
                      title="View Personnel Dossier"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    {canModify && (
                      <button
                        onClick={() => onEdit(emp.id)}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                        title="Edit Personnel Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Transfer Button */}
                    {canModify && (
                      <button
                        onClick={() => onTransfer(emp)}
                        className="p-1.5 text-slate-600 hover:text-amber-800 hover:bg-amber-50 rounded transition"
                        title="Initiate Department Transfer"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>
                    )}

                    {/* Deactivate Button */}
                    {isAdmin && emp.status === 'ACTIVE' && (
                      <button
                        onClick={() => onDeactivate(emp.id)}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded transition"
                        title="Deactivate Personnel"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Button */}
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(emp.id)}
                        className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
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
