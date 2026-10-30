import React, { useState } from 'react';
import { Search, X, Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  departments,
  roles,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSalaryPreset = (preset) => {
    switch (preset) {
      case '1-3':
        onFilterChange({ minSalary: '100000', maxSalary: '299999', salaryPreset: '1-3' });
        break;
      case '3-5':
        onFilterChange({ minSalary: '300000', maxSalary: '499999', salaryPreset: '3-5' });
        break;
      case '5-10':
        onFilterChange({ minSalary: '500000', maxSalary: '999999', salaryPreset: '5-10' });
        break;
      case '10+':
        onFilterChange({ minSalary: '1000000', maxSalary: '', salaryPreset: '10+' });
        break;
      case 'custom':
        onFilterChange({ salaryPreset: 'custom' });
        break;
      default:
        onFilterChange({ minSalary: '', maxSalary: '', salaryPreset: '' });
        break;
    }
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.departmentId ||
    filters.roleId ||
    filters.status ||
    filters.gender ||
    filters.joiningDate ||
    filters.minSalary ||
    filters.maxSalary
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      {/* Top Search Bar & Action Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Global Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Global Search: Code, Name, Email, Mobile, Dept, Role, Address, Status..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 placeholder-slate-400 transition"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle and Reset Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-sm font-medium rounded-lg border transition ${
              showAdvanced || hasActiveFilters
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="ml-1 bg-emerald-600 text-white text-[10px] w-4 h-4 rounded-full inline-flex items-center justify-center font-bold">
                !
              </span>
            )}
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
          {/* 1. Department Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
            <select
              value={filters.departmentId || ''}
              onChange={(e) => onFilterChange({ departmentId: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.codePrefix})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Role Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Role / Designation</label>
            <select
              value={filters.roleId || ''}
              onChange={(e) => onFilterChange({ roleId: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PROBATION">PROBATION</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="TERMINATED">TERMINATED</option>
            </select>
          </div>

          {/* 4. Gender Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
            <select
              value={filters.gender || ''}
              onChange={(e) => onFilterChange({ gender: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* 5. Joining Date Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Joining Date</label>
            <input
              type="date"
              value={filters.joiningDate || ''}
              onChange={(e) => onFilterChange({ joiningDate: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800 text-xs"
            />
          </div>

          {/* 6. Salary Range Preset */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Salary Range</label>
            <select
              value={filters.salaryPreset || ''}
              onChange={(e) => handleSalaryPreset(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800"
            >
              <option value="">Any Salary</option>
              <option value="1-3">₹1–3 LPA (₹1L - ₹3L)</option>
              <option value="3-5">₹3–5 LPA (₹3L - ₹5L)</option>
              <option value="5-10">₹5–10 LPA (₹5L - ₹10L)</option>
              <option value="10+">₹10+ LPA (₹10L+)</option>
              <option value="custom">Custom Range...</option>
            </select>
          </div>

          {/* Custom Salary Inputs (Visible if custom selected) */}
          {filters.salaryPreset === 'custom' && (
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Min Annual Salary (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 250000"
                  value={filters.minSalary || ''}
                  onChange={(e) => onFilterChange({ minSalary: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Max Annual Salary (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 850000"
                  value={filters.maxSalary || ''}
                  onChange={(e) => onFilterChange({ maxSalary: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
