import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Building2,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  History,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { formatCurrency, maskAadhaar, formatDate, getStatusBadgeClass } from '../utils/formatters';
import client from '../api/client';

export default function EmployeeDetailModal({ isOpen, onClose, employeeId }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFullAadhaar, setShowFullAadhaar] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'transfers'

  useEffect(() => {
    if (isOpen && employeeId) {
      setLoading(true);
      setShowFullAadhaar(false);
      setActiveTab('profile');

      client.get(`/api/employees/${employeeId}`)
        .then((res) => setEmployee(res.data))
        .catch((err) => alert('Failed to fetch employee details: ' + (err.response?.data?.message || err.message)))
        .finally(() => setLoading(false));
    }
  }, [isOpen, employeeId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Modal Top Bar */}
        <div className="bg-navy-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold">Personnel 360° Profile</h2>
              <p className="text-xs text-slate-400">HQ Southern Command EMS Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading || !employee ? (
          <div className="p-16 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent"></div>
            <p className="mt-2 text-xs">Loading complete employee dossier...</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Header Badge Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {employee.fullName?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900">{employee.fullName}</h3>
                    <span
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadgeClass(
                        employee.status
                      )}`}
                    >
                      {employee.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {employee.employeeCode}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-slate-700">{employee.roleName}</span>
                    <span>•</span>
                    <span className="text-slate-600">{employee.departmentName}</span>
                  </div>
                </div>
              </div>

              {/* Annual Compensation Pill */}
              <div className="text-left sm:text-right bg-white px-3.5 py-2 rounded-xl border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-400">Annual Salary</p>
                <p className="text-base font-bold font-mono text-slate-900">
                  {formatCurrency(employee.annualSalary)}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 mb-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center space-x-1.5 ${
                  activeTab === 'profile'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Personal & Employment Details</span>
              </button>

              <button
                onClick={() => setActiveTab('transfers')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center space-x-1.5 ${
                  activeTab === 'transfers'
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Department Transfers ({employee.transferHistory?.length || 0})</span>
              </button>
            </div>

            {/* Tab 1: Profile Details */}
            {activeTab === 'profile' && (
              <div className="space-y-4 text-xs">
                {/* Identification Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-semibold flex items-center space-x-1">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span>Aadhaar Number</span>
                      </span>
                      <button
                        onClick={() => setShowFullAadhaar(!showFullAadhaar)}
                        className="text-slate-400 hover:text-emerald-600 p-0.5"
                        title={showFullAadhaar ? 'Mask Aadhaar' : 'Reveal Aadhaar'}
                      >
                        {showFullAadhaar ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="font-mono text-sm font-bold text-slate-800 tracking-wider">
                      {showFullAadhaar ? employee.aadhaarNumber : maskAadhaar(employee.aadhaarNumber)}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-500 flex items-center space-x-1 mb-1">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>PAN Number</span>
                    </span>
                    <div className="font-mono text-sm font-bold text-slate-800 uppercase">
                      {employee.panNumber}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-500 flex items-center space-x-1 mb-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Official Email</span>
                    </span>
                    <div className="font-medium text-slate-800">{employee.email}</div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-500 flex items-center space-x-1 mb-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Contact Mobile</span>
                    </span>
                    <div className="font-mono text-slate-800 font-semibold">{employee.mobile}</div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-500 flex items-center space-x-1 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date of Birth / Gender</span>
                    </span>
                    <div className="text-slate-800">
                      {formatDate(employee.dateOfBirth)} ({employee.gender})
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-500 flex items-center space-x-1 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Joining Date</span>
                    </span>
                    <div className="text-slate-800 font-semibold">{formatDate(employee.joiningDate)}</div>
                  </div>
                </div>

                {/* Residential Address */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-500 flex items-center space-x-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Permanent Residential Address</span>
                  </span>
                  <p className="text-slate-800 leading-relaxed">{employee.address}</p>
                </div>
              </div>
            )}

            {/* Tab 2: Transfer History Audit Trail */}
            {activeTab === 'transfers' && (
              <div>
                {!employee.transferHistory || employee.transferHistory.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <History className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                    <p className="text-xs">No historical department transfers recorded for this employee.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {employee.transferHistory.map((item) => (
                      <div
                        key={item.id}
                        className="bg-purple-50/50 border border-purple-200/80 rounded-xl p-3.5 text-xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-purple-900">{item.oldDepartmentName}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                            <span className="font-semibold text-purple-900">{item.newDepartmentName}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{formatDate(item.transferDate)}</span>
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 bg-white p-2 rounded-lg border border-purple-100 my-2">
                          <div className="flex-1">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Previous Code</span>
                            <span className="font-mono font-bold text-slate-700">{item.oldEmployeeCode}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300" />
                          <div className="flex-1">
                            <span className="text-[10px] text-purple-600 uppercase font-bold block">Assigned Code</span>
                            <span className="font-mono font-bold text-purple-900">{item.newEmployeeCode}</span>
                          </div>
                        </div>

                        <div className="text-slate-600 mt-1">
                          <strong className="text-slate-700">Reason:</strong> {item.reason}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Authorized by: <span className="font-mono">{item.transferredBy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
