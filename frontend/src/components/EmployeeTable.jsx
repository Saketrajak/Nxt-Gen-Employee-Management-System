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
      return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline" />;
    }
    return sortDir === 'desc' ? (
      <ArrowDown className="w-3 h-3 text-emerald-600 ml-1 inline" />
    ) : (
      <ArrowUp className="w-3 h-3 text-emerald-600 ml-1 inline" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
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
                <span>Name</span>
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
                <span>Role</span>
                {renderSortIcon('role')}
              </div>
            </th>
            <th className="px-4 py-3">Contact</th>
            <th
              onClick={() => onSort('salary')}
              className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition select-none text-right"
            >
              <div className="flex items-center justify-end">
                <span>Annual Salary</span>
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
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent"></div>
                <p className="mt-2 text-xs">Loading employee records...</p>
              </td>
            </tr>
          ) : employees.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-slate-400">
                <p className="text-sm font-medium text-slate-500">No matching employees found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your global search query or filter criteria.</p>
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                {/* Employee Code (Clickable to view details) */}
                <td className="px-4 py-3 font-mono font-bold text-xs text-emerald-700">
                  <button
                    onClick={() => onView(emp.id)}
                    className="hover:underline flex items-center space-x-1"
                    title="View full personal and employment details"
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
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    {emp.departmentName}
                  </span>
                </td>

                {/* Role */}
                <td className="px-4 py-3 text-xs text-slate-600">{emp.roleName}</td>

                {/* Contact (Email + Mobile) */}
                <td className="px-4 py-3 text-xs">
                  <div className="text-slate-800">{emp.email}</div>
                  <div className="text-slate-400 text-[11px] font-mono">{emp.mobile}</div>
                </td>

                {/* Salary */}
                <td className="px-4 py-3 text-right font-mono font-medium text-slate-800 text-xs">
                  {formatCurrency(emp.annualSalary)}
                </td>

                {/* Status Badge */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadgeClass(
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
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    {canModify && (
                      <button
                        onClick={() => onEdit(emp.id)}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                        title="Edit Employee"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Transfer Button */}
                    {canModify && (
                      <button
                        onClick={() => onTransfer(emp)}
                        className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded transition"
                        title="Transfer Department"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>
                    )}

                    {/* Deactivate Button */}
                    {isAdmin && emp.status === 'ACTIVE' && (
                      <button
                        onClick={() => onDeactivate(emp.id)}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded transition"
                        title="Deactivate Employee"
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
