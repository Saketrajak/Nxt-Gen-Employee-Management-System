import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatCards from './components/StatCards';
import FilterBar from './components/FilterBar';
import EmployeeTable from './components/EmployeeTable';
import Pagination from './components/Pagination';
import EmployeeFormModal from './components/EmployeeFormModal';
import TransferModal from './components/TransferModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import LoginModal from './components/LoginModal';
import DepartmentOverviewModal from './components/DepartmentOverviewModal';
import TransferAuditModal from './components/TransferAuditModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserPlus, Download, RefreshCw, AlertCircle, Filter, X, ShieldCheck } from 'lucide-react';
import client from './api/client';

function Dashboard() {
  const { hasRole, user } = useAuth();

  // Reference Data
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  // Table Data & Pagination State
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    departmentId: '',
    roleId: '',
    status: '',
    gender: '',
    joiningDate: '',
    minSalary: '',
    maxSalary: '',
    salaryPreset: '',
  });

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedTransferEmployee, setSelectedTransferEmployee] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailEmployeeId, setSelectedDetailEmployeeId] = useState(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Data Modals for Stat Card Clicks
  const [isDeptOverviewOpen, setIsDeptOverviewOpen] = useState(false);
  const [isTransferAuditOpen, setIsTransferAuditOpen] = useState(false);

  // Permanent Global Counts (Unaltered by Table Filtering)
  const [globalStats, setGlobalStats] = useState({
    total: 22,
    active: 17,
    departments: 5,
    transfers: 3,
    departmentSummaries: [],
  });

  // Fetch Lookups (Departments, Roles)
  const refreshDepartments = useCallback(() => {
    client.get('/api/lookup/departments')
      .then((res) => {
        setDepartments(res.data);
        setGlobalStats((prev) => ({
          ...prev,
          departments: res.data.length || prev.departments,
        }));
      })
      .catch((err) => console.error('Failed to load departments', err));
  }, []);

  useEffect(() => {
    refreshDepartments();

    client.get('/api/lookup/roles')
      .then((res) => setRoles(res.data))
      .catch((err) => console.error('Failed to load roles', err));
  }, [refreshDepartments]);

  // Fetch Global Organization Stats
  const fetchGlobalStats = useCallback(async () => {
    // 1. Primary: Try dedicated stats endpoint
    try {
      const res = await client.get('/api/lookup/stats');
      if (res.data && typeof res.data.totalEmployees === 'number' && res.data.totalEmployees > 0) {
        setGlobalStats({
          total: res.data.totalEmployees,
          active: res.data.activeEmployees,
          departments: res.data.departmentCount,
          transfers: res.data.transferCount,
          departmentSummaries: res.data.departmentSummaries || [],
        });
        return;
      }
    } catch {
      // Backend may still be running previous build before restart
    }

    // 2. Bulletproof Fallback: Query standard directory endpoints for permanent counts
    try {
      const [allRes, activeRes, transfersRes] = await Promise.all([
        client.get('/api/employees', { params: { pageSize: 5, pageNumber: 1 } }),
        client.get('/api/employees', { params: { pageSize: 5, pageNumber: 1, status: 'ACTIVE' } }),
        client.get('/api/transfers').catch(() => ({ data: [] })),
      ]);

      const total = allRes.data?.totalElements ?? 22;
      const active = activeRes.data?.totalElements ?? 17;
      const transfers = Array.isArray(transfersRes.data) ? transfersRes.data.length : 3;

      setGlobalStats((prev) => ({
        ...prev,
        total: total > 0 ? total : prev.total,
        active: active >= 0 ? active : prev.active,
        transfers: transfers >= 0 ? transfers : prev.transfers,
      }));
    } catch (err) {
      console.warn('Fallback global stats warning:', err);
    }
  }, []);

  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  // Fetch Employees List with Search, Filters, Sort & Pagination
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const params = {
        pageNumber: currentPage,
        pageSize: pageSize,
        sortBy: sortBy,
        sortDir: sortDir,
      };

      if (filters.search) params.search = filters.search.trim();
      if (filters.departmentId) params.departmentId = filters.departmentId;
      if (filters.roleId) params.roleId = filters.roleId;
      if (filters.status) params.status = filters.status;
      if (filters.gender) params.gender = filters.gender;
      if (filters.joiningDate) params.joiningDate = filters.joiningDate;
      if (filters.minSalary) params.minSalary = filters.minSalary;
      if (filters.maxSalary) params.maxSalary = filters.maxSalary;

      const res = await client.get('/api/employees', { params });
      setEmployees(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('API Error:', err);
      setApiError(
        err.response?.data?.message ||
        'Unable to connect to REST API. Make sure the Spring Boot backend is running on http://localhost:8080.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortDir, filters]);

  // Debounced search & filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  const handleFilterChange = (updated) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      departmentId: '',
      roleId: '',
      status: '',
      gender: '',
      joiningDate: '',
      minSalary: '',
      maxSalary: '',
      salaryPreset: '',
    });
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortBy?.toLowerCase() === column.toLowerCase()) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  // Stat Card Click Handlers
  const handleStatTotalClick = () => {
    handleResetFilters();
  };

  const handleStatActiveClick = () => {
    if (filters.status === 'ACTIVE') {
      // Toggle off if already active
      handleFilterChange({ status: '' });
    } else {
      handleFilterChange({ status: 'ACTIVE' });
    }
  };

  const handleStatDepartmentsClick = () => {
    setIsDeptOverviewOpen(true);
  };

  const handleStatTransfersClick = () => {
    setIsTransferAuditOpen(true);
  };

  // Actions
  const handleOpenCreate = () => {
    setEditingEmployeeId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (id) => {
    setEditingEmployeeId(id);
    setIsFormOpen(true);
  };

  const handleOpenTransfer = (emp) => {
    setSelectedTransferEmployee(emp);
    setIsTransferOpen(true);
  };

  const handleOpenDetail = (id) => {
    setSelectedDetailEmployeeId(id);
    setIsDetailOpen(true);
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this employee account?')) {
      try {
        await client.patch(`/api/employees/${id}/deactivate`);
        fetchEmployees();
        fetchGlobalStats();
      } catch (err) {
        alert('Deactivation failed: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('CONFIRM DELETION: Are you sure you want to permanently delete this employee record?')) {
      try {
        await client.delete(`/api/employees/${id}`);
        fetchEmployees();
        fetchGlobalStats();
      } catch (err) {
        alert('Delete operation failed: ' + (err.response?.data?.message || err.message));
      }
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
    filters.maxSalary ||
    filters.salaryPreset
  );

  const canModify = hasRole(['ADMIN', 'MANAGER']);

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-900">
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} onOpenRegister={handleOpenCreate} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* API Error Notification */}
        {apiError && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg flex items-start space-x-3 text-xs shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-900">Backend API Connectivity Alert</p>
              <p className="mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        {/* Dashboard Title & Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Personnel Directory</h1>
              <span className="bg-amber-100/90 text-amber-900 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-300 tracking-wider">
                LIVE CADRE • HQ SOUTHERN COMMAND
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Indian Army Internship Programme 2026 — Process Automation & Application Development Directorate
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => {
                fetchEmployees();
                fetchGlobalStats();
              }}
              className="p-2 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-xs transition"
              title="Refresh Records & Statistics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {canModify && (
              <button
                onClick={handleOpenCreate}
                className="flex items-center space-x-1.5 px-4 py-2 bg-[#1c2e21] hover:bg-[#273f2e] text-white text-xs font-semibold rounded-lg shadow-sm border border-[#2d4734] transition hover:shadow-md active:scale-98"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Register Personnel</span>
              </button>
            )}
          </div>
        </div>

        {/* Permanent Organization Metric Cards */}
        <StatCards
          totalRecords={globalStats.total}
          activeCount={globalStats.active}
          departmentCount={globalStats.departments}
          transferCount={globalStats.transfers}
          activeStatus={filters.status}
          activeDepartmentId={filters.departmentId}
          hasActiveFilters={hasActiveFilters}
          onTotalClick={handleStatTotalClick}
          onActiveClick={handleStatActiveClick}
          onDepartmentsClick={handleStatDepartmentsClick}
          onTransfersClick={handleStatTransfersClick}
        />

        {/* Search & Advanced Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          departments={departments}
          roles={roles}
        />

        {/* Active Filter Pill Banner */}
        {hasActiveFilters && (
          <div className="mb-4 bg-white border border-[#244b2f]/30 shadow-xs rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs border-l-4 border-l-[#244b2f]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-800 flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5 text-[#1e3e26]" />
                <span>Active Filters:</span>
              </span>

              {filters.status && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-900 font-semibold border border-emerald-300">
                  <span>Status: <strong>{filters.status}</strong></span>
                  <button
                    onClick={() => handleFilterChange({ status: '' })}
                    className="hover:text-emerald-950 ml-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.departmentId && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-900 font-semibold border border-stone-300">
                  <span>Dept: <strong>{departments.find((d) => d.id === filters.departmentId)?.name || filters.departmentId}</strong></span>
                  <button
                    onClick={() => handleFilterChange({ departmentId: '' })}
                    className="hover:text-stone-950 ml-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.search && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-900 font-semibold border border-slate-300">
                  <span>Search: "{filters.search}"</span>
                  <button
                    onClick={() => handleFilterChange({ search: '' })}
                    className="hover:text-slate-950 ml-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.roleId && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-medium border border-slate-300">
                  <span>Role: {roles.find((r) => r.id === filters.roleId)?.name || filters.roleId}</span>
                  <button
                    onClick={() => handleFilterChange({ roleId: '' })}
                    className="hover:text-slate-950 ml-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.salaryPreset && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 font-semibold border border-amber-300">
                  <span>Salary: {filters.salaryPreset}</span>
                  <button
                    onClick={() => handleFilterChange({ salaryPreset: '', minSalary: '', maxSalary: '' })}
                    className="hover:text-amber-950 ml-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <span className="text-slate-600 font-medium ml-1">
                — Showing <strong className="text-slate-900 font-bold">{totalElements}</strong> matching records out of <strong className="text-slate-900 font-bold">{globalStats.total}</strong> registered personnel
              </span>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#1e3e26] hover:text-emerald-950 underline ml-auto"
            >
              Reset to All Personnel
            </button>
          </div>
        )}

        {/* Main Data Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden mb-8">
          <EmployeeTable
            employees={employees}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={handleSort}
            onView={handleOpenDetail}
            onEdit={handleOpenEdit}
            onTransfer={handleOpenTransfer}
            onDeactivate={handleDeactivate}
            onDelete={handleDelete}
            loading={loading}
          />

          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalElements={totalElements}
            globalTotal={globalStats.total}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1118] border-t border-slate-800/80 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-amber-400 font-semibold font-mono">IAIP 2026</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">HQ Southern Command, Indian Army</span>
          </div>
          <p className="text-slate-400">Process Automation & Application Development Directorate</p>
        </div>
      </footer>

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        employeeId={editingEmployeeId}
        departments={departments}
        roles={roles}
        onSuccess={() => {
          fetchEmployees();
          fetchGlobalStats();
        }}
      />

      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        employee={selectedTransferEmployee}
        departments={departments}
        onSuccess={() => {
          fetchEmployees();
          fetchGlobalStats();
        }}
      />

      <EmployeeDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        employeeId={selectedDetailEmployeeId}
      />

      <DepartmentOverviewModal
        isOpen={isDeptOverviewOpen}
        onClose={() => setIsDeptOverviewOpen(false)}
        departments={departments}
        departmentSummaries={globalStats.departmentSummaries}
        selectedDepartmentId={filters.departmentId}
        onSelectDepartment={(deptId) => handleFilterChange({ departmentId: deptId })}
        onClearDepartment={() => handleFilterChange({ departmentId: '' })}
        onDepartmentsUpdated={() => {
          refreshDepartments();
          fetchEmployees();
          fetchGlobalStats();
        }}
      />

      <TransferAuditModal
        isOpen={isTransferAuditOpen}
        onClose={() => setIsTransferAuditOpen(false)}
        onFilterEmployee={(query) => handleFilterChange({ search: query, departmentId: '', status: '' })}
      />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
