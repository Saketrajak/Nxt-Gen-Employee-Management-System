import React, { useState } from 'react';
import {
  X,
  Building2,
  Users,
  UserCheck,
  Filter,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function DepartmentOverviewModal({
  isOpen,
  onClose,
  departments = [],
  departmentSummaries = [],
  selectedDepartmentId,
  onSelectDepartment,
  onClearDepartment,
  onDepartmentsUpdated,
}) {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');

  // Form & Action States
  const [isAdding, setIsAdding] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', codePrefix: '', description: '' });

  // Deletion States
  const [deletingDept, setDeletingDept] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Merge department data with summaries (headcounts)
  const deptData = departments.map((dept) => {
    const summary = departmentSummaries.find((s) => s.departmentId === dept.id);
    const totalCount = summary ? summary.totalCount : 0;
    const activeCount = summary ? summary.activeCount : 0;
    return {
      ...dept,
      totalCount,
      activeCount,
    };
  });

  const resetForm = () => {
    setFormData({ name: '', codePrefix: '', description: '' });
    setIsAdding(false);
    setEditingDept(null);
    setDeletingDept(null);
    setAdminPassword('');
    setErrorMsg('');
  };

  const handleStartAdd = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setFormData({ name: '', codePrefix: '', description: '' });
    setEditingDept(null);
    setIsAdding(true);
  };

  const handleStartEdit = (dept) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsAdding(false);
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      codePrefix: dept.codePrefix,
      description: dept.description || '',
    });
  };

  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Department name is mandatory.');
      return;
    }
    if (!formData.codePrefix.trim()) {
      setErrorMsg('Code prefix is mandatory (1-5 alphabetical letters).');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        codePrefix: formData.codePrefix.trim().toUpperCase(),
        description: formData.description.trim(),
      };

      if (editingDept) {
        await client.put(`/api/departments/${editingDept.id}`, payload);
        setSuccessMsg(`Department '${payload.name}' updated successfully.`);
      } else {
        await client.post('/api/departments', payload);
        setSuccessMsg(`Department '${payload.name}' created with atomic sequence.`);
      }

      resetForm();
      if (onDepartmentsUpdated) onDepartmentsUpdated();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.validationErrors
        ? Object.values(err.response?.data?.validationErrors || {}).join(', ')
        : err.message;
      setErrorMsg(msg || 'Failed to save department.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    if (!deletingDept) return;

    setErrorMsg('');
    setLoading(true);

    try {
      const hasEmployees = deletingDept.totalCount > 0;
      if (hasEmployees && !adminPassword.trim()) {
        setErrorMsg('Admin password is required to delete a department with assigned personnel.');
        setLoading(false);
        return;
      }

      await client.delete(`/api/departments/${deletingDept.id}`, {
        data: { adminPassword: adminPassword.trim() },
      });

      setSuccessMsg(`Department '${deletingDept.name}' and all cascading records were deleted successfully.`);
      setDeletingDept(null);
      setAdminPassword('');
      if (onDepartmentsUpdated) onDepartmentsUpdated();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setErrorMsg(msg || 'Failed to delete department.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-navy-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">Organizational Departments</h2>
                <span className="text-xs bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded-full border border-purple-400/30">
                  {departments.length} Units
                </span>
              </div>
              <p className="text-xs text-slate-400">
                View headcounts, filter personnel, or manage departmental structures
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAdmin && !isAdding && !editingDept && !deletingDept && (
              <button
                onClick={handleStartAdd}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Department</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Notifications */}
        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 text-rose-800 px-6 py-2.5 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-rose-500 hover:text-rose-800">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-6 py-2.5 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-800">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Add / Edit Form Card */}
          {(isAdding || editingDept) && (
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 shadow-sm animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{editingDept ? `Edit Department: ${editingDept.name}` : 'Create New Department'}</span>
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveDepartment} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Logistics & Supply Corps"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Code Prefix (1-5 chars) *
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="e.g. L"
                      value={formData.codePrefix}
                      onChange={(e) => setFormData({ ...formData, codePrefix: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono uppercase focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the department's mandate..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-1 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-1 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingDept ? 'Save Changes' : 'Create Department'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Delete Warning & Password Modal */}
          {deletingDept && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-5 shadow-md animate-in fade-in duration-150">
              <div className="flex items-start space-x-3 mb-3">
                <div className="p-2 bg-rose-100 rounded-xl text-rose-600 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-900">
                    Confirm Deletion: {deletingDept.name} ({deletingDept.codePrefix})
                  </h3>
                  {deletingDept.totalCount > 0 ? (
                    <div className="mt-2 text-xs text-rose-800 space-y-1.5 bg-rose-100/70 p-3 rounded-lg border border-rose-200">
                      <p className="font-bold uppercase tracking-wider text-rose-950">
                        CRITICAL WARNING: {deletingDept.totalCount} personnel currently assigned!
                      </p>
                      <p>
                        Deleting this department will <strong>PERMANENTLY REMOVE</strong> the department along with{' '}
                        <strong>ALL {deletingDept.totalCount} assigned employee records</strong>, their personal details,
                        and departmental sequences.
                      </p>
                      <p className="font-medium text-[11px] text-rose-700">
                        To authorize this irreversible cascading action, you must enter your Admin password below.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-slate-600">
                      This department currently contains 0 employees. Are you sure you want to permanently delete it?
                    </p>
                  )}
                </div>
              </div>

              <form onSubmit={handleConfirmDelete} className="space-y-3 mt-3 pt-3 border-t border-rose-200">
                {deletingDept.totalCount > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-rose-900 mb-1 flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-rose-600" />
                      <span>Enter Admin Password to Authorize:</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Admin@123"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-white border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingDept(null);
                      setAdminPassword('');
                      setErrorMsg('');
                    }}
                    className="px-4 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>
                      {loading
                        ? 'Deleting...'
                        : deletingDept.totalCount > 0
                        ? `Authorize & Delete Department and ${deletingDept.totalCount} Personnel`
                        : 'Confirm Delete'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Department List */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Departmental Roster ({departments.length})
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
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="font-mono text-sm font-bold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg border border-purple-200 flex-shrink-0">
                      {dept.codePrefix}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                        {isSelected && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-600 text-white px-2 py-0.5 rounded-full">
                            Active Filter
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{dept.description || 'No description provided'}</p>

                      {/* Headcounts */}
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

                  {/* Actions: Filter + Admin Edit/Delete */}
                  <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                    {isAdmin && (
                      <div className="flex items-center space-x-1 mr-1 border-r border-slate-200 pr-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(dept)}
                          className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                          title="Edit Department Details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setErrorMsg('');
                            setDeletingDept(dept);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Department"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        onSelectDepartment(dept.id);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {isAdmin ? 'Admins can add, edit, or remove departments with cascade security.' : 'Log in as Admin to configure or remove departments.'}
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
