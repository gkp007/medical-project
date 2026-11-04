import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  KeyRound,
  X,
  Stethoscope,
  Microscope,
  Radio,
  UserCheck,
  Building2,
  Sparkles,
  Phone,
  Mail,
  Check
} from 'lucide-react';
import { authApi } from '../../services/api';

interface LoginPageProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Sign In States
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('LabSmart@2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Registration Form States
  const [regClinicName, setRegClinicName] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPlanTier, setRegPlanTier] = useState<'TRIAL' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'>('TRIAL');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authApi.login(username.trim(), password);
      if (res.success && res.data?.token) {
        onLoginSuccess(res.data.user, res.data.token);
      } else {
        setErrorMessage(res.message || 'Invalid username or password. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server connection failed. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regClinicName.trim() || !regFullName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Please complete all mandatory registration fields.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authApi.register({
        clinicName: regClinicName.trim(),
        fullName: regFullName.trim(),
        username: regUsername.trim(),
        email: regEmail.trim(),
        mobile: regMobile.trim(),
        password: regPassword,
        planTier: regPlanTier
      });

      if (res.success && res.data?.token) {
        onLoginSuccess(res.data.user, res.data.token);
      } else {
        setErrorMessage(res.message || 'Registration failed. A user or lab with this username/email may already exist.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setForgotError('Please enter your email or username');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      const res = await authApi.forgotPassword(forgotIdentifier.trim());
      if (res.success) {
        setForgotSuccess(res.data?.message || 'Password reset link sent to your registered email.');
      } else {
        setForgotError(res.message || 'Unable to process reset request.');
      }
    } catch (err: any) {
      setForgotError(err.message || 'Network error processing reset.');
    } finally {
      setForgotLoading(false);
    }
  };

  const quickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0b1329 0%, #111d40 50%, #081026 100%)',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Rings */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        right: '-120px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0) 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main Card */}
      <div style={{
        width: '100%',
        maxWidth: authMode === 'register' ? '560px' : '460px',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '18px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 10,
        transition: 'max-width 0.25s ease'
      }}>
        {/* Header Ribbon */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          padding: '26px 28px 20px',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
            marginBottom: '10px'
          }}>
            <Activity size={28} color="#ffffff" strokeWidth={2.5} />
          </div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, letterSpacing: '-0.4px' }}>
            Labsmart Healthcare LIS
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.92, fontWeight: 500 }}>
            {authMode === 'login'
              ? 'Accredited Laboratory & Radiology Information System'
              : 'Register Your Diagnostic Centre • 14-Day Full Access Trial'}
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            marginTop: '8px',
            letterSpacing: '0.3px'
          }}>
            <ShieldCheck size={13} color="#4ade80" /> NABL ISO 15189 • HIPAA & HL7 Compliant
          </div>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
            style={{
              padding: '13px',
              border: 'none',
              background: authMode === 'login' ? '#ffffff' : 'transparent',
              color: authMode === 'login' ? '#0284c7' : '#64748b',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              borderBottom: authMode === 'login' ? '3px solid #0284c7' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Lock size={15} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
            style={{
              padding: '13px',
              border: 'none',
              background: authMode === 'register' ? '#ffffff' : 'transparent',
              color: authMode === 'register' ? '#0284c7' : '#64748b',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              borderBottom: authMode === 'register' ? '3px solid #0284c7' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={15} color="#eab308" /> Register Lab (Free Trial)
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '26px' }}>
          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {authMode === 'login' ? (
            /* ----------------- SIGN IN FORM ----------------- */
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Terminal Username or Email
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username or email"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 12px 11px 38px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'border-color 0.15s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setForgotIdentifier(username);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 12px 11px 38px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'border-color 0.15s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              {/* Quick-Fill Credentials Chips */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>
                  Quick Demo Roles (1-Click Fill)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => quickFill('admin', 'LabSmart@2026')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: username === 'admin' ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                      background: username === 'admin' ? '#f0f9ff' : '#f8fafc',
                      color: username === 'admin' ? '#0369a1' : '#475569',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <UserCheck size={14} color="#0284c7" />
                    <span>Super Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFill('pathologist1', 'LabSmart@2026')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: username === 'pathologist1' ? '1.5px solid #059669' : '1px solid #e2e8f0',
                      background: username === 'pathologist1' ? '#ecfdf5' : '#f8fafc',
                      color: username === 'pathologist1' ? '#047857' : '#475569',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Microscope size={14} color="#059669" />
                    <span>Pathologist</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFill('radiologist1', 'LabSmart@2026')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: username === 'radiologist1' ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
                      background: username === 'radiologist1' ? '#f5f3ff' : '#f8fafc',
                      color: username === 'radiologist1' ? '#6d28d9' : '#475569',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Radio size={14} color="#7c3aed" />
                    <span>Radiologist</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFill('reception1', 'LabSmart@2026')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: username === 'reception1' ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
                      background: username === 'reception1' ? '#fff7ed' : '#f8fafc',
                      color: username === 'reception1' ? '#c2410c' : '#475569',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Stethoscope size={14} color="#ea580c" />
                    <span>Receptionist</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                  transition: 'transform 0.1s ease, box-shadow 0.15s ease'
                }}
              >
                {isLoading ? (
                  <>Authenticating Terminal...</>
                ) : (
                  <>
                    <span>Sign In to Terminal</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ----------------- REGISTER LAB FORM ----------------- */
            <form onSubmit={handleRegister}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Diagnostic Centre Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                    <input
                      type="text"
                      value={regClinicName}
                      onChange={(e) => setRegClinicName(e.target.value)}
                      placeholder="e.g. Metro Diagnostic Centre"
                      required
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '9px 10px 9px 34px',
                        borderRadius: '7px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        color: '#0f172a'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Owner / Doctor Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      required
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '9px 10px 9px 34px',
                        borderRadius: '7px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        color: '#0f172a'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Official Email *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="reports@yourlab.com"
                      required
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '9px 10px 9px 34px',
                        borderRadius: '7px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        color: '#0f172a'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Mobile / WhatsApp No. *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                    <input
                      type="tel"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '9px 10px 9px 34px',
                        borderRadius: '7px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        color: '#0f172a'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Admin Username *
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. drsharma_admin"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '9px 12px',
                      borderRadius: '7px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      color: '#0f172a'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Master Password *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '9px 12px',
                      borderRadius: '7px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      color: '#0f172a'
                    }}
                  />
                </div>
              </div>

              {/* Plan Tier Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Select Subscription Plan
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div
                    onClick={() => setRegPlanTier('TRIAL')}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: regPlanTier === 'TRIAL' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      background: regPlanTier === 'TRIAL' ? '#f0f9ff' : '#ffffff',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1' }}>14-Day Free Trial</span>
                      <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>₹0</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>No card needed • Full access</div>
                  </div>

                  <div
                    onClick={() => setRegPlanTier('PROFESSIONAL')}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: regPlanTier === 'PROFESSIONAL' ? '2px solid #059669' : '1px solid #cbd5e1',
                      background: regPlanTier === 'PROFESSIONAL' ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#047857' }}>Professional</span>
                      <span style={{ fontSize: '11px', background: '#d1fae5', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>₹3,499/mo</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Unlimited Bills • NABL • Formulas</div>
                  </div>
                </div>
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)'
                }}
              >
                {isLoading ? (
                  <>Initializing Diagnostic Centre...</>
                ) : (
                  <>
                    <span>Create Clinic & Launch Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Compliance Footer */}
          <div style={{
            marginTop: '22px',
            paddingTop: '14px',
            borderTop: '1px solid #f1f5f9',
            textAlign: 'center',
            fontSize: '11px',
            color: '#94a3b8',
            lineHeight: 1.5
          }}>
            🔒 256-bit Cryptographic Session • Automated Audit Logging Active
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 24px',
              borderBottom: '1px solid #f1f5f9',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 700, fontSize: '16px' }}>
                <KeyRound size={20} color="#0284c7" />
                <span>Password Recovery</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleForgotSubmit} style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                Enter your terminal username or registered staff email to receive a password reset link.
              </p>

              {forgotError && (
                <div style={{ padding: '10px 12px', borderRadius: '6px', background: '#fef2f2', color: '#b91c1c', fontSize: '13px', marginBottom: '14px' }}>
                  {forgotError}
                </div>
              )}

              {forgotSuccess && (
                <div style={{ padding: '10px 12px', borderRadius: '6px', background: '#ecfdf5', color: '#047857', fontSize: '13px', marginBottom: '14px' }}>
                  {forgotSuccess}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Username or Email Address
                </label>
                <input
                  type="text"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="admin or reports@apexdiagnostics.com"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: forgotLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {forgotLoading ? 'Dispatching...' : 'Dispatch Reset Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
