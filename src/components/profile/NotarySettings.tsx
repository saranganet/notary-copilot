import React, { useState } from 'react';
import type { NotaryProfile } from '../../types/notary';
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
