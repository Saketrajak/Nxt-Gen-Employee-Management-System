import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import client from '../api/client';

export default function TransferModal({
  isOpen,
  onClose,
  employee,
  departments,
  onSuccess,
}) {
  const [newDepartmentId, setNewDepartmentId] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [previewCode, setPreviewCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Filter out current department
  const eligibleDepartments = departments.filter((d) => d.id !== employee?.departmentId);

  // Set default target department
  useEffect(() => {
    if (eligibleDepartments.length > 0) {
      setNewDepartmentId(eligibleDepartments[0].id);
    }
    setReason('');
    setError('');
  }, [employee, isOpen]);

  // Fetch preview code when target department changes
  useEffect(() => {
    if (newDepartmentId) {
      client.get(`/api/lookup/preview-code/${newDepartmentId}`)
        .then((res) => setPreviewCode(res.data.nextEmployeeCode))
        .catch(() => setPreviewCode(''));
    }
  }, [newDepartmentId]);

  if (!isOpen || !employee) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please state an official transfer justification / reason.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await client.post('/api/transfers', {
        employeeId: employee.id,
        newDepartmentId: Number(newDepartmentId),
        transferDate,
        reason: reason.trim(),
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Department transfer operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedNewDept = departments.find((d) => d.id === Number(newDepartmentId));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-navy-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-base font-bold">Initiate Department Transfer</h2>
              <p className="text-xs text-slate-400">Reassign personnel & generate new department sequence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current State Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Employee Name:</span>
              <strong className="text-slate-900">{employee.fullName}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Current Department:</span>
              <span className="font-semibold text-slate-800">{employee.departmentName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Current Employee Code:</span>
              <span className="font-mono font-bold text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded">
                {employee.employeeCode}
              </span>
            </div>
          </div>

          {/* Transfer Transition Arrow Card */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-purple-800">Current Code</div>
              <div className="font-mono font-bold text-slate-800 mt-0.5">{employee.employeeCode}</div>
            </div>
            <ArrowRightLeft className="w-5 h-5 text-purple-600 animate-pulse" />
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-purple-800 flex items-center justify-center space-x-1">
                <span>New Assigned Code</span>
                <Sparkles className="w-3 h-3 text-purple-600" />
              </div>
              <div className="font-mono font-bold text-purple-900 text-sm mt-0.5">
                {previewCode || 'Calculating...'}
              </div>
            </div>
          </div>

          {/* Target Department Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select New Department *
            </label>
            <select
              value={newDepartmentId}
              onChange={(e) => setNewDepartmentId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-900 font-medium"
            >
              {eligibleDepartments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} (Code Prefix: {dept.codePrefix})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Transferring to {selectedNewDept?.name || 'department'} will atomically allocate code{' '}
              <strong className="text-purple-700">{previewCode}</strong>.
            </p>
          </div>

          {/* Transfer Effective Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Effective Transfer Date *
            </label>
            <input
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900"
            />
          </div>

          {/* Official Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transfer Justification / Official Reason *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Reassigned to Operations unit for cross-departmental coordination."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-600 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
            >
              {submitting ? (
                <span>Executing Transfer...</span>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Execute Transfer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
