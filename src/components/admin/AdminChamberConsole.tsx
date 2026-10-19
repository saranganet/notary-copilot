import React, { useState, useEffect } from 'react';
import type { NotaryAccount, NotaryProfile, FirebaseConfig, AuthAuditEntry } from '../../types/notary';
import { StorageService } from '../../services/storageService';
import { firebaseSync } from '../../services/firebaseSyncService';
import {
  Shield,
  Users,
  Key,
  Copy,
  Check,
  Plus,
  Search,
  Cloud,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  ExternalLink,
  Building2,
  Trash2,
  X,
  Sparkles,
  Server,
  UserCheck,
} from 'lucide-react';

interface AdminChamberConsoleProps {
  currentAccount: NotaryAccount;
  onSwitchToChamber: (profile: NotaryProfile) => void;
  onClose: () => void;
}

export const AdminChamberConsole: React.FC<AdminChamberConsoleProps> = ({
  currentAccount,
  onSwitchToChamber,
  onClose,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'accounts' | 'storage' | 'audit'>('accounts');
  const [accounts, setAccounts] = useState<NotaryAccount[]>(() => StorageService.getAccounts());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [auditLogs, setAuditLogs] = useState<AuthAuditEntry[]>(() => StorageService.getAuthAuditLogs());
  const [copiedUser, setCopiedUser] = useState<string | null>(null);

  // New Account Modal State
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newFirmName, setNewFirmName] = useState<string>('');
  const [newQual, setNewQual] = useState<string>('B.A., LL.B., Advocate & Notary Public');
  const [newRegNo, setNewRegNo] = useState<string>('Reg. No. ');
  const [newArea, setNewArea] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('');
  const [newMobile, setNewMobile] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');
  const [createdSummary, setCreatedSummary] = useState<{
    username: string;
    pass: string;
    name: string;
    regNo: string;
  } | null>(null);

  // Reset Password State
  const [resetPassUser, setResetPassUser] = useState<string | null>(null);
  const [newResetPassValue, setNewResetPassValue] = useState<string>('');

  // Cloud Config State
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });
  const [isCloudConfigured, setIsCloudConfigured] = useState<boolean>(firebaseSync.isConfigured());
  const [cloudStatusMsg, setCloudStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    async function loadCloudConfig() {
      const saved = await firebaseSync.getConfig();
      if (saved) {
        setFirebaseConfig(saved);
        setIsCloudConfigured(true);
      }
    }
    loadCloudConfig();
  }, []);

  const refreshAccounts = () => {
    const list = StorageService.getAccounts();
    setAccounts(list);
    setAuditLogs(StorageService.getAuthAuditLogs());
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let res = '';
    for (let i = 0; i < 9; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const handleOpenNewModal = () => {
    setNewUsername('');
    setNewPassword(generateRandomPassword());
    setNewName('');
    setNewFirmName('');
    setNewQual('B.A., LL.B., Advocate & Notary Public');
    setNewRegNo('Reg. No. ');
    setNewArea('');
    setNewAddress('');
    setNewMobile('');
    setNewEmail('');
    setNewNotes('');
    setCreatedSummary(null);
    setShowNewModal(true);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim() || !newName.trim()) {
      alert('Please fill in username, password, and advocate name.');
      return;
    }

    const cleanUsername = newUsername.trim().toLowerCase();

    // Check if username already exists
    if (accounts.some((a) => a.username.toLowerCase() === cleanUsername)) {
      alert(`Username "${cleanUsername}" is already assigned to another notary. Please choose another.`);
      return;
    }

    const newProfile: NotaryProfile = {
      firmName: newFirmName.trim() || `${newName.trim()} & Associates Legal Chamber`,
      notaryName: newName.trim(),
      qualifications: newQual.trim(),
      regNo: newRegNo.trim() || 'Reg. No. Pending / Govt. of India',
      areaOfPractice: newArea.trim() || 'District & Sessions Court Jurisdiction',
      officeAddress: newAddress.trim() || 'District Court Complex, Advocates Block',
      mobile: newMobile.trim() || '+91 ',
      email: newEmail.trim() || `${cleanUsername}@notary.in`,
      verificationDomain: `${cleanUsername}.notary.in`,
      physicalStampingPreference: true,
    };

    const newAcc: NotaryAccount = {
      username: cleanUsername,
      password: newPassword.trim(),
      role: 'notary',
      profile: newProfile,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      notes: newNotes.trim(),
    };

    StorageService.saveAccount(newAcc);
    StorageService.logAuthEvent(
      newProfile.email,
      'ACCOUNT_CREATED',
      'SUCCESS',
      `SuperAdmin created client chamber "${cleanUsername}" for ${newName}`
    );

    refreshAccounts();
    setCreatedSummary({
      username: cleanUsername,
      pass: newPassword.trim(),
      name: newName.trim(),
      regNo: newProfile.regNo,
    });
  };

  const handleCopyCredentials = (acc: NotaryAccount) => {
    const text = `🏛️ *DIGITAL NOTARY DESK - CHAMBER LOGIN CREDENTIALS*
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Advocate:* ${acc.profile.notaryName}
🏛️ *Chamber:* ${acc.profile.firmName}
📜 *Govt Reg:* ${acc.profile.regNo}
🌐 *Portal URL:* ${window.location.origin}

🔑 *YOUR LOGIN DETAILS:*
• *Username:* ${acc.username}
• *Password:* ${acc.password}

ℹ️ *Instructions:*
1. Open ${window.location.origin}
2. Enter your assigned username and password.
3. Your biometric scanner, passport capture, and Form XV statutory register will be immediately active.
━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    navigator.clipboard.writeText(text);
    setCopiedUser(acc.username);
    setTimeout(() => setCopiedUser(null), 2500);
  };

  const handleToggleStatus = (acc: NotaryAccount) => {
    if (acc.username.toLowerCase() === 'admin') {
      alert('Master Admin account cannot be suspended.');
      return;
    }
    const newStatus = acc.status === 'suspended' ? 'active' : 'suspended';
    const updated = { ...acc, status: newStatus as 'active' | 'suspended' };
    StorageService.saveAccount(updated);
    refreshAccounts();
  };

  const handleDeleteAccount = (acc: NotaryAccount) => {
    if (acc.username.toLowerCase() === 'admin') {
      alert('Master Admin account cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete client chamber "${acc.username}" (${acc.profile.notaryName})?`)) {
      const remaining = accounts.filter((a) => a.username.toLowerCase() !== acc.username.toLowerCase());
      localStorage.setItem('notary_accounts_v2', JSON.stringify(remaining));
      refreshAccounts();
    }
  };

  const handleSaveResetPassword = () => {
    if (!resetPassUser || !newResetPassValue.trim()) return;
    const acc = accounts.find((a) => a.username.toLowerCase() === resetPassUser.toLowerCase());
    if (acc) {
      const updated = { ...acc, password: newResetPassValue.trim() };
      StorageService.saveAccount(updated);
      StorageService.logAuthEvent(
        acc.profile.email,
        'PASSWORD_RESET',
        'SUCCESS',
        `Password reset by Master Admin for chamber ${acc.username}`
      );
      refreshAccounts();
      setResetPassUser(null);
      setNewResetPassValue('');
    }
  };

  const handleSaveCloudConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setCloudStatusMsg({ type: 'info', text: 'Validating and connecting to Google Cloud Firebase...' });

    const res = await firebaseSync.saveConfig(firebaseConfig);
    if (res.success) {
      setIsCloudConfigured(true);
      setCloudStatusMsg({ type: 'success', text: res.message });
    } else {
      setCloudStatusMsg({ type: 'error', text: res.message });
    }
  };

  const handleSyncAllToCloud = async () => {
    if (!isCloudConfigured) {
      alert('Please configure and test Firebase connection first.');
      return;
    }
    setIsSyncing(true);
    setCloudStatusMsg({ type: 'info', text: 'Synchronizing all chambers and registers to Cloud Firestore...' });

    try {
      await firebaseSync.syncAccountsToCloud(accounts);
      let totalActs = 0;
      for (const acc of accounts) {
        const chamberActs = StorageService.getActs(acc.profile);
        totalActs += await firebaseSync.syncAllActsToCloud(chamberActs, acc.username);
      }
      setIsSyncing(false);
      setCloudStatusMsg({
        type: 'success',
        text: `Cloud sync complete! Backed up ${accounts.length} client chambers and ${totalActs} notarial acts.`,
      });
    } catch (err: unknown) {
      setIsSyncing(false);
      const errMsg = err instanceof Error ? err.message : String(err);
      setCloudStatusMsg({ type: 'error', text: `Sync failed: ${errMsg}` });
    }
  };

  const handleWipeAllData = async () => {
    if (
      !window.confirm(
        'Are you sure you want to completely wipe all user data (notarial acts, drafts, biometric scans, client records) across all users? This will clean all registers to 0 entries.'
      )
    ) {
      return;
    }
    const res = await StorageService.wipeAllUserData();
    refreshAccounts();
    setCloudStatusMsg({
      type: 'success',
      text: `Complete Wipe Executed: ${res.wipedActs} acts and ${res.wipedDrafts} drafts wiped across all chambers. Registers are now fresh.`,
    });
  };

  const filteredAccounts = accounts.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.username.toLowerCase().includes(q) ||
      a.profile.notaryName.toLowerCase().includes(q) ||
      a.profile.regNo.toLowerCase().includes(q) ||
      a.profile.firmName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-console-overlay">
      <div className="admin-console-container">
        {/* Top Header */}
        <div className="admin-header">
          <div className="admin-header-title">
            <div className="admin-shield-icon">
              <Shield size={24} color="#FFFFFF" />
            </div>
            <div>
              <div className="admin-badge-row">
                <h2>Platform Master Console</h2>
                <span className="admin-status-pill">Super Admin ({currentAccount.username}) • Full Control</span>
              </div>
              <p className="admin-header-desc">
                Generate client credentials, manage chambers, and ensure continuous cloud storage for all records.
              </p>
            </div>
          </div>
          <button type="button" className="admin-close-btn" onClick={onClose} title="Close Console">
            <X size={20} />
          </button>
        </div>

        {/* Stats Row */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
              <Users size={20} />
            </div>
            <div>
              <span className="stat-label">Total Chambers</span>
              <span className="stat-value">{accounts.length}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#ECFDF5', color: '#047857' }}>
              <UserCheck size={20} />
            </div>
            <div>
              <span className="stat-label">Active Clients</span>
              <span className="stat-value">{accounts.filter((a) => a.status !== 'suspended').length}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#FEF3C7', color: '#B45309' }}>
              <Database size={20} />
            </div>
            <div>
              <span className="stat-label">Local Engine</span>
              <span className="stat-value" style={{ fontSize: '15px', color: '#047857', fontWeight: 600 }}>
                IndexedDB (Unlimited)
              </span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-wrapper" style={{ background: isCloudConfigured ? '#ECFDF5' : '#F3F4F6', color: isCloudConfigured ? '#047857' : '#6B7280' }}>
              <Cloud size={20} />
            </div>
            <div>
              <span className="stat-label">Google Cloud Status</span>
              <span className="stat-value" style={{ fontSize: '14px', color: isCloudConfigured ? '#047857' : '#B45309', fontWeight: 600 }}>
                {isCloudConfigured ? 'Connected & Active' : 'Offline / Standby'}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="admin-nav-bar">
          <button
            type="button"
            className={`admin-nav-tab ${activeSubTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('accounts')}
          >
            <Users size={16} />
            <span>Client Chambers ({accounts.length})</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeSubTab === 'storage' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('storage')}
          >
            <Cloud size={16} />
            <span>Permanent Storage & Firebase</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeSubTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('audit')}
          >
            <Server size={16} />
            <span>Statutory Audit Logs</span>
          </button>
        </div>

        {/* Tab 1: Client Chambers */}
        {activeSubTab === 'accounts' && (
          <div className="admin-content-section">
            <div className="admin-actions-bar">
              <div className="admin-search-box">
                <Search size={16} color="#9CA3AF" />
                <input
                  type="text"
                  placeholder="Search by advocate name, username, or Govt Reg No..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleOpenNewModal}
              >
                <Plus size={16} />
                <span>Provision New Client Chamber</span>
              </button>
            </div>

            {/* Chambers Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Advocate & Chamber</th>
                    <th>Username & Role</th>
                    <th>Govt Reg No</th>
                    <th>Jurisdiction</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((acc) => {
                    const isMaster = acc.username.toLowerCase() === 'admin';
                    const isSuspended = acc.status === 'suspended';

                    return (
                      <tr key={acc.username} className={isSuspended ? 'row-suspended' : ''}>
                        <td>
                          <div className="chamber-cell-main">
                            <span className="chamber-adv-name">{acc.profile.notaryName}</span>
                            <span className="chamber-firm-name">{acc.profile.firmName}</span>
                          </div>
                        </td>
                        <td>
                          <div className="username-cell">
                            <span className="username-badge">{acc.username}</span>
                            {isMaster && <span className="role-tag-admin">Super Admin</span>}
                          </div>
                        </td>
                        <td>
                          <span className="reg-badge">{acc.profile.regNo}</span>
                        </td>
                        <td>
                          <span className="area-text">{acc.profile.areaOfPractice || 'Not specified'}</span>
                        </td>
                        <td>
                          {isSuspended ? (
                            <span className="status-pill suspended">Suspended</span>
                          ) : (
                            <span className="status-pill active">Active</span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions-cell">
                            {/* Copy Credentials */}
                            <button
                              type="button"
                              className="action-icon-btn copy-btn"
                              title="Copy WhatsApp/Email Credentials Card"
                              onClick={() => handleCopyCredentials(acc)}
                            >
                              {copiedUser === acc.username ? <Check size={15} color="#059669" /> : <Copy size={15} />}
                            </button>

                            {/* Reset Password */}
                            <button
                              type="button"
                              className="action-icon-btn"
                              title="Change / Reset Password"
                              onClick={() => {
                                setResetPassUser(acc.username);
                                setNewResetPassValue(generateRandomPassword());
                              }}
                            >
                              <Key size={15} />
                            </button>

                            {/* Toggle Suspend */}
                            {!isMaster && (
                              <button
                                type="button"
                                className="action-icon-btn"
                                title={isSuspended ? 'Activate Account' : 'Suspend Account'}
                                onClick={() => handleToggleStatus(acc)}
                              >
                                {isSuspended ? <Unlock size={15} color="#059669" /> : <Lock size={15} color="#D97706" />}
                              </button>
                            )}

                            {/* Switch to this chamber desk */}
                            <button
                              type="button"
                              className="action-icon-btn launch-btn"
                              title="Enter & Inspect Chamber Desk"
                              onClick={() => onSwitchToChamber(acc.profile)}
                            >
                              <ExternalLink size={15} />
                            </button>

                            {/* Delete */}
                            {!isMaster && (
                              <button
                                type="button"
                                className="action-icon-btn delete-btn"
                                title="Delete Chamber"
                                onClick={() => handleDeleteAccount(acc)}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Permanent Storage & Firebase Settings */}
        {activeSubTab === 'storage' && (
          <div className="admin-content-section">
            <div className="storage-info-banner">
              <div className="storage-info-icon">
                <Database size={28} color="#B91C1C" />
              </div>
              <div className="storage-info-text">
                <h3>Dual-Tier "Forever Online" Storage Architecture</h3>
                <p>
                  To ensure clients <strong>never face QuotaExceededError crashes</strong> and records stay online permanently:
                </p>
                <ul>
                  <li>
                    <strong>Tier 1 (Local Engine):</strong> Native high-capacity <strong>IndexedDB</strong> stores all registers, drafts, and 500 DPI biometric thumbprints without quota limits, even completely offline.
                  </li>
                  <li>
                    <strong>Tier 2 (Cloud Backup):</strong> Connect your <strong>Google Firebase</strong> project to back up acts to Cloud Firestore and offload biometric images to Cloud Storage.
                  </li>
                </ul>
              </div>
            </div>

            {/* Cloud Status Message */}
            {cloudStatusMsg && (
              <div className={`cloud-alert-banner ${cloudStatusMsg.type}`}>
                {cloudStatusMsg.type === 'success' && <CheckCircle2 size={18} />}
                {cloudStatusMsg.type === 'error' && <AlertCircle size={18} />}
                {cloudStatusMsg.type === 'info' && <RefreshCw size={18} className="spin" />}
                <span>{cloudStatusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveCloudConfig} className="admin-cloud-form">
              <div className="form-section-title">
                <h4>Firebase Project Credentials</h4>
                <p>Paste the keys from your Firebase Console (Project Settings → General → Your Apps).</p>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Firebase API Key</label>
                  <input
                    type="text"
                    placeholder="AIzaSy..."
                    value={firebaseConfig.apiKey}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Project ID</label>
                  <input
                    type="text"
                    placeholder="notary-copilot-prod"
                    value={firebaseConfig.projectId}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Auth Domain</label>
                  <input
                    type="text"
                    placeholder="notary-copilot-prod.firebaseapp.com"
                    value={firebaseConfig.authDomain}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Storage Bucket</label>
                  <input
                    type="text"
                    placeholder="notary-copilot-prod.appspot.com"
                    value={firebaseConfig.storageBucket}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, storageBucket: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>App ID</label>
                  <input
                    type="text"
                    placeholder="1:123456789:web:abcdef"
                    value={firebaseConfig.appId}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Messaging Sender ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    value={firebaseConfig.messagingSenderId}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, messagingSenderId: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-button-row">
                <button type="submit" className="admin-btn-primary">
                  <Cloud size={16} />
                  <span>Save & Connect Firebase</span>
                </button>

                {isCloudConfigured && (
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={handleSyncAllToCloud}
                    disabled={isSyncing}
                  >
                    <RefreshCw size={16} className={isSyncing ? 'spin' : ''} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync All Chambers & Acts to Cloud'}</span>
                  </button>
                )}

                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={handleWipeAllData}
                  style={{ borderColor: '#EF4444', color: '#EF4444', marginLeft: 'auto' }}
                  title="Wipe all notarial acts, drafts, and client records across all users"
                >
                  <Trash2 size={16} color="#EF4444" />
                  <span>Wipe All User Data</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Audit Logs */}
        {activeSubTab === 'audit' && (
          <div className="admin-content-section">
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Account / Email</th>
                    <th>Event</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '12px', color: '#6B7280' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: 600 }}>{log.email}</td>
                      <td>
                        <span className="log-event-tag">{log.eventType}</span>
                      </td>
                      <td>
                        {log.status === 'SUCCESS' ? (
                          <span className="status-pill active">Success</span>
                        ) : (
                          <span className="status-pill suspended">Failed</span>
                        )}
                      </td>
                      <td style={{ fontSize: '13px', color: '#374151' }}>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Provision New Client Chamber */}
      {showNewModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Building2 size={22} color="#B91C1C" />
                <h3>Provision New Client Chamber</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowNewModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            {createdSummary ? (
              <div className="created-success-card">
                <div className="success-banner">
                  <CheckCircle2 size={24} color="#059669" />
                  <div>
                    <h4>Client Chamber Created Successfully!</h4>
                    <p>The client can now log in immediately with these credentials.</p>
                  </div>
                </div>

                <div className="credentials-receipt">
                  <div className="cred-row">
                    <span className="cred-label">Portal URL:</span>
                    <span className="cred-val">{window.location.origin}</span>
                  </div>
                  <div className="cred-row">
                    <span className="cred-label">Advocate:</span>
                    <span className="cred-val">{createdSummary.name}</span>
                  </div>
                  <div className="cred-row">
                    <span className="cred-label">Govt Reg:</span>
                    <span className="cred-val">{createdSummary.regNo}</span>
                  </div>
                  <div className="cred-row highlight">
                    <span className="cred-label">Username:</span>
                    <span className="cred-val mono">{createdSummary.username}</span>
                  </div>
                  <div className="cred-row highlight">
                    <span className="cred-label">Password:</span>
                    <span className="cred-val mono">{createdSummary.pass}</span>
                  </div>
                </div>

                <div className="receipt-actions">
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={() => {
                      const acc = accounts.find((a) => a.username === createdSummary.username);
                      if (acc) handleCopyCredentials(acc);
                    }}
                  >
                    <Copy size={16} />
                    <span>Copy WhatsApp/Email Card</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => setShowNewModal(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateAccount} className="modal-form">
                <div className="form-sub-header">
                  <span>1. Login Credentials (Client will log in with these)</span>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Assigned Username <span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. adv_deshmukh, rahul_notary"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      required
                    />
                    <small>Unique handle for login (no spaces).</small>
                  </div>

                  <div className="form-group">
                    <label>Assigned Password <span className="req">*</span></label>
                    <div className="password-input-wrapper">
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="regen-pass-btn"
                        title="Generate New Password"
                        onClick={() => setNewPassword(generateRandomPassword())}
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-sub-header">
                  <span>2. Statutory Advocate & Chamber Profile</span>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Advocate Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Adv. Rahul S. Deshmukh"
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value);
                        if (!newUsername) {
                          const suggested = e.target.value
                            .toLowerCase()
                            .replace(/^(adv(\.|ocate)?)\s+/i, '')
                            .trim()
                            .split(/\s+/)[0];
                          if (suggested) setNewUsername(suggested);
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Govt. Registration No. <span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Reg. No. 18920 / Govt. of India"
                      value={newRegNo}
                      onChange={(e) => setNewRegNo(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Law Firm / Chamber Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Deshmukh Law Associates & Notary Desk"
                      value={newFirmName}
                      onChange={(e) => setNewFirmName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Area of Practice / Jurisdiction</label>
                    <input
                      type="text"
                      placeholder="e.g. Kalyan, Dombivli & Thane District"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Office Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Chamber 14, District Court, Kalyan"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      placeholder="+91 98..."
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="advocate@chamber.in"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Internal Chamber Notes (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Annual Notary Subscription 2026"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => setShowNewModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    <Sparkles size={16} />
                    <span>Create & Provision Chamber</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {resetPassUser && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card small">
            <div className="modal-header">
              <div className="modal-title-group">
                <Key size={20} color="#B91C1C" />
                <h3>Reset Password for "{resetPassUser}"</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setResetPassUser(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-pad">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                New Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type="text"
                  value={newResetPassValue}
                  onChange={(e) => setNewResetPassValue(e.target.value)}
                />
                <button
                  type="button"
                  className="regen-pass-btn"
                  onClick={() => setNewResetPassValue(generateRandomPassword())}
                  title="Generate Random"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setResetPassUser(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleSaveResetPassword}
              >
                Save New Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
