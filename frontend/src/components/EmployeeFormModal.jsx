import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { formatAadhaarInput, isValidAadhaar, isValidPAN } from '../utils/formatters';
import client from '../api/client';

export default function EmployeeFormModal({
  isOpen,
  onClose,
  employeeId,
  departments,
  roles,
  onSuccess,
}) {
  const isEdit = Boolean(employeeId);

  const initialForm = {
    fullName: '',
    email: '',
    mobile: '',
    aadhaarNumber: '',
    panNumber: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    departmentId: departments[0]?.id || 1,
    roleId: roles[0]?.id || 3,
    status: 'ACTIVE',
    joiningDate: new Date().toISOString().split('T')[0],
    annualSalary: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [previewCode, setPreviewCode] = useState('');

  // Fetch preview code when department changes (create mode)
  useEffect(() => {
    if (!isEdit && formData.departmentId) {
      client.get(`/api/lookup/preview-code/${formData.departmentId}`)
        .then((res) => setPreviewCode(res.data.nextEmployeeCode))
        .catch(() => setPreviewCode(''));
    }
  }, [formData.departmentId, isEdit]);

  // Load employee data if editing
  useEffect(() => {
    if (isEdit && employeeId) {
      setLoadingInitial(true);
      client.get(`/api/employees/${employeeId}`)
        .then((res) => {
          const data = res.data;
          setFormData({
            fullName: data.fullName || '',
            email: data.email || '',
            mobile: data.mobile || '',
            aadhaarNumber: data.aadhaarNumber || '',
            panNumber: data.panNumber || '',
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || 'Male',
            address: data.address || '',
            departmentId: data.departmentId || 1,
            roleId: data.roleId || 3,
            status: data.status || 'ACTIVE',
            joiningDate: data.joiningDate || '',
            annualSalary: data.annualSalary || '',
          });
        })
        .catch((err) => {
          setServerError('Failed to load employee details: ' + (err.response?.data?.message || err.message));
        })
        .finally(() => setLoadingInitial(false));
    } else {
      setFormData(initialForm);
    }
    setErrors({});
    setServerError('');
  }, [isOpen, employeeId]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};

    // 1. Name: Required, alphabets and spaces only
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is mandatory.';
    } else if (!/^[a-zA-Z\s.]+$/.test(formData.fullName.trim())) {
      errs.fullName = 'Full Name must only contain alphabetic characters and spaces.';
    }

    // 2. Email: Valid RFC format
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format.';
    }

    // 3. Mobile: Exactly 10 digits
    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile Number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      errs.mobile = 'Mobile must be a valid 10-digit Indian mobile number.';
    }

    // 4. Aadhaar: Exactly 12 digits formatted XXXX-XXXX-XXXX
    if (!formData.aadhaarNumber.trim()) {
      errs.aadhaarNumber = 'Aadhaar Number is mandatory.';
    } else if (!isValidAadhaar(formData.aadhaarNumber)) {
      errs.aadhaarNumber = 'Aadhaar must contain exactly 12 digits (XXXX-XXXX-XXXX).';
    }

    // 5. PAN: Format ABCDE1234F
    if (!formData.panNumber.trim()) {
      errs.panNumber = 'PAN Card Number is mandatory.';
    } else if (!isValidPAN(formData.panNumber)) {
      errs.panNumber = 'PAN must be valid uppercase format (e.g. ABCDE1234F).';
    }

    // 6. Date of Birth: Cannot be future date
    if (!formData.dateOfBirth) {
      errs.dateOfBirth = 'Date of Birth is required.';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob >= today) {
        errs.dateOfBirth = 'Date of Birth cannot be a future date.';
      }
    }

    // 7. Salary: Greater than zero
    if (!formData.annualSalary || Number(formData.annualSalary) <= 0) {
      errs.annualSalary = 'Annual Salary must be greater than zero.';
    }

    // 8. Mandatory Address
    if (!formData.address.trim()) {
      errs.address = 'Residential Address is required.';
    }

    // 9. Joining Date
    if (!formData.joiningDate) {
      errs.joiningDate = 'Joining Date is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEdit) {
        await client.put(`/api/employees/${employeeId}`, formData);
      } else {
        await client.post('/api/employees', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      const validationErrs = err.response?.data?.validationErrors;
      if (validationErrs && Object.keys(validationErrs).length > 0) {
        setErrors(validationErrs);
        setServerError(serverMsg || 'Please correct the highlighted duplicate or invalid entries below.');
      } else if (serverMsg) {
        setServerError(serverMsg);
      } else {
        setServerError('Error saving employee: ' + err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAadhaarChange = (e) => {
    const formatted = formatAadhaarInput(e.target.value);
    setFormData({ ...formData, aadhaarNumber: formatted });
    if (errors.aadhaarNumber) {
      setErrors((prev) => ({ ...prev, aadhaarNumber: undefined }));
    }
    if (serverError) setServerError('');
  };

  const handlePanChange = (e) => {
    setFormData({ ...formData, panNumber: e.target.value.toUpperCase().slice(0, 10) });
    if (errors.panNumber) {
      setErrors((prev) => ({ ...prev, panNumber: undefined }));
    }
    if (serverError) setServerError('');
  };

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (serverError) setServerError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-navy-950 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {isEdit ? 'Edit Employee Details' : 'Register New Employee'}
            </h2>
            <p className="text-xs text-slate-400">
              {isEdit ? 'Update employee personal and employment information' : 'Create personnel record with automated department code sequence'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {loadingInitial ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent"></div>
            <p className="mt-2 text-sm">Loading personnel data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Server Error / Duplicate Warning Banner */}
            {serverError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start space-x-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{serverError}</span>
              </div>
            )}

            {/* Auto Code Generation Notice (Create mode) */}
            {!isEdit && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Auto-generated Employee Code for this department:{' '}
                    <strong className="font-mono text-sm text-emerald-700">{previewCode || 'Calculating...'}</strong>
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-medium bg-emerald-100/60 px-2 py-0.5 rounded">
                  Atomic Sequence
                </span>
              </div>
            )}

            {/* Section 1: Employment Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Employment Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Department (Disabled in Edit Mode - transfer workflow required) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department * {isEdit && <span className="text-[10px] text-amber-600">(Use Transfer)</span>}
                  </label>
                  <select
                    disabled={isEdit}
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.codePrefix})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Role *</label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PROBATION">PROBATION</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="TERMINATED">TERMINATED</option>
                  </select>
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Joining Date *</label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.joiningDate && <p className="text-[11px] text-rose-500 mt-0.5">{errors.joiningDate}</p>}
                </div>

                {/* Annual Salary */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Salary (INR ₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 750000"
                    value={formData.annualSalary}
                    onChange={(e) => setFormData({ ...formData, annualSalary: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.annualSalary && <p className="text-[11px] text-rose-500 mt-0.5">{errors.annualSalary}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Personal Identification */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Personal & Identity Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name (Alphabets only) *</label>
                  <input
                    type="text"
                    placeholder="e.g. Major Vikram Rathore"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-500 mt-0.5">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Unique) *</label>
                  <input
                    type="email"
                    placeholder="e.g. vikram.rathore@iaip.gov.in"
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                      errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (10 Digits) *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  {errors.mobile && <p className="text-[11px] text-rose-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Aadhaar Number with Auto-Formatting */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aadhaar Number (Unique, Auto-hyphenated) *
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="XXXX-XXXX-XXXX"
                    value={formData.aadhaarNumber}
                    onChange={handleAadhaarChange}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono tracking-wider ${
                      errors.aadhaarNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.aadhaarNumber && <p className="text-[11px] text-rose-500 mt-0.5">{errors.aadhaarNumber}</p>}
                </div>

                {/* PAN Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PAN Card Number (Unique, ABCDE1234F) *
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    value={formData.panNumber}
                    onChange={handlePanChange}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono uppercase ${
                      errors.panNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.panNumber && <p className="text-[11px] text-rose-500 mt-0.5">{errors.panNumber}</p>}
                </div>

                {/* Date of Birth & Gender */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.dateOfBirth && <p className="text-[11px] text-rose-500 mt-0.5">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Residential Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address *</label>
                  <textarea
                    rows={2}
                    placeholder="House/Plot No, Street, City, State, PIN"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.address && <p className="text-[11px] text-rose-500 mt-0.5">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
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
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
              >
                {submitting ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{isEdit ? 'Save Changes' : 'Confirm Registration'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
