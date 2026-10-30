// Indian Rupee Currency Formatter
export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Auto-format Aadhaar to XXXX-XXXX-XXXX while typing
export const formatAadhaarInput = (value) => {
  if (!value) return '';
  // Strip non-digits and cap at 12 digits
  const digits = value.replace(/\D/g, '').substring(0, 12);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.substring(i, i + 4));
  }
  return parts.join('-');
};

// Validate 12-digit Aadhaar
export const isValidAadhaar = (aadhaar) => {
  if (!aadhaar) return false;
  const digits = aadhaar.replace(/\D/g, '');
  return digits.length === 12;
};

// Validate PAN format (5 letters, 4 digits, 1 letter)
export const isValidPAN = (pan) => {
  if (!pan) return false;
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase());
};

// Mask Aadhaar: XXXX-XXXX-1234
export const maskAadhaar = (aadhaar) => {
  if (!aadhaar) return '';
  const digits = aadhaar.replace(/\D/g, '');
  if (digits.length !== 12) return aadhaar;
  return `XXXX-XXXX-${digits.substring(8)}`;
};

// Format Date (e.g. 25 Jan 2024)
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

// Status Badge Styling Helper
export const getStatusBadgeClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'PROBATION':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'INACTIVE':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'TERMINATED':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};
