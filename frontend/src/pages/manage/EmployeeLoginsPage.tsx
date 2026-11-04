import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/atoms/Select';
import { Badge } from '../../components/atoms/Badge';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import { employeeApi } from '../../services/api';
import { 
  Plus, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Check, 
  Play, 
  Shield, 
  Key, 
  Lock, 
  Unlock, 
  MoreVertical, 
  Trash2, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  UserCheck
} from 'lucide-react';

export interface Employee {
  id: string;
  name: string;
  mobile: string;
  isMobileVerified: boolean;
  email: string;
  isEmailVerified: boolean;
  registeredOn: string;
  role: string;
  isOwner: boolean;
  isBlocked: boolean;
  permissions: {
    canEditRates: boolean;
    canDeleteBills: boolean;
    canSignOffReports: boolean;
    canViewLedger: boolean;
    canManageExpenses: boolean;
    canIssueRefunds: boolean;
  };
}

export const EmployeeLoginsPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await employeeApi.listEmployees();
      if (res.status === 'success' && Array.isArray(res.data)) {
        const mapped: Employee[] = res.data.map((u: any) => ({
          id: u.id,
          name: u.fullName || u.username,
          mobile: u.username || '+91 Internal',
          isMobileVerified: true,
          email: u.email,
          isEmailVerified: true,
          registeredOn: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active',
          role: u.role,
          isOwner: u.role === 'SUPER_ADMIN' || u.role === 'ADMIN',
          isBlocked: !u.isActive,
          permissions: {
            canEditRates: Boolean(u.canAuditMaster),
            canDeleteBills: Boolean(u.canAuditMaster),
            canSignOffReports: Boolean(u.canAuthorize),
            canViewLedger: Boolean(u.canBilling),
            canManageExpenses: Boolean(u.canDoctorPayouts),
            canIssueRefunds: Boolean(u.canBilling),
          }
        }));
        setEmployees(mapped);
      }
    } catch (err) {
      console.error('Failed to load employees', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const [activeTab, setActiveTab] = useState<'active' | 'blocked'>('active');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isExistingModalOpen, setIsExistingModalOpen] = useState(false);
  const [editingPermissionsEmp, setEditingPermissionsEmp] = useState<Employee | null>(null);
  const [resetPasswordEmp, setResetPasswordEmp] = useState<Employee | null>(null);
  const [employeeToBlock, setEmployeeToBlock] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Employee Form
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formPasswordConfirm, setFormPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formRole, setFormRole] = useState('Receptionist & Billing Desk');

  // Existing Employee Form
  const [existingEmail, setExistingEmail] = useState('');

  // Reset Password Form
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // Permissions Form
  const [permEditRates, setPermEditRates] = useState(false);
  const [permDeleteBills, setPermDeleteBills] = useState(false);
  const [permSignReports, setPermSignReports] = useState(false);
  const [permViewLedger, setPermViewLedger] = useState(false);
  const [permManageExpenses, setPermManageExpenses] = useState(false);
  const [permIssueRefunds, setPermIssueRefunds] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenNew = () => {
    setFormFirstName('');
    setFormLastName('');
    setFormMobile('');
    setFormEmail('');
    setFormPassword('');
    setFormPasswordConfirm('');
    setFormRole('Receptionist & Billing Desk');
    setIsNewModalOpen(true);
  };

  const mapRoleToBackend = (roleStr: string): string => {
    if (roleStr.includes('Pathologist')) return 'PATHOLOGIST';
    if (roleStr.includes('Radiologist')) return 'RADIOLOGIST';
    if (roleStr.includes('Accountant')) return 'ACCOUNTANT';
    if (roleStr.includes('Administrator') || roleStr.includes('Admin')) return 'ADMIN';
    return 'RECEPTIONIST';
  };

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName.trim() || !formMobile.trim() || !formEmail.trim() || !formPassword.trim()) {
      showToast('Please fill all mandatory fields (*)');
      return;
    }
    if (formPassword !== formPasswordConfirm) {
      showToast('Password confirmation does not match');
      return;
    }

    const fullName = `${formFirstName.trim()} ${formLastName.trim()}`.trim();
    const cleanUsername = (formFirstName.trim() + Math.floor(100 + Math.random() * 900))
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    try {
      await employeeApi.createEmployee({
        username: cleanUsername,
        fullName,
        email: formEmail.trim(),
        password: formPassword,
        role: mapRoleToBackend(formRole),
        canBilling: true,
        canResultsEntry: formRole.includes('Pathologist') || formRole.includes('Technician'),
        canAuthorize: formRole.includes('Pathologist') || formRole.includes('Radiologist'),
        canDoctorPayouts: formRole.includes('Accountant') || formRole.includes('Admin'),
        canAuditMaster: formRole.includes('Admin')
      });

      await loadEmployees();
      setIsNewModalOpen(false);
      showToast(`Staff account created for ${fullName}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to create employee');
    }
  };

  const handleSaveExisting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingEmail.trim()) return;

    const newEmp: Employee = {
      id: String(Date.now()),
      name: existingEmail.split('@')[0],
      mobile: '+91 Registered',
      isMobileVerified: true,
      email: existingEmail.trim(),
      isEmailVerified: true,
      registeredOn: 'Today',
      role: 'Staff Member',
      isOwner: false,
      isBlocked: false,
      permissions: {
        canEditRates: false,
        canDeleteBills: false,
        canSignOffReports: false,
        canViewLedger: true,
        canManageExpenses: false,
        canIssueRefunds: false,
      },
    };

    setEmployees([...employees, newEmp]);
    setIsExistingModalOpen(false);
    setExistingEmail('');
    showToast(`Associated existing Labsmart account ${newEmp.email}`);
  };

  const handleOpenPermissions = (emp: Employee) => {
    setEditingPermissionsEmp(emp);
    setPermEditRates(emp.permissions.canEditRates);
    setPermDeleteBills(emp.permissions.canDeleteBills);
    setPermSignReports(emp.permissions.canSignOffReports);
    setPermViewLedger(emp.permissions.canViewLedger);
    setPermManageExpenses(emp.permissions.canManageExpenses);
    setPermIssueRefunds(emp.permissions.canIssueRefunds);
    setOpenDropdownId(null);
  };

  const handleSavePermissions = () => {
    if (!editingPermissionsEmp) return;

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === editingPermissionsEmp.id
          ? {
              ...e,
              permissions: {
                canEditRates: permEditRates,
                canDeleteBills: permDeleteBills,
                canSignOffReports: permSignReports,
                canViewLedger: permViewLedger,
                canManageExpenses: permManageExpenses,
                canIssueRefunds: permIssueRefunds,
              },
            }
          : e
      )
    );
    showToast(`Updated permissions for ${editingPermissionsEmp.name}`);
    setEditingPermissionsEmp(null);
  };

  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordEmp) return;
    if (newPasswordValue !== newPasswordConfirm) {
      showToast('Passwords do not match');
      return;
    }
    showToast(`Password successfully reset for ${resetPasswordEmp.name}`);
    setResetPasswordEmp(null);
    setNewPasswordValue('');
    setNewPasswordConfirm('');
  };

  const handleConfirmBlock = async () => {
    if (!employeeToBlock) return;
    try {
      await employeeApi.toggleEmployeeStatus(employeeToBlock.id);
      showToast(
        employeeToBlock.isBlocked
          ? `Unblocked staff member ${employeeToBlock.name}`
          : `Blocked staff login for ${employeeToBlock.name}`
      );
      await loadEmployees();
    } catch (err: any) {
      showToast(err.message || 'Failed to update employee status');
    } finally {
      setEmployeeToBlock(null);
    }
  };

  const handleConfirmDelete = () => {
    if (!employeeToDelete) return;
    setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
    showToast(`Staff login removed for ${employeeToDelete.name}`);
    setEmployeeToDelete(null);
  };

  const activeEmployees = employees.filter((e) => !e.isBlocked);
  const blockedEmployees = employees.filter((e) => e.isBlocked);
  const displayedEmployees = activeTab === 'active' ? activeEmployees : blockedEmployees;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Manage employee logins
          </h2>
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => showToast('Opening Labsmart staff training video guide...')}
          >
            <Play size={12} fill="#2563eb" />
            <span>Watch Video</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenNew}
            style={{ fontWeight: 600 }}
          >
            New employee
          </Button>
          <button
            type="button"
            onClick={() => setIsExistingModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <PlusCircle size={15} color="#64748b" />
            <span>Existing employee</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          style={{
            background: 'none',
            border: 'none',
            fontWeight: activeTab === 'active' ? 700 : 500,
            color: activeTab === 'active' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'active' ? '2px solid #2563eb' : '2px solid transparent',
            padding: '8px 4px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>Active</span>
          <span
            style={{
              backgroundColor: activeTab === 'active' ? '#dbeafe' : '#f1f5f9',
              color: activeTab === 'active' ? '#1d4ed8' : '#64748b',
              fontSize: '11px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '10px',
            }}
          >
            {activeEmployees.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('blocked')}
          style={{
            background: 'none',
            border: 'none',
            fontWeight: activeTab === 'blocked' ? 700 : 500,
            color: activeTab === 'blocked' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'blocked' ? '2px solid #2563eb' : '2px solid transparent',
            padding: '8px 4px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>Blocked</span>
          <span
            style={{
              backgroundColor: activeTab === 'blocked' ? '#fee2e2' : '#f1f5f9',
              color: activeTab === 'blocked' ? '#dc2626' : '#64748b',
              fontSize: '11px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '10px',
            }}
          >
            {blockedEmployees.length}
          </span>
        </button>
      </div>

      {/* Staff Ledger Table with Exact Labsmart Columns */}
      <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'visible' }}>
        <table className="data-table">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ width: '60px' }}>S. NO.</th>
              <th>NAME</th>
              <th>MOBILE NUMBER</th>
              <th style={{ textAlign: 'center', width: '70px' }}>STATUS</th>
              <th>EMAIL</th>
              <th style={{ textAlign: 'center', width: '70px' }}>STATUS</th>
              <th>REG. ON</th>
              <th>PERMISSIONS</th>
              <th style={{ textAlign: 'center', width: '80px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No employees in this list.
                </td>
              </tr>
            ) : (
              displayedEmployees.map((emp, index) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="table-cell-mono" style={{ color: '#64748b' }}>
                    {index + 1}.
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                      {emp.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{emp.role}</div>
                  </td>
                  <td style={{ fontSize: '13px', color: '#334155' }}>
                    {emp.mobile}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {emp.isMobileVerified ? (
                      <CheckCircle2 size={16} color="#16a34a" fill="#dcfce7" />
                    ) : (
                      <XCircle size={16} color="#dc2626" fill="#fee2e2" />
                    )}
                  </td>
                  <td style={{ fontSize: '13px', color: '#334155' }}>
                    {emp.email}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {emp.isEmailVerified ? (
                      <CheckCircle2 size={16} color="#16a34a" fill="#dcfce7" />
                    ) : (
                      <XCircle size={16} color="#dc2626" fill="#fee2e2" />
                    )}
                  </td>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>
                    {emp.registeredOn}
                  </td>
                  <td>
                    {emp.isOwner ? (
                      <span
                        style={{
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        Account owner
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                        {emp.role}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', position: 'relative' }}>
                    {emp.isOwner ? (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>—</span>
                    ) : (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                          type="button"
                          onClick={() => setOpenDropdownId(openDropdownId === emp.id ? null : emp.id)}
                          style={{
                            background: 'none',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            padding: '4px 6px',
                            cursor: 'pointer',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <MoreVertical size={14} />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdownId === emp.id && (
                          <div
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: '28px',
                              width: '180px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                              zIndex: 100,
                              textAlign: 'left',
                              padding: '4px 0',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleOpenPermissions(emp)}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '8px 12px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12px',
                                color: '#334155',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <Shield size={14} color="#2563eb" />
                              <span>Configure Permissions</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setResetPasswordEmp(emp);
                                setOpenDropdownId(null);
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '8px 12px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12px',
                                color: '#334155',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <Key size={14} color="#f59e0b" />
                              <span>Reset Password</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEmployeeToBlock(emp);
                                setOpenDropdownId(null);
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '8px 12px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12px',
                                color: emp.isBlocked ? '#15803d' : '#dc2626',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              {emp.isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
                              <span>{emp.isBlocked ? 'Unblock Login' : 'Block Login'}</span>
                            </button>

                            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }} />

                            <button
                              type="button"
                              onClick={() => {
                                setEmployeeToDelete(emp);
                                setOpenDropdownId(null);
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '8px 12px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12px',
                                color: '#dc2626',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <Trash2 size={14} color="#dc2626" />
                              <span>Delete Staff Account</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal 1: Add New Employee */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Add employee"
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveNew}>
              Add Employee
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveNew} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="* First name"
              placeholder="e.g. Rahul"
              value={formFirstName}
              onChange={(e) => setFormFirstName(e.target.value)}
              required
            />
            <Input
              label="Last name"
              placeholder="e.g. Sharma"
              value={formLastName}
              onChange={(e) => setFormLastName(e.target.value)}
            />
          </div>

          <Input
            label="* Email"
            type="email"
            placeholder="e.g. rahul.sharma@labsmart.internal"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            required
          />

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              * Mobile number
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div
                style={{
                  padding: '9px 12px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569',
                }}
              >
                +91
              </div>
              <input
                type="text"
                placeholder="10-digit mobile number"
                value={formMobile}
                onChange={(e) => setFormMobile(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none',
                }}
                required
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Input
              label="* Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create login password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '34px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Input
            label="* Password confirmation"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm login password"
            value={formPasswordConfirm}
            onChange={(e) => setFormPasswordConfirm(e.target.value)}
            required
          />

          <Select
            label="Designated Role"
            value={formRole}
            onChange={(e) => setFormRole(e.target.value)}
            options={[
              { label: 'Receptionist & Billing Desk', value: 'Receptionist & Billing Desk' },
              { label: 'Laboratory Technician', value: 'Laboratory Technician' },
              { label: 'Consulting Pathologist', value: 'Consulting Pathologist' },
              { label: 'Consulting Radiologist', value: 'Consulting Radiologist' },
              { label: 'Phlebotomist / Sample Collector', value: 'Phlebotomist / Sample Collector' },
              { label: 'Accountant & Manager', value: 'Accountant & Manager' },
            ]}
          />
        </form>
      </Modal>

      {/* Modal 2: Add Existing Employee by Email (Exact Labsmart Yellow Note) */}
      <Modal
        isOpen={isExistingModalOpen}
        onClose={() => setIsExistingModalOpen(false)}
        title="Add existing employee by email"
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setIsExistingModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveExisting}>
              Add Employee
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveExisting} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Labsmart Yellow Notice Banner */}
          <div
            style={{
              backgroundColor: '#fefce8',
              border: '1px solid #fef08a',
              borderRadius: '6px',
              padding: '12px 14px',
              fontSize: '12px',
              color: '#854d0e',
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={14} color="#ca8a04" />
              <span>Note:</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px' }}>
              <li>Employee details must be edited from the user's profile page by the employees themselves.</li>
              <li>Please verify email carefully before adding. Permissions need to be configured again for the added employee.</li>
            </ul>
          </div>

          <Input
            label="Employee email"
            type="email"
            placeholder="e.g. staff.member@gmail.com"
            value={existingEmail}
            onChange={(e) => setExistingEmail(e.target.value)}
            required
          />
        </form>
      </Modal>

      {/* Modal 3: Configure Granular Permissions */}
      {editingPermissionsEmp && (
        <Modal
          isOpen={!!editingPermissionsEmp}
          onClose={() => setEditingPermissionsEmp(null)}
          title={`Configure Permissions: ${editingPermissionsEmp.name}`}
          size="md"
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setEditingPermissionsEmp(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSavePermissions}>
                Save Permissions
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' }}>
              Staff Role: <strong>{editingPermissionsEmp.role}</strong> • Email: {editingPermissionsEmp.email}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0f172a' }}>Modify Tariff & Test Pricing</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Allow employee to edit standard test rates and doctor referral cuts.</span>
                </div>
                <input
                  type="checkbox"
                  checked={permEditRates}
                  onChange={(e) => setPermEditRates(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0f172a' }}>Delete & Void Patient Bills</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Permit staff to cancel and void generated patient invoices.</span>
                </div>
                <input
                  type="checkbox"
                  checked={permDeleteBills}
                  onChange={(e) => setPermDeleteBills(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0f172a' }}>Authorize & Sign Diagnostic Reports</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Allow doctor or technician to approve and attach official digital signatures.</span>
                </div>
                <input
                  type="checkbox"
                  checked={permSignReports}
                  onChange={(e) => setPermSignReports(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0f172a' }}>View Financial Ledgers & Cash Drawer</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Permit access to daily receipts, business summaries, and cash collection totals.</span>
                </div>
                <input
                  type="checkbox"
                  checked={permViewLedger}
                  onChange={(e) => setPermViewLedger(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0f172a' }}>Manage Operational Expenses</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Allow recording of lab overheads, reagent bills, and supplier payments.</span>
                </div>
                <input
                  type="checkbox"
                  checked={permManageExpenses}
                  onChange={(e) => setPermManageExpenses(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', cursor: 'pointer' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0f172a' }}>Issue Cash Refunds & Discounts Overrides</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Permit cash refunds on test cancellations and manual billing discounts.</span>
                </div>
                <input
                  type="checkbox"
                  checked={permIssueRefunds}
                  onChange={(e) => setPermIssueRefunds(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 4: Reset Password */}
      {resetPasswordEmp && (
        <Modal
          isOpen={!!resetPasswordEmp}
          onClose={() => setResetPasswordEmp(null)}
          title={`Reset Password: ${resetPasswordEmp.name}`}
          size="sm"
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setResetPasswordEmp(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveResetPassword}>
                Save New Password
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Enter a new temporary password for <strong>{resetPasswordEmp.name}</strong> ({resetPasswordEmp.email}).
            </p>
            <Input
              label="New Password"
              type="password"
              placeholder="At least 6 characters"
              value={newPasswordValue}
              onChange={(e) => setNewPasswordValue(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              required
            />
          </form>
        </Modal>
      )}

      {/* Modal 5: Block Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!employeeToBlock}
        onClose={() => setEmployeeToBlock(null)}
        onConfirm={handleConfirmBlock}
        title={employeeToBlock?.isBlocked ? 'Unblock Staff Login' : 'Block Staff Login'}
        message={`Are you sure you want to ${employeeToBlock?.isBlocked ? 'unblock' : 'block'} login access for "${employeeToBlock?.name}" (${employeeToBlock?.email})?`}
        confirmLabel={employeeToBlock?.isBlocked ? 'Unblock Staff' : 'Block Staff'}
        variant={employeeToBlock?.isBlocked ? 'info' : 'danger'}
      />

      {/* Modal 6: Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!employeeToDelete}
        onClose={() => setEmployeeToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff Account"
        message={`Are you sure you want to permanently delete the login account for "${employeeToDelete?.name}"? Historical audits will retain their attribution.`}
        confirmLabel="Yes, Delete Account"
        variant="danger"
      />
    </div>
  );
};
