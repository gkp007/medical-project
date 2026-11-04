import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Badge } from '../../components/atoms/Badge';
import { Building, Sliders, MessageSquare, Barcode, Shield, Lock, CreditCard, Save, Check, Sparkles, Clock, ArrowUpRight, X, QrCode } from 'lucide-react';
import { subscriptionApi } from '../../services/api';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'branch' | 'letterhead' | 'sms' | 'barcodes' | 'roles' | 'security' | 'plan'>('branch');

  // Branch Profile State
  const [labName, setLabName] = useState('Metropolis Diagnostics & Research Center');
  const [regNo, setRegNo] = useState('DL-GGM-LAB-98102');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('104, Medical Enclave, Sector 14, Gurugram');

  // Letterhead State
  const [headerMargin, setHeaderMargin] = useState<number>(45);
  const [footerMargin, setFooterMargin] = useState<number>(30);
  const [watermark, setWatermark] = useState<boolean>(true);

  // Subscription & Billing State
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [plansList, setPlansList] = useState<any[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState<string>('PROFESSIONAL');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');
  const [paymentMethod, setPaymentMethod] = useState<string>('DIRECT_UPI');
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [subscriptionSuccessMsg, setSubscriptionSuccessMsg] = useState<string>('');

  const loadSubscription = async () => {
    try {
      const [curRes, plansRes] = await Promise.all([
        subscriptionApi.getCurrent(),
        subscriptionApi.getPlans()
      ]);
      if (curRes.success && curRes.data) {
        setSubscriptionData(curRes.data);
      }
      if (plansRes.success && plansRes.data) {
        setPlansList(plansRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch subscription details:', err);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    setSubscriptionSuccessMsg('');
    try {
      const res = await subscriptionApi.subscribe({
        planTier: selectedPlanTier,
        billingCycle,
        paymentMethod
      });
      if (res.success) {
        setSubscriptionSuccessMsg(res.message || 'Subscription successfully activated!');
        await loadSubscription();
        setTimeout(() => {
          setShowUpgradeModal(false);
          setSubscriptionSuccessMsg('');
        }, 1800);
      }
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
        <div>
          <h2 className="h1-title">Laboratory Setup & System Configuration</h2>
          <p className="text-muted" style={{ marginTop: '2px' }}>
            Customize your diagnostic center profile, letterhead margins, SMS gateways, and user access roles.
          </p>
        </div>
      </div>

      {/* 2-Column Split: Vertical Navigation Tabs vs Content Canvas */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 'var(--space-5)', alignItems: 'start' }}>
        
        {/* Left Submodule Tabs */}
        <Card style={{ padding: 'var(--space-2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { id: 'branch', label: '1. Center Details', icon: <Building size={16} /> },
              { id: 'letterhead', label: '2. Letterhead Designer', icon: <Sliders size={16} /> },
              { id: 'sms', label: '3. SMS & WhatsApp', icon: <MessageSquare size={16} /> },
              { id: 'barcodes', label: '4. Barcode Tracking', icon: <Barcode size={16} /> },
              { id: 'roles', label: '5. Staff Logins & Roles', icon: <Shield size={16} /> },
              { id: 'security', label: '6. Browser Security & IP', icon: <Lock size={16} /> },
              { id: 'plan', label: '7. Cloud Plan & Billings', icon: <CreditCard size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: activeTab === tab.id ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                  backgroundColor: activeTab === tab.id ? 'var(--color-primary-light)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-primary-link)' : 'var(--text-section)',
                  textAlign: 'left',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Right Configuration Canvas */}
        <div>
          {/* Submodule 1: Branch Details */}
          {activeTab === 'branch' && (
            <Card title="Diagnostic Center & Branch Profile">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Input
                  label="Official Diagnostic Center Name"
                  required
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <Input
                    label="Clinical Registration / License No."
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                  />
                  <Input
                    label="Official Reception Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Input
                  label="Center Physical Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <div>
                  <Button variant="primary" icon={<Save size={16} />}>
                    Save Branch Profile
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Submodule 2: Letterhead Designer */}
          {activeTab === 'letterhead' && (
            <Card title="Letterhead Print Margin & Formatting Designer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                  Configure top and bottom margins so your lab reports align with pre-printed doctor stationery.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <Input
                    label="Header Top Margin (mm)"
                    type="number"
                    value={headerMargin}
                    onChange={(e) => setHeaderMargin(Number(e.target.value))}
                    helperText="Space left blank for pre-printed letterhead logo."
                  />
                  <Input
                    label="Footer Bottom Margin (mm)"
                    type="number"
                    value={footerMargin}
                    onChange={(e) => setFooterMargin(Number(e.target.value))}
                    helperText="Space left blank for signatures and clinic address."
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
                    <input
                      type="checkbox"
                      checked={watermark}
                      onChange={(e) => setWatermark(e.target.checked)}
                    />
                    Print faint center security watermark in background of diagnostic report
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
                    <input type="checkbox" defaultChecked />
                    Include dynamic authentication QR code on patient report footer
                  </label>
                </div>

                <div>
                  <Button variant="primary" icon={<Save size={16} />}>
                    Save Letterhead Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Submodule 3: SMS & WhatsApp */}
          {activeTab === 'sms' && (
            <Card title="SMS & WhatsApp Notification Gateway">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                  Configure DLT-approved transactional SMS templates and WhatsApp Cloud API distribution.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <Input label="Sender ID" defaultValue="LABSMT" />
                  <Input label="DLT Entity Principal ID" defaultValue="1101489102830" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
                    <input type="checkbox" defaultChecked /> Send Bill Receipt SMS upon Case Registration
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
                    <input type="checkbox" defaultChecked /> Send WhatsApp message with Download Link when Report is Signed Off
                  </label>
                </div>
                <div>
                  <Button variant="primary" icon={<Save size={16} />}>Save Gateway Credentials</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Submodule 4: Barcodes */}
          {activeTab === 'barcodes' && (
            <Card title="Sample Collection & Barcode Label Printer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <Input label="Barcode Symbology" defaultValue="Code 128" readOnly />
                  <Input label="Label Size" defaultValue="50mm x 25mm (Thermal)" readOnly />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
                    <input type="checkbox" defaultChecked /> Auto-trigger barcode printing upon bill registration
                  </label>
                </div>
                <div>
                  <Button variant="primary" icon={<Save size={16} />}>Update Barcode Setup</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Submodule 5: Roles */}
          {activeTab === 'roles' && (
            <Card title="Staff Logins, Access Levels & Permissions">
              <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Staff Role</th>
                      <th>Allowed Capabilities</th>
                      <th style={{ textAlign: 'center' }}>Active Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="table-cell-bold">Super Admin / Owner</td>
                      <td>Full unrestricted access to financial ledgers, settings, and rates</td>
                      <td style={{ textAlign: 'center' }}><Badge variant="success">1 User</Badge></td>
                    </tr>
                    <tr>
                      <td className="table-cell-bold">Receptionist / Front Desk</td>
                      <td>Register patients, collect money, search cases (No profit access)</td>
                      <td style={{ textAlign: 'center' }}><Badge variant="neutral">2 Users</Badge></td>
                    </tr>
                    <tr>
                      <td className="table-cell-bold">Consulting Pathologist</td>
                      <td>Verify, edit biological parameters, sign off clinical reports</td>
                      <td style={{ textAlign: 'center' }}><Badge variant="info">1 User</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Submodule 6: Security */}
          {activeTab === 'security' && (
            <Card title="Browser Security & Authorized Broadband IP Whitelist">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Input label="Allowed Clinic IP Address" defaultValue="182.74.22.105 (Airtel Broadband)" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
                    <input type="checkbox" defaultChecked /> Restrict staff logins exclusively to clinic Wi-Fi IP
                  </label>
                </div>
                <div>
                  <Button variant="primary" icon={<Save size={16} />}>Enforce IP Restriction</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Submodule 7: Plan & Billing */}
          {activeTab === 'plan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Active Plan Status Header Card */}
              <Card title="Current Subscription Status">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className={`badge ${subscriptionData?.isTrial ? 'badge-warning' : 'badge-success'}`}>
                        {subscriptionData?.isTrial ? '14-Day Free Trial Active' : 'Active Paid License'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        • Multi-Branch Ready • NABL ISO 15189
                      </span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                      {subscriptionData?.planInfo?.name || 'Labsmart Cloud Professional'}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                      {subscriptionData?.planInfo?.description || 'Full diagnostic laboratory software suite'}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Remaining License Duration</div>
                    <strong style={{ fontSize: '26px', color: subscriptionData?.daysRemaining <= 5 ? '#e11d48' : '#0284c7', display: 'block' }}>
                      {subscriptionData?.daysRemaining ?? 14} Days
                    </strong>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedPlanTier('PROFESSIONAL');
                        setShowUpgradeModal(true);
                      }}
                      style={{ marginTop: '6px' }}
                    >
                      <Sparkles size={14} style={{ marginRight: '4px' }} /> Upgrade / Extend Plan
                    </Button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '13px' }}>
                  <div style={{ padding: '10px', background: '#ffffff', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                    <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Bill Quota</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {subscriptionData?.subscription?.maxCasesPerMonth > 9999 ? 'Unlimited Bills' : `${subscriptionData?.subscription?.maxCasesPerMonth || 300} Bills/mo`}
                    </div>
                  </div>
                  <div style={{ padding: '10px', background: '#ffffff', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                    <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Branch Capacity</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {subscriptionData?.subscription?.maxBranches > 99 ? 'Unlimited' : `${subscriptionData?.subscription?.maxBranches || 1} Branches`}
                    </div>
                  </div>
                  <div style={{ padding: '10px', background: '#ffffff', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                    <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Period End Date</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {subscriptionData?.subscription?.currentPeriodEnd ? new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString() : 'Active'}
                    </div>
                  </div>
                  <div style={{ padding: '10px', background: '#ffffff', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                    <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Billing Cycle</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {subscriptionData?.subscription?.billingCycle || 'MONTHLY'}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Plans Comparison Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {(plansList.length > 0 ? plansList : [
                  {
                    id: 'STARTER',
                    name: 'Labsmart Starter',
                    badge: 'Single Lab',
                    monthlyPrice: 1499,
                    annualPrice: 14990,
                    description: 'Perfect for standalone pathology labs and clinics starting digital operations',
                    maxCasesPerMonth: 300,
                    features: ['Up to 300 Patient Bills / month', 'Pathology Bench Entry & Formats', 'A4 / A5 Standard PDF Reports', 'Email Report Delivery', 'Single Branch']
                  },
                  {
                    id: 'PROFESSIONAL',
                    name: 'Labsmart Professional',
                    badge: 'Most Popular',
                    popular: true,
                    monthlyPrice: 3499,
                    annualPrice: 34990,
                    description: 'Full clinical intelligence & NABL ISO 15189 compliance for high-volume labs',
                    maxCasesPerMonth: 'Unlimited',
                    features: ['Unlimited Patient Bills', 'Automated Formula Engine', '90-Day Delta Check shift warnings', 'NABL ISO 15189 Compliance', 'WhatsApp & SMS Delivery', 'Specimen Tube Barcode Labels', 'QR Code Report Verification']
                  },
                  {
                    id: 'ENTERPRISE',
                    name: 'Labsmart Enterprise Network',
                    badge: 'Multi-Modality & Hospital',
                    monthlyPrice: 6999,
                    annualPrice: 69990,
                    description: 'Complete diagnostic network suite covering Pathology, Ultrasound, and Digital X-Ray',
                    maxCasesPerMonth: 'Unlimited',
                    features: ['All Capabilities of Professional', 'Ultrasound (USG) & PC-PNDT Forms', 'Digital X-Ray & AERB Logs', 'Multi-Branch Live Sync', 'Terminal Hardware Lockdown', '24/7 Priority Support']
                  }
                ]).map((plan) => (
                  <Card
                    key={plan.id}
                    style={{
                      border: plan.popular ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    {plan.popular && (
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '16px',
                        background: '#0284c7',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        RECOMMENDED
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{plan.name}</h4>
                        <span style={{ fontSize: '11px', padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 600 }}>{plan.badge}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', minHeight: '36px' }}>{plan.description}</p>
                      
                      <div style={{ margin: '14px 0', padding: '12px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>₹{plan.monthlyPrice.toLocaleString()}</span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>/ month</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                          or ₹{plan.annualPrice.toLocaleString()} billed annually (Save 17%)
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        {plan.features.map((feat: string, idx: number) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                            <Check size={14} color="#059669" style={{ flexShrink: 0 }} />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant={plan.popular ? 'primary' : 'secondary'}
                      onClick={() => {
                        setSelectedPlanTier(plan.id);
                        setShowUpgradeModal(true);
                      }}
                      style={{ width: '100%' }}
                    >
                      {subscriptionData?.subscription?.planTier === plan.id ? 'Current Plan (Extend)' : `Choose ${plan.name.split(' ')[1]}`}
                    </Button>
                  </Card>
                ))}
              </div>

              {/* Upgrade / Subscription Modal Dialog */}
              {showUpgradeModal && (
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
                    maxWidth: '520px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
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
                        <Sparkles size={20} color="#0284c7" />
                        <span>Confirm Plan & Payment</span>
                      </div>
                      <button
                        onClick={() => setShowUpgradeModal(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div style={{ padding: '24px' }}>
                      {subscriptionSuccessMsg && (
                        <div style={{ padding: '12px', borderRadius: '8px', background: '#ecfdf5', color: '#047857', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                          ✓ {subscriptionSuccessMsg}
                        </div>
                      )}

                      {/* Billing Cycle Toggle */}
                      <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                          Select Billing Term
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setBillingCycle('MONTHLY')}
                            style={{
                              padding: '10px',
                              borderRadius: '8px',
                              border: billingCycle === 'MONTHLY' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                              background: billingCycle === 'MONTHLY' ? '#f0f9ff' : '#ffffff',
                              fontWeight: 700,
                              fontSize: '13px',
                              cursor: 'pointer',
                              color: billingCycle === 'MONTHLY' ? '#0369a1' : '#475569'
                            }}
                          >
                            Monthly Cycle
                          </button>
                          <button
                            type="button"
                            onClick={() => setBillingCycle('ANNUAL')}
                            style={{
                              padding: '10px',
                              borderRadius: '8px',
                              border: billingCycle === 'ANNUAL' ? '2px solid #059669' : '1px solid #cbd5e1',
                              background: billingCycle === 'ANNUAL' ? '#ecfdf5' : '#ffffff',
                              fontWeight: 700,
                              fontSize: '13px',
                              cursor: 'pointer',
                              color: billingCycle === 'ANNUAL' ? '#047857' : '#475569'
                            }}
                          >
                            Annual (Save 17% + 2 Mo Free)
                          </button>
                        </div>
                      </div>

                      {/* Payment Method Selector */}
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                          Payment Instrument
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                          {[
                            { id: 'DIRECT_UPI', label: 'UPI / QR', icon: <QrCode size={16} /> },
                            { id: 'CARD', label: 'Credit Card', icon: <CreditCard size={16} /> },
                            { id: 'NETBANKING', label: 'Net Banking', icon: <Building size={16} /> }
                          ].map(pm => (
                            <button
                              key={pm.id}
                              type="button"
                              onClick={() => setPaymentMethod(pm.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '10px',
                                borderRadius: '8px',
                                border: paymentMethod === pm.id ? '2px solid #0284c7' : '1px solid #cbd5e1',
                                background: paymentMethod === pm.id ? '#f0f9ff' : '#ffffff',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                color: paymentMethod === pm.id ? '#0369a1' : '#475569'
                              }}
                            >
                              {pm.icon}
                              <span>{pm.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Summary Banner */}
                      <div style={{ padding: '14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '22px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                          <span style={{ color: '#64748b' }}>Selected Tier:</span>
                          <strong style={{ color: '#0f172a' }}>{selectedPlanTier}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                          <span style={{ color: '#64748b' }}>Validity Term:</span>
                          <strong style={{ color: '#0f172a' }}>{billingCycle === 'ANNUAL' ? '365 Days (1 Year)' : '30 Days'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>Total Amount Payable:</span>
                          <strong style={{ color: '#059669', fontSize: '18px' }}>
                            {selectedPlanTier === 'STARTER' ? (billingCycle === 'ANNUAL' ? '₹14,990' : '₹1,499') :
                             selectedPlanTier === 'ENTERPRISE' ? (billingCycle === 'ANNUAL' ? '₹69,990' : '₹6,999') :
                             (billingCycle === 'ANNUAL' ? '₹34,990' : '₹3,499')}
                          </strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => setShowUpgradeModal(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleSubscribe}
                          disabled={isSubscribing}
                        >
                          {isSubscribing ? 'Activating License...' : 'Authorize & Activate License'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
