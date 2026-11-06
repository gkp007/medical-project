/**
 * Unified API Client for Labsmart LIS Backend
 * Connects frontend UI components to Express REST endpoints (/api/v1)
 */

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL
  ? String((import.meta as any).env.VITE_API_BASE_URL).replace(/\/$/, '')
  : '/api/v1';

// Token Management
export const getAuthToken = (): string => {
  return localStorage.getItem('labsmart_auth_token') || '';
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('labsmart_auth_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('labsmart_auth_token');
};

export function toQueryString(query?: Record<string, any>): string {
  if (!query) return '';
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '' && value !== 'undefined' && value !== 'ALL') {
      searchParams.append(key, String(value));
    }
  }
  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; status?: string; data?: T; error?: any; message?: string }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const branchId = localStorage.getItem('labsmart_active_branch') || 'main';
  headers['X-Branch-Id'] = branchId;

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Auto-relogin in demo/dev mode if token is missing/expired
      console.warn('Authentication expired or missing, attempting auto-handshake...');
    }

    const data = await response.json();
    if (data && data.success && !data.status) {
      data.status = 'success';
    }
    return data;
  } catch (err: any) {
    console.error(`API Request Error [${endpoint}]:`, err);
    return {
      success: false,
      status: 'error',
      message: err.message || 'Network communication error',
    };
  }
}

// -------------------------------------------------------------
// 1. Auth & Session API
// -------------------------------------------------------------
export const authApi = {
  login: async (username: string = 'admin', password: string = 'LabSmart@2026') => {
    const res = await request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res.success && res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },
  register: async (data: {
    clinicName: string;
    fullName: string;
    username: string;
    email: string;
    mobile: string;
    password: string;
    planTier?: string;
    modality?: string;
  }) => {
    const res = await request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },
  me: () => request<any>('/auth/me'),
  logout: async () => {
    const res = await request<any>('/auth/logout', { method: 'POST' });
    clearAuthToken();
    return res;
  },
  sendVerificationEmail: (email?: string) =>
    request<any>('/auth/send-verification-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  verifyEmail: (token: string) =>
    request<any>(`/auth/verify-email?token=${encodeURIComponent(token)}`),
  forgotPassword: (identifier: string) =>
    request<any>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    }),
  resetPassword: (token: string, newPassword: string) =>
    request<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
  lockTerminal: () => request<any>('/auth/lock-terminal', { method: 'POST' }),
  unlockTerminal: (pin: string) =>
    request<any>('/auth/unlock-terminal', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    }),
  createSupportTicket: (data: { category: string; subject: string; description: string; priority?: string }) =>
    request<any>('/auth/support-ticket', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};


