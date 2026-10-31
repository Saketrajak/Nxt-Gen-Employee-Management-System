import React from 'react';
import { X, Building2, Users, UserCheck, Filter, ArrowRight } from 'lucide-react';

export default function DepartmentOverviewModal({
  isOpen,
  onClose,
  departments = [],
  departmentSummaries = [],
  selectedDepartmentId,
  onSelectDepartment,
  onClearDepartment,
}) {
  if (!isOpen) return null;

  // Merge department data with summaries (headcounts)
  const deptData = departments.map((dept) => {
    const summary = departmentSummaries.find((s) => s.departmentId === dept.id);
    return {
      ...dept,
      totalCount: summary ? summary.totalCount : '—',
      activeCount: summary ? summary.activeCount : '—',
    };
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-navy-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Department Headcount Overview</h2>
              <p className="text-xs text-slate-400">
                Browse all 5 organizational units and click to filter directory records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Configured Departments ({departments.length})
            </span>
            {selectedDepartmentId && (
              <button
                onClick={() => {
                  onClearDepartment();
                  onClose();
                }}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium underline"
              >
                Clear Department Filter (Show All)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {deptData.map((dept) => {
              const isSelected = String(selectedDepartmentId) === String(dept.id);
              return (
                <div
                  key={dept.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="font-mono text-sm font-bold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg border border-purple-200">
                      {dept.codePrefix}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                        {isSelected && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-600 text-white px-2 py-0.5 rounded-full">
                            Active Filter
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{dept.description}</p>
                      
                      {/* Counts */}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-600">
                        <span className="flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            Total: <strong className="text-slate-900">{dept.totalCount}</strong>
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>
                            Active: <strong className="text-emerald-700">{dept.activeCount}</strong>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectDepartment(dept.id);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition self-end sm:self-center ${
                      isSelected
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 hover:border-purple-200'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Viewing' : 'Filter Directory'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Clicking 'Filter Directory' immediately filters the table to that department.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

