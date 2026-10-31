import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Search, Calendar, User, Building, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import client from '../api/client';

export default function TransferAuditModal({
  isOpen,
  onClose,
  onFilterEmployee,
}) {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchTransfers = () => {
    setLoading(true);
    setError('');
    client.get('/api/transfers')
      .then((res) => {
        setTransfers(res.data);
      })
      .catch((err) => {
        setError('Failed to load transfer audit logs: ' + (err.response?.data?.message || err.message));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchTransfers();
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter transfers based on search term
  const filteredTransfers = transfers.filter((t) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (t.oldEmployeeCode && t.oldEmployeeCode.toLowerCase().includes(term)) ||
      (t.newEmployeeCode && t.newEmployeeCode.toLowerCase().includes(term)) ||
      (t.employeeName && t.employeeName.toLowerCase().includes(term)) ||
      (t.oldDepartmentName && t.oldDepartmentName.toLowerCase().includes(term)) ||
      (t.newDepartmentName && t.newDepartmentName.toLowerCase().includes(term)) ||
      (t.reason && t.reason.toLowerCase().includes(term)) ||
      (t.transferredBy && t.transferredBy.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-navy-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-300">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">Department Transfer Audit Trail</h2>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-400/30">
                  {transfers.length} Recorded
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Immutable chronological log of all personnel transfers across Army branches
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchTransfers}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-navy-900 transition"
              title="Refresh Transfers"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit trail by employee name, code, department, reason, or authority..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-500 hover:text-slate-800 underline flex-shrink-0"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-amber-600 border-t-transparent"></div>
              <p className="mt-2 text-xs">Loading audit transfer history...</p>
            </div>
          ) : filteredTransfers.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <ArrowRightLeft className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
              <p className="mt-2 text-sm font-semibold text-slate-600">No transfer records found</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {searchTerm ? 'No transfers match your search query.' : 'No departmental transfers have been initiated yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransfers.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-sm transition hover:shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    {/* Top Row: Employee + Codes + Date */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {item.employeeName || `Employee #${item.employeeId}`}
                      </span>

                      {/* Code transition pill */}
                      <span className="inline-flex items-center space-x-1.5 font-mono text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                        <span className="line-through text-slate-400">{item.oldEmployeeCode}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-emerald-700">{item.newEmployeeCode}</span>
                      </span>

                      {/* Date */}
                      <span className="inline-flex items-center space-x-1 text-xs text-slate-500 ml-auto">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(item.transferDate)}</span>
                      </span>
                    </div>

                    {/* Department Transition */}
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium border border-slate-200">
                        {item.oldDepartmentName}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold border border-emerald-200">
                        {item.newDepartmentName}
                      </span>
                    </div>

                    {/* Reason / Official Note */}
                    <div className="text-xs text-slate-600 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100">
                      <p className="italic">"{item.reason}"</p>
                      <div className="flex items-center space-x-1 mt-1 text-[11px] text-slate-400">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Authorized By: <strong className="text-slate-600">{item.transferredBy}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Action button: Filter in Table */}
                  <div className="self-end md:self-center flex-shrink-0">
                    <button
                      onClick={() => {
                        onFilterEmployee(item.newEmployeeCode || item.employeeName);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition shadow-sm"
                      title="Filter main directory table to this employee"
                    >
                      <span>View in Directory</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredTransfers.length} of {transfers.length} transfer audit logs
          </span>
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