// -------------------------------------------------------------
// 2. Shell & Global Navigation API
// -------------------------------------------------------------
export const shellApi = {
  getContext: (branchId?: string) =>
    request<any>(`/shell/context${branchId ? `?branchId=${branchId}` : ''}`),

  omnisearch: (query: string, limit: number = 10) =>
    request<any>(`/shell/omnisearch?q=${encodeURIComponent(query)}&limit=${limit}`),

  createTicket: (ticket: {
    category: string;
    subject: string;
    description: string;
    urgency: string;
    contactNumber?: string;
  }) =>
    request<any>('/shell/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    }),

  rechargeCredits: (packId: string, customAmount?: number) =>
    request<any>('/shell/recharge-sms', {
      method: 'POST',
      body: JSON.stringify({ packId, customAmount }),
    }),
};

// -------------------------------------------------------------
// 3. Cases & Billing Engine API
// -------------------------------------------------------------
export const casesApi = {
  listCases: (query: any = {}) => {
    return request<any>(`/cases${toQueryString(query)}`);
  },

  getCaseById: (id: string) => request<any>(`/cases/${id}`),

  createCase: (caseData: any) =>
    request<any>('/cases', {
      method: 'POST',
      body: JSON.stringify(caseData),
    }),

  getBarcodes: (id: string) => request<any>(`/cases/${id}/barcodes`),

  getPrintableBill: (id: string, layout: 'A4' | 'A5' | 'thermal' = 'A4') =>
    request<any>(`/cases/${id}/bill-pdf?layout=${layout}`),

  collectDue: (caseId: string, amount: number, mode: string = 'Cash', note?: string) =>
    request<any>('/payments/collect-due', {
      method: 'POST',
      body: JSON.stringify({ caseId, amount, mode, note }),
    }),

  cancelCase: (caseId: string, reason: string) =>
    request<any>(`/cases/${caseId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

// -------------------------------------------------------------
// 4. Lab (Pathology) Diagnostics API
// -------------------------------------------------------------
export const pathologyApi = {
  getWorklist: (query: any = {}) => {
    const params = new URLSearchParams(query).toString();
    return request<any>(`/pathology/today${params ? `?${params}` : ''}`);
  },

  getParams: (caseId: string) => request<any>(`/pathology/cases/${caseId}/params`),

  saveDraft: (caseId: string, parameters: any[], interpretation?: string) =>
    request<any>(`/pathology/cases/${caseId}/draft`, {
      method: 'POST',
      body: JSON.stringify({ parameters, interpretation }),
    }),

  signoff: (caseId: string, pathologistNotes?: string) =>
    request<any>(`/pathology/cases/${caseId}/signoff`, {
      method: 'POST',
      body: JSON.stringify({ pathologistNotes }),
    }),

  getReportPdf: (caseId: string) => request<any>(`/pathology/cases/${caseId}/report-pdf`),
  emailReport: (caseId: string, email?: string) =>
    request<any>(`/pathology/cases/${caseId}/email-report`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  getInterpretations: (query: any = {}) => {
    const params = new URLSearchParams(query).toString();
    return request<any>(`/pathology/interpretations${params ? `?${params}` : ''}`);
  },

  getTestCounts: (query: any = {}) => {
    const params = new URLSearchParams(query).toString();
    return request<any>(`/pathology/test-counts${params ? `?${params}` : ''}`);
  },
};

// -------------------------------------------------------------
// 5. USG & Digital X-Ray Radiology API
// -------------------------------------------------------------
export const radiologyApi = {
  getUsgWorklist: (query: any = {}) => {
    const params = new URLSearchParams(query).toString();
    return request<any>(`/usg/worklist${params ? `?${params}` : ''}`);
  },

  saveUsgFindings: (caseId: string, data: any) =>
    request<any>(`/usg/cases/${caseId}/findings`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getXrayWorklist: (query: any = {}) => {
    const params = new URLSearchParams(query).toString();
    return request<any>(`/xray/worklist${params ? `?${params}` : ''}`);
  },

  saveXrayFindings: (caseId: string, data: any) =>
    request<any>(`/xray/cases/${caseId}/findings`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getReport: (caseId: string) => request<any>(`/radiology/cases/${caseId}/report`),

  getTemplates: (modality?: string) =>
    request<any>(`/radiology/templates${modality ? `?modality=${modality}` : ''}`),

  getSignatures: () => request<any>('/radiology/signatures'),
};

// -------------------------------------------------------------
// 6. Business, Financials & Commissions API
// -------------------------------------------------------------
export const businessApi = {
  getDashboardMetrics: () => request<any>('/business/dashboard-metrics'),

  getDailySummary: (date?: string) =>
    request<any>(`/business/daily-summary${date ? `?date=${date}` : ''}`),

  getDailyReport: (date?: string) =>
    request<any>(`/business/daily-report${date ? `?date=${date}` : ''}`),

  emailDailyReport: (date?: string, email?: string) =>
    request<any>('/business/email-report', {
      method: 'POST',
      body: JSON.stringify({ date, email }),
    }),

  getDuesAging: () => request<any>('/business/dues-aging'),

  listExpenses: (query: any = {}) => {
    const params = new URLSearchParams(query).toString();
    return request<any>(`/business/expenses${params ? `?${params}` : ''}`);
  },

  createExpense: (expense: any) =>
    request<any>('/business/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    }),

  deleteExpense: (id: string) =>
    request<any>(`/business/expenses/${id}`, {
      method: 'DELETE',
    }),

  getReferralStatements: (query: any = {}) => {
    const params = new URLSearchParams(query).toString();
    return request<any>(`/business/referral-statements${params ? `?${params}` : ''}`);
  },

  settleDoctorPayout: (doctorId: string, payoutData: any) =>
    request<any>(`/business/doctors/${doctorId}/settle`, {
      method: 'POST',
      body: JSON.stringify(payoutData),
    }),

  getExportUrl: (type: 'cases' | 'patients' | 'expenses') => `/api/v1/business/export?type=${type}`,

  downloadExport: async (type: string, fromDate?: string, toDate?: string, fileName?: string): Promise<void> => {
    const token = getAuthToken();
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);

    const branchId = localStorage.getItem('labsmart_active_branch') || 'main';
    const response = await fetch(`${API_BASE}/business/export?${params.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-Branch-Id': branchId,
      },
    });

    if (!response.ok) {
      throw new Error(`Export download failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || `${type}_${fromDate || 'all'}_to_${toDate || 'today'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

// -------------------------------------------------------------
// 7. Settings & Masters API
// -------------------------------------------------------------
export const settingsApi = {
  getSettings: () => request<any>('/settings'),
  updateSettings: (data: any) =>
    request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getSecurity: () => request<any>('/settings/security'),
  sendTestSms: (mobile: string) =>
    request<any>('/settings/test-sms', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    }),
  sendTestEmail: (email?: string) =>
    request<any>('/settings/test-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};


export const mastersApi = {
  listTests: (query: any = {}) => {
    const params = new URLSearchParams(query).toString();
    return request<any>(`/masters/tests${params ? `?${params}` : ''}`);
  },
  listPackages: () => request<any>('/masters/packages'),
  listPanels: () => request<any>('/masters/panels'),
  listCategories: () => request<any>('/masters/categories'),
  listAgents: () => request<any>('/masters/agents'),
};

// -------------------------------------------------------------
// 8. Subscription & Plans API
// -------------------------------------------------------------
export const subscriptionApi = {
  getPlans: () => request<any>('/subscription/plans'),
  getCurrent: () => request<any>('/subscription/current'),
  subscribe: (data: {
    planTier: string;
    billingCycle?: 'MONTHLY' | 'ANNUAL';
    paymentMethod?: string;
    transactionRef?: string;
  }) =>
    request<any>('/subscription/subscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  cancel: () => request<any>('/subscription/cancel', { method: 'POST' }),
};

// -------------------------------------------------------------
// 9. Patients API
// -------------------------------------------------------------
export const patientApi = {
  listPatients: (query: any = {}) => {
    const params = new URLSearchParams(query).toString();
    return request<any>(`/patients${params ? `?${params}` : ''}`);
  },
  getPatientById: (id: string) => request<any>(`/patients/${id}`),
  createPatient: (data: any) =>
    request<any>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePatient: (id: string, data: any) =>
    request<any>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  archivePatient: (id: string) =>
    request<any>(`/patients/${id}/archive`, {
      method: 'PATCH',
    }),
  getMedicalHistory: (id: string) => request<any>(`/patients/${id}/history`),
};

// -------------------------------------------------------------
// 10. Doctors & Referrers API
// -------------------------------------------------------------
export const doctorApi = {
  listDoctors: (query: any = {}) => {
    const params = new URLSearchParams(query).toString();
    return request<any>(`/doctors${params ? `?${params}` : ''}`);
  },
  createDoctor: (data: any) =>
    request<any>('/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateDoctor: (id: string, data: any) =>
    request<any>(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  toggleDoctorStatus: (id: string) =>
    request<any>(`/doctors/${id}/toggle-status`, {
      method: 'PATCH',
    }),
  togglePortalAccess: (id: string) =>
    request<any>(`/doctors/${id}/toggle-portal`, {
      method: 'PATCH',
    }),
  recordPayout: (data: any) =>
    request<any>('/doctors/payout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// -------------------------------------------------------------
// 11. Employee Administration & RBAC API
// -------------------------------------------------------------
export const employeeApi = {
  listEmployees: () => request<any>('/auth/employees'),
  createEmployee: (data: any) =>
    request<any>('/auth/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  toggleEmployeeStatus: (id: string) =>
    request<any>(`/auth/employees/${id}/toggle-status`, {
      method: 'PATCH',
    }),
};

// -------------------------------------------------------------
// 12. Terminal Hardware & Browser Security API
// -------------------------------------------------------------
export const securityApi = {
  listDevices: () => request<any>('/security/devices'),
  registerDevice: (data: any) =>
    request<any>('/security/devices/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  toggleBlockDevice: (id: string) =>
    request<any>(`/security/devices/${id}/toggle-block`, {
      method: 'PATCH',
    }),
  renameDevice: (id: string, name: string) =>
    request<any>(`/security/devices/${id}/rename`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }),
  verifyBrowser: (browserCode: string, ipAddress?: string) =>
    request<any>('/security/verify-browser', {
      method: 'POST',
      body: JSON.stringify({ browserCode, ipAddress }),
    }),
};

// -------------------------------------------------------------
// 13. Payments & Cashier Till API
// -------------------------------------------------------------
export const paymentsApi = {
  listTransactions: (query: any = {}) => {
    const params = new URLSearchParams(query).toString();
    return request<any>(`/payments/transactions${params ? `?${params}` : ''}`);
  },
  updateTransaction: (id: string, data: any) =>
    request<any>(`/payments/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  collectDue: (caseIdOrData: string | { caseId: string; amount: number; mode?: string; receivedBy?: string; note?: string }, amount?: number, mode: string = 'Cash', note?: string) => {
    const payload = typeof caseIdOrData === 'object'
      ? caseIdOrData
      : { caseId: caseIdOrData, amount, mode, note };
    return request<any>('/payments/collect-due', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  startShift: (counterDesk?: string, openingFloat?: number) =>
    request<any>('/payments/cashier-shift/start', {
      method: 'POST',
      body: JSON.stringify({ counterDesk, openingFloat }),
    }),
  closeShift: (closingCashActual: number, notes?: string) =>
    request<any>('/payments/cashier-shift/close', {
      method: 'POST',
      body: JSON.stringify({ closingCashActual, notes }),
    }),
};

// -------------------------------------------------------------
// ANALYZER MACHINE LIS API (ASTM / HL7 Interfacing)
// -------------------------------------------------------------
export const analyzerApi = {
  listAnalyzers: () => request<any>('/analyzers'),
  getAnalyzer: (id: string) => request<any>(`/analyzers/${id}`),
  createAnalyzer: (data: any) =>
    request<any>('/analyzers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAnalyzer: (id: string, data: any) =>
    request<any>(`/analyzers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  saveMappings: (id: string, mappings: any[]) =>
    request<any>(`/analyzers/${id}/mappings`, {
      method: 'PUT',
      body: JSON.stringify({ mappings }),
    }),
  getTransmissions: (limit = 50) => request<any>(`/analyzers/transmissions?limit=${limit}`),
  simulateRun: (analyzerId: string, sampleBarcode: string, scenario: 'NORMAL' | 'ABNORMAL' = 'NORMAL') =>
    request<any>('/analyzers/simulate', {
      method: 'POST',
      body: JSON.stringify({ analyzerId, sampleBarcode, scenario }),
    }),
  getPendingResultsForCase: (caseId: string) => request<any>(`/analyzers/pending/${caseId}`),
};

// -------------------------------------------------------------
// PUBLIC PATIENT PORTAL API (Self-Service Diagnostics & Tracking)
// -------------------------------------------------------------
export const publicApi = {
  trackCase: (query: string) =>
    request<any>(`/cases/public/track?query=${encodeURIComponent(query)}`),
  getReport: (caseId: string, layout: string = 'A4') =>
    request<any>(`/cases/public/report/${caseId}?layout=${layout}`),
  bookAppointment: (data: {
    fullName: string;
    mobile: string;
    age?: number;
    gender?: string;
    serviceType: string;
    address?: string;
    preferredDate?: string;
    preferredTime?: string;
    doctorName?: string;
    tests?: string[];
    totalAmount?: number;
    notes?: string;
  }) =>
    request<any>('/cases/public/book-appointment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  listTests: () => request<any>('/masters/public/tests'),
  listDoctors: () => request<any>('/doctors/public'),
};


