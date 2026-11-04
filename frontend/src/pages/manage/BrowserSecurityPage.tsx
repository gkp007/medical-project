import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Badge } from '../../components/atoms/Badge';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import { securityApi } from '../../services/api';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  Lock, 
  Unlock, 
  Filter, 
  Search, 
  Plus, 
  Laptop, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export interface BrowserDevice {
  id: string;
  name: string;
  lastLoginUser: string;
  lastLoginTime: string;
  browserCode: string;
  isCurrent: boolean;
  isBlocked: boolean;
}

export const BrowserSecurityPage: React.FC = () => {
  const [isSecurityOn, setIsSecurityOn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'blocked'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [browsers, setBrowsers] = useState<BrowserDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDevices = async () => {
    setIsLoading(true);
    try {
      const res = await securityApi.listDevices();
      if (res.status === 'success' && Array.isArray(res.data)) {
        const mapped: BrowserDevice[] = res.data.map((d: any) => ({
          id: d.id,
          name: d.deviceName || 'Laboratory Terminal',
          lastLoginUser: d.browser ? `${d.browser} (${d.operatingSystem || 'OS'})` : 'Authorized Terminal',
          lastLoginTime: d.lastSeenAt ? new Date(d.lastSeenAt).toLocaleString() : 'Recent',
          browserCode: (d.deviceFingerprint || 'DEV').substring(0, 6).toUpperCase(),
          isCurrent: false,
          isBlocked: Boolean(d.isBlocked)
        }));
        setBrowsers(mapped);
      }
    } catch (err) {
      console.error('Failed to load devices from backend', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  // Modals
  const [activeRename, setActiveRename] = useState<BrowserDevice | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [browserToBlock, setBrowserToBlock] = useState<BrowserDevice | null>(null);
  const [securityToggleConfirm, setSecurityToggleConfirm] = useState(false);
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
  const [permitCode, setPermitCode] = useState('');
  const [permitName, setPermitName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenRename = (b: BrowserDevice) => {
    setActiveRename(b);
    setRenameValue(b.name);
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRename || !renameValue.trim()) return;

    try {
      await securityApi.renameDevice(activeRename.id, renameValue.trim());
      showToast(`Terminal renamed to "${renameValue.trim()}"`);
      setActiveRename(null);
      await loadDevices();
    } catch (err: any) {
      showToast(err.message || 'Failed to rename device');
    }
  };

  const handleConfirmBlock = async () => {
    if (!browserToBlock) return;
    try {
      await securityApi.toggleBlockDevice(browserToBlock.id);
      showToast(`Blocked browser terminal #${browserToBlock.browserCode}`);
      await loadDevices();
    } catch (err: any) {
      showToast(err.message || 'Failed to block terminal');
    } finally {
      setBrowserToBlock(null);
    }
  };

  const handleUnblock = async (b: BrowserDevice) => {
    try {
      await securityApi.toggleBlockDevice(b.id);
      showToast(`Unblocked browser terminal #${b.browserCode}`);
      await loadDevices();
    } catch (err: any) {
      showToast(err.message || 'Failed to unblock terminal');
    }
  };

  const handleToggleSecurity = () => {
    setIsSecurityOn(!isSecurityOn);
    showToast(
      !isSecurityOn
        ? 'Browser Terminal Security has been ACTIVATED. Unregistered browsers will be locked out.'
        : 'Browser Security has been turned off. Any device may now log in.'
    );
    setSecurityToggleConfirm(false);
  };

  const handlePermitNewBrowser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitCode.trim()) return;

    try {
      await securityApi.registerDevice({
        deviceFingerprint: permitCode.trim(),
        deviceName: permitName.trim() || `Laboratory Terminal (${permitCode.trim().toUpperCase()})`
      });
      showToast(`Successfully authorized browser terminal #${permitCode.trim().toUpperCase()}`);
      setIsPermitModalOpen(false);
      setPermitCode('');
      setPermitName('');
      await loadDevices();
    } catch (err: any) {
      showToast(err.message || 'Failed to authorize terminal');
    }
  };

  const filteredBrowsers = browsers.filter((b) => {
    if (filterMode === 'active' && b.isBlocked) return false;
    if (filterMode === 'blocked' && !b.isBlocked) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.browserCode.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.lastLoginUser.toLowerCase().includes(q)
      );
    }
    return true;
  });

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

      {/* Breadcrumb & Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px', letterSpacing: '0.05em' }}>
          DASHBOARD &nbsp;/&nbsp; MANAGE BROWSERS
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Browser security</h2>
          <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
            Beta
          </span>
        </div>
      </div>

      {/* Control Browser Access Banner Card */}
      <Card style={{ padding: '24px', marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Control browser access</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, maxWidth: '520px', lineHeight: 1.5 }}>
              Block access to browsers not being used inside the laboratory. When enabled, only authorized workstations with registered browser codes can log in.
            </p>
            <div style={{ marginTop: '16px' }}>
              <Button
                variant={isSecurityOn ? 'secondary' : 'primary'}
                size="md"
                onClick={() => setSecurityToggleConfirm(true)}
                style={{
                  backgroundColor: isSecurityOn ? '#ffffff' : '#2563eb',
                  color: isSecurityOn ? '#dc2626' : '#ffffff',
                  borderColor: isSecurityOn ? '#fecaca' : '#2563eb',
                  fontWeight: 600,
                }}
              >
                {isSecurityOn ? 'Turn off security' : 'Turn on security'}
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: isSecurityOn ? '#dcfce7' : '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${isSecurityOn ? '#86efac' : '#cbd5e1'}`,
              }}
            >
              {isSecurityOn ? (
                <ShieldCheck size={36} color="#16a34a" />
              ) : (
                <Shield size={36} color="#94a3b8" />
              )}
            </div>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: isSecurityOn ? '#15803d' : '#64748b',
              }}
            >
              {isSecurityOn ? 'Security is ON' : 'Security is off'}
            </span>
          </div>
        </div>
      </Card>

      {/* Header and Controls for All Browsers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          All browsers ({filteredBrowsers.length})
        </h3>
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => setIsPermitModalOpen(true)}
        >
          Permit browser
        </Button>
      </div>

      {/* Search and Filter Row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search by browser code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              fontSize: '13px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        {/* Filter Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#334155',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <Filter size={15} color="#64748b" />
            <span>Filter</span>
            {filterMode !== 'all' && (
              <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', marginLeft: '4px' }}>
                {filterMode}
              </span>
            )}
          </button>

          {isFilterOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '40px',
                width: '180px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 50,
                padding: '4px 0',
              }}
            >
              {[
                { id: 'all', label: 'All Browsers' },
                { id: 'active', label: 'Allowed Only' },
                { id: 'blocked', label: 'Blocked Only' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setFilterMode(opt.id as any);
                    setIsFilterOpen(false);
                  }}
                  style={{
                    padding: '8px 14px',
                    fontSize: '13px',
                    color: filterMode === opt.id ? '#2563eb' : '#334155',
                    fontWeight: filterMode === opt.id ? 600 : 400,
                    backgroundColor: filterMode === opt.id ? '#eff6ff' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{opt.label}</span>
                  {filterMode === opt.id && <Check size={14} color="#2563eb" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3-Column Responsive Cards Grid Matching Labsmart */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {filteredBrowsers.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              backgroundColor: '#ffffff',
              border: '1px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center',
              color: '#64748b',
            }}
          >
            <Laptop size={36} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No browser terminals match your filter.</p>
          </div>
        ) : (
          filteredBrowsers.map((b) => (
            <Card
              key={b.id}
              style={{
                padding: '16px 18px',
                border: b.isBlocked ? '1px solid #fecaca' : '1px solid #e2e8f0',
                backgroundColor: b.isBlocked ? '#fff5f5' : '#ffffff',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
              }}
            >
              <div>
                {/* Title & Edit Pencil */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{b.name}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenRename(b)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '2px',
                        cursor: 'pointer',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Rename browser"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                  {b.isCurrent && (
                    <span
                      style={{
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Current browser
                    </span>
                  )}
                  {b.isBlocked && (
                    <span
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Blocked
                    </span>
                  )}
                </div>

                {/* Last Login Info */}
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 500 }}>Last login :</span>
                  <div style={{ color: '#334155' }}>
                    {b.lastLoginUser}, {b.lastLoginTime}
                  </div>
                </div>

                {/* Monospace Browser Code */}
                <div style={{ fontSize: '13px', color: '#334155', marginTop: '6px' }}>
                  <span>Browser code: </span>
                  <strong style={{ fontFamily: 'monospace', fontSize: '14px', letterSpacing: '0.05em' }}>
                    {b.browserCode}
                  </strong>
                </div>
              </div>

              {/* Action Button: Block / Unblock */}
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-start' }}>
                {b.isBlocked ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUnblock(b)}
                    style={{ fontSize: '12px', padding: '4px 14px' }}
                  >
                    Unblock
                  </Button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setBrowserToBlock(b)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      padding: '5px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Block
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Rename Modal */}
      {activeRename && (
        <Modal
          isOpen={!!activeRename}
          onClose={() => setActiveRename(null)}
          title={`Rename Browser (${activeRename.browserCode})`}
          size="sm"
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setActiveRename(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveRename}>
                Save Name
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveRename} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Input
              label="Friendly Terminal Name"
              placeholder="e.g. Reception Desk Terminal 1"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              required
            />
          </form>
        </Modal>
      )}

      {/* Permit New Browser Modal */}
      {isPermitModalOpen && (
        <Modal
          isOpen={isPermitModalOpen}
          onClose={() => setIsPermitModalOpen(false)}
          title="Permit Browser Terminal"
          size="sm"
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setIsPermitModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handlePermitNewBrowser}>
                Authorize Terminal
              </Button>
            </div>
          }
        >
          <form onSubmit={handlePermitNewBrowser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Enter the 4-character cryptographic code displayed on the employee or workstation screen to grant it permanent laboratory clearance.
            </p>
            <Input
              label="Browser Code *"
              placeholder="e.g. 7B91"
              value={permitCode}
              onChange={(e) => setPermitCode(e.target.value.toUpperCase())}
              maxLength={6}
              required
            />
            <Input
              label="Terminal Label / Description"
              placeholder="e.g. Phlebotomy Counter #2"
              value={permitName}
              onChange={(e) => setPermitName(e.target.value)}
            />
          </form>
        </Modal>
      )}

      {/* Block Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!browserToBlock}
        onClose={() => setBrowserToBlock(null)}
        onConfirm={handleConfirmBlock}
        title="Block Browser Terminal"
        message={`Are you sure you want to block "${browserToBlock?.name}" (Browser Code: ${browserToBlock?.browserCode})? Any user attempting to log in through this terminal will be denied access.`}
        confirmLabel="Yes, Block Terminal"
        variant="danger"
      />

      {/* Toggle Security Confirmation Modal */}
      <ConfirmationModal
        isOpen={securityToggleConfirm}
        onClose={() => setSecurityToggleConfirm(false)}
        onConfirm={handleToggleSecurity}
        title={isSecurityOn ? 'Deactivate Browser Security?' : 'Activate Browser Security?'}
        message={
          isSecurityOn
            ? 'Turning off security will allow any browser or remote device with valid credentials to log in without workstation approval.'
            : 'Enabling browser security restricts login only to pre-authorized lab browser terminals. New terminals will require manual administrator sign-off.'
        }
        confirmLabel={isSecurityOn ? 'Turn Off Security' : 'Turn On Security'}
        variant={isSecurityOn ? 'warning' : 'info'}
      />
    </div>
  );
};
