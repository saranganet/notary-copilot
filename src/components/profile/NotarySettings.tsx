import React, { useState } from 'react';
import type { NotaryProfile, NotaryAccount, AccessRequest } from '../../types/notary';
import { StorageService } from '../../services/storageService';
import { SecuGenService } from '../../services/secugenService';
import {
  Settings,
  Save,
  Check,
  Cpu,
  RefreshCw,
  Download,
  Upload,
  Stamp,
  KeyRound,
  MessageCircle,
  Copy,
  PlusCircle,
  UserPlus,
} from 'lucide-react';

interface NotarySettingsProps {
  profile: NotaryProfile;
  onUpdateProfile: (newProfile: NotaryProfile) => void;
}

export const NotarySettings: React.FC<NotarySettingsProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<NotaryProfile>({ ...profile });
  const [saved, setSaved] = useState(false);
  const [secuGenStatus, setSecuGenStatus] = useState<{
    tested: boolean;
    connected: boolean;
    message: string;
  }>({ tested: false, connected: false, message: '' });
  const [isTestingDevice, setIsTestingDevice] = useState(false);

  // Accounts & Access Requests State
  const [accounts, setAccounts] = useState<NotaryAccount[]>(() => StorageService.getAccounts());
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(() =>
    StorageService.getAccessRequests()
  );

  // New Account Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRegNo, setNewRegNo] = useState('');
  const [newJurisdiction, setNewJurisdiction] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [accountCreatedMsg, setAccountCreatedMsg] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const handleChange = (field: keyof NotaryProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveProfile(formData);
    onUpdateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestSecuGen = async () => {
    setIsTestingDevice(true);
    const result = await SecuGenService.testDeviceConnection();
    setSecuGenStatus({
      tested: true,
      connected: result.connected,
      message: result.message,
    });
    setIsTestingDevice(false);
  };

  const handleExportBackup = () => {
    const backupJson = StorageService.exportBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Adv_Nileema_Saranga_Notary_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = StorageService.importBackup(content);
          if (success) {
            alert('Backup successfully restored! Refreshing data.');
            window.location.reload();
          } else {
            alert('Invalid backup file format.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim() || !newName.trim()) {
      alert('Please fill Username, Password, and Advocate Name');
      return;
    }

    const newProfile: NotaryProfile = {
      firmName: `${newName.trim()} & Chambers`,
      notaryName: newName.startsWith('Adv.') ? newName.trim() : `Adv. ${newName.trim()}`,
      qualifications: 'B.A., LL.B., Advocate & Notary Public',
      regNo: newRegNo.trim() || 'Govt. of India',
      areaOfPractice: newJurisdiction.trim() || 'District & Sessions Court Jurisdiction',
      officeAddress: 'Chambers Complex',
      mobile: newMobile.trim() || '+91 98000 00000',
      email: `${newUsername.trim().toLowerCase()}@notary.in`,
      verificationDomain: 'notary.verify.in',
      physicalStampingPreference: true,
    };

    const newAcc: NotaryAccount = {
      username: newUsername.trim().toLowerCase(),
      password: newPassword.trim(),
      role: 'notary',
      profile: newProfile,
      createdAt: new Date().toISOString().split('T')[0],
    };

    StorageService.saveAccount(newAcc);
    setAccounts(StorageService.getAccounts());
    setAccountCreatedMsg(`Account created for ${newProfile.notaryName}! Login: ${newAcc.username} / ${newAcc.password}`);
    setNewUsername('');
    setNewPassword('');
    setNewName('');
    setNewRegNo('');
    setNewJurisdiction('');
    setNewMobile('');
    setTimeout(() => setAccountCreatedMsg(''), 7000);
  };

  const handleApproveRequest = (req: AccessRequest) => {
    setNewName(req.applicantName);
    setNewRegNo(req.regNo);
    setNewMobile(req.mobile);
    setNewJurisdiction(req.jurisdiction);
    const suggestedUser = req.applicantName
      .toLowerCase()
      .replace(/^(adv\.|advocate)\s*/i, '')
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 10);
    setNewUsername(suggestedUser);
    setNewPassword('notary123');
    StorageService.updateAccessRequest(req.id, 'approved');
    setAccessRequests(StorageService.getAccessRequests());
  };

  const handleCopyCredentials = (acc: NotaryAccount) => {
    navigator.clipboard.writeText(`Notary Copilot Portal Credentials:\nUsername: ${acc.username}\nPassword: ${acc.password}\nPortal: http://localhost:5173/`);
    setCopiedId(acc.username);
    setTimeout(() => setCopiedId(''), 2500);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Settings size={28} color="var(--color-primary)" />
          Notary Profile & Device Settings
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Official credentials for Advocate Nileema Saranga, chamber address, stamping preference, and SecuGen hardware diagnostics
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Notary Credentials Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                <Stamp size={20} color="var(--color-seal-red)" />
                Official Notary Public Credentials
              </h2>
              <p className="card-subtitle">These details appear on your printed Notary Certificates and Form XV Register</p>
            </div>
            {saved && (
              <span style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={16} /> Saved Successfully
              </span>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Chambers / Firm Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.firmName}
                onChange={(e) => handleChange('firmName', e.target.value)}
                placeholder="e.g. Advocate Nileema Saranga"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notary Public Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.notaryName}
                onChange={(e) => handleChange('notaryName', e.target.value)}
                placeholder="Adv. Nileema Saranga"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Qualifications</label>
              <input
                type="text"
                className="form-input"
                value={formData.qualifications}
                onChange={(e) => handleChange('qualifications', e.target.value)}
                placeholder="B.A., LL.B., Advocate & Notary Public"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Govt. Registration Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.regNo}
                onChange={(e) => handleChange('regNo', e.target.value)}
                placeholder="Reg. No. 15960 / Govt. of India"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Appointed Area of Practice</label>
              <input
                type="text"
                className="form-input"
                value={formData.areaOfPractice}
                onChange={(e) => handleChange('areaOfPractice', e.target.value)}
                placeholder="District Courts & Sub-Divisions, Pune & Mumbai"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Chambers / Office Address</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={formData.officeAddress}
                onChange={(e) => handleChange('officeAddress', e.target.value)}
                placeholder="Chamber No. 14, Bar Association Building, Court Compound, Pune - 411001"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone / Mobile</label>
              <input
                type="text"
                className="form-input"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                placeholder="+91 98220 12345"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="adv.nileemasaranga@gmail.com"
              />
            </div>
          </div>
        </div>

        {/* Traditional Physical Stamping Mode Setting */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Stamping & Signing Workflow</h2>
              <p className="card-subtitle">Designed for Adv. Nileema Saranga's authentic brass seal and ink signature</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: '#FEF2F2', padding: '1rem', borderRadius: '8px', border: '1px solid #FECDD3' }}>
            <Stamp size={24} color="var(--color-seal-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#991B1B' }}>
                Physical Brass Seal & Ink Signature Mode
              </div>
              <p style={{ fontSize: '0.82rem', color: '#7F1D1D', marginTop: '4px', lineHeight: '1.4' }}>
                When enabled, the printed Notary Certificate prints with high-contrast guided circular and rectangular stamping boxes so Adv. Nileema Saranga can stamp her authentic brass seal and sign in ink before the client.
              </p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={formData.physicalStampingPreference}
                  onChange={(e) => handleChange('physicalStampingPreference', e.target.checked)}
                />
                Keep Physical Stamping Area on Printed Certificates (Recommended)
              </label>
            </div>
          </div>
        </div>

        {/* Hardware Diagnostics Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                <Cpu size={20} color="var(--color-accent)" />
                SecuGen Fingerprint Scanner Diagnostics
              </h2>
              <p className="card-subtitle">Test connection with the local SecuGen WebAPI service</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleTestSecuGen}
              disabled={isTestingDevice}
            >
              <RefreshCw size={14} className={isTestingDevice ? 'spin' : ''} />
              {isTestingDevice ? 'Testing...' : 'Test SecuGen Connection'}
            </button>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5' }}>
            <p>
              The physical SecuGen scanner connects through the <strong>SecuGen WebAPI Client</strong> listening on port <code>https://localhost:8000/SGIFPCapture</code>.
            </p>
            {secuGenStatus.tested && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  background: secuGenStatus.connected ? '#ECFDF5' : '#FFF7ED',
                  border: `1px solid ${secuGenStatus.connected ? '#A7F3D0' : '#FED7AA'}`,
                  color: secuGenStatus.connected ? '#065F46' : '#9A3412',
                  fontWeight: 600,
                }}
              >
                {secuGenStatus.message}
              </div>
            )}
          </div>
        </div>

        {/* Backup & Restore Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Data Backup & Pen-Drive Export</h2>
              <p className="card-subtitle">Keep all Notarial records safe and portable</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" onClick={handleExportBackup}>
              <Download size={16} />
              Export Full Backup (JSON)
            </button>

            <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
              <Upload size={16} />
              Restore from Backup File
              <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Authorized User Accounts & Access Requests Card */}
        <div className="card" style={{ border: '1px solid #FECACA', background: '#FFFDFD' }}>
          <div className="card-header" style={{ borderBottom: '1px solid #FEE2E2', paddingBottom: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={20} color="#B91C1C" />
                <h2 className="card-title" style={{ color: '#991B1B' }}>Authorized Notary Logins & Access Control</h2>
              </div>
              <p className="card-subtitle">
                Issue secure usernames and passwords to interested notary advocates so only they can access the portal.
              </p>
            </div>
          </div>

          {accountCreatedMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '8px',
                color: '#065F46',
                fontWeight: 700,
                fontSize: '0.84rem',
                marginBottom: '1.25rem',
              }}
            >
              ✓ {accountCreatedMsg}
            </div>
          )}

          {/* Form to issue a new username and password */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ margin: '0 0 0.85rem', fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserPlus size={16} color="#B91C1C" />
              <span>Create & Issue New Notary Credentials</span>
            </h3>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Advocate Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Adv. Rajesh Verma"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notary Reg. No.</label>
                <input
                  type="text"
                  className="form-input"
                  value={newRegNo}
                  onChange={(e) => setNewRegNo(e.target.value)}
                  placeholder="e.g. Reg. No. 12480"
                />
              </div>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Assign Username *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. rajesh"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assign Password *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="e.g. notary123"
                />
              </div>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Jurisdiction / Court</label>
                <input
                  type="text"
                  className="form-input"
                  value={newJurisdiction}
                  onChange={(e) => setNewJurisdiction(e.target.value)}
                  placeholder="e.g. Patiala House Courts, New Delhi"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  placeholder="e.g. +91 98110 54321"
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-seal"
              onClick={handleCreateAccount}
              style={{ fontWeight: 700 }}
            >
              <PlusCircle size={15} />
              <span>Issue Credentials & Authorize Access</span>
            </button>
          </div>

          {/* List of currently authorized accounts */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.86rem', fontWeight: 800, color: '#334155' }}>
              Currently Authorized Notaries ({accounts.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {accounts.map((acc) => (
                <div
                  key={acc.username}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '0.83rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>
                      {acc.profile.notaryName}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      {acc.profile.regNo} • {acc.profile.areaOfPractice}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right', fontSize: '0.76rem' }}>
                      <div>User: <strong style={{ color: '#B91C1C' }}>{acc.username}</strong></div>
                      <div>Pass: <strong style={{ color: '#0F172A' }}>{acc.password}</strong></div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleCopyCredentials(acc)}
                      title="Copy credentials for sharing"
                      style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                    >
                      {copiedId === acc.username ? (
                        <>
                          <Check size={13} color="#059669" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incoming Access Requests Table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageCircle size={15} color="#059669" />
                <span>Interested Notaries - Access Requests ({accessRequests.length})</span>
              </h4>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Submitted from Login Page
              </span>
            </div>

            {accessRequests.length === 0 ? (
              <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
                No pending access requests.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {accessRequests.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: req.status === 'approved' ? '#F0FDF4' : '#FFFFFF',
                      border: `1px solid ${req.status === 'approved' ? '#BBF7D0' : '#E2E8F0'}`,
                      borderRadius: '8px',
                      fontSize: '0.83rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: '#0F172A' }}>{req.applicantName}</span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: req.status === 'approved' ? '#DCFCE7' : '#FEF3C7',
                            color: req.status === 'approved' ? '#15803D' : '#B45309',
                          }}
                        >
                          {req.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                        {req.regNo} • {req.jurisdiction} • Mobile: {req.mobile}
                      </div>
                      {req.notes && (
                        <div style={{ fontSize: '0.72rem', color: '#475569', fontStyle: 'italic', marginTop: '2px' }}>
                          "{req.notes}"
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <a
                        href={`https://wa.me/${req.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${req.applicantName}! Regarding your access request for the Digital Notary Desk portal.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', color: '#059669', borderColor: '#A7F3D0' }}
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle size={13} />
                        <span>WhatsApp</span>
                      </a>

                      {req.status !== 'approved' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleApproveRequest(req)}
                          style={{ padding: '4px 8px', fontSize: '0.74rem', fontWeight: 700 }}
                        >
                          <span>Issue Login</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', marginBottom: '2rem' }}>
          <button type="submit" className="btn btn-seal btn-lg">
            <Save size={18} />
            Save Profile Settings
          </button>
        </div>
      </form>
    </div>
  );
};
