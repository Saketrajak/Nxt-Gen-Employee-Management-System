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
import { UserPlus, Download, RefreshCw, AlertCircle } from 'lucide-react';
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

  // New Data Modals for Stat Card Clicks
  const [isDeptOverviewOpen, setIsDeptOverviewOpen] = useState(false);
  const [isTransferAuditOpen, setIsTransferAuditOpen] = useState(false);

  // Global counts & summaries from API
  const [statsData, setStatsData] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departmentCount: 5,
    transferCount: 0,
    departmentSummaries: [],
  });

  // Fetch Lookups (Departments, Roles)
  useEffect(() => {
    client.get('/api/lookup/departments')
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error('Failed to load departments', err));

    client.get('/api/lookup/roles')
      .then((res) => setRoles(res.data))
      .catch((err) => console.error('Failed to load roles', err));
  }, []);

  // Fetch Organization Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await client.get('/api/lookup/stats');
      setStatsData(res.data);
    } catch (err) {
      // Fallback: fetch transfers count directly
      client.get('/api/transfers')
        .then((tRes) => {
          setStatsData((prev) => ({ ...prev, transferCount: tRes.data.length }));
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
        fetchStats();
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
        fetchStats();
      } catch (err) {
        alert('Delete operation failed: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const canModify = hasRole(['ADMIN', 'MANAGER']);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} onOpenRegister={handleOpenCreate} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* API Error Notification */}
        {apiError && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-start space-x-3 text-xs shadow-sm">
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personnel Directory</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Indian Army Internship Programme 2026 — Process Automation & Application Development Assessment
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => {
                fetchEmployees();
                fetchStats();
              }}
              className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-sm transition"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {canModify && (
              <button
                onClick={handleOpenCreate}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Employee</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Metric Cards */}
        <StatCards
          totalRecords={statsData.totalEmployees || totalElements}
          activeCount={statsData.activeEmployees || 0}
          departmentCount={statsData.departmentCount || departments.length}
          transferCount={statsData.transferCount || 0}
          activeStatus={filters.status}
          activeDepartmentId={filters.departmentId}
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

        {/* Main Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
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
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        <p>Indian Army Internship Programme (IAIP) 2026 • HQ Southern Command • Full Stack Assessment</p>
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
          fetchStats();
        }}
      />

      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        employee={selectedTransferEmployee}
        departments={departments}
        onSuccess={() => {
          fetchEmployees();
          fetchStats();
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
        departmentSummaries={statsData.departmentSummaries}
        selectedDepartmentId={filters.departmentId}
        onSelectDepartment={(deptId) => handleFilterChange({ departmentId: deptId })}
        onClearDepartment={() => handleFilterChange({ departmentId: '' })}
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
