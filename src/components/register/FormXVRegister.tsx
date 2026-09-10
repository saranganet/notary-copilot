import React, { useState } from 'react';
import type { NotarialAct, NotaryProfile } from '../../types/notary';
import { TRANSLATIONS, type Language } from '../../i18n/translations';
import {
  BookOpen,
  Search,
  Printer,
  Download,
  Eye,
  FileText,
  DollarSign,
  CheckCircle,
  Plus,
} from 'lucide-react';

interface FormXVRegisterProps {
  acts: NotarialAct[];
  profile: NotaryProfile;
  lang?: Language;
  onViewCertificate: (act: NotarialAct) => void;
  onNewAct: () => void;
}

export const FormXVRegister: React.FC<FormXVRegisterProps> = ({
  acts,
  profile,
  lang = 'en',
  onViewCertificate,
  onNewAct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const t = TRANSLATIONS[lang];

  // Filter acts
  const filteredActs = acts.filter((act) => {
    const term = searchTerm.toLowerCase();
    const matchesSerial = act.serialNo.toLowerCase().includes(term);
    const matchesParty = act.parties.some(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.mobile.includes(term) ||
        p.address.toLowerCase().includes(term)
    );
    const matchesDoc = (act.customDocumentTitle || act.documentType)
      .toLowerCase()
      .includes(term);

    const matchesFilter =
      filterType === 'ALL' ||
      (filterType === 'RENTAL' && act.documentType === 'Rental Agreement') ||
      (filterType === 'AFFIDAVIT' && act.documentType.includes('Affidavit'));

    return (matchesSerial || matchesParty || matchesDoc) && matchesFilter;
  });

  // Calculate statistics
  const totalActs = acts.length;
  const totalFees = acts.reduce((acc, curr) => acc + (curr.feesCharged || 0), 0);
  const rentalActs = acts.filter((a) => a.documentType === 'Rental Agreement').length;
  const affidavitActs = acts.filter((a) => a.documentType.includes('Affidavit')).length;

  const handleExportCSV = () => {
    const headers = [
      'Serial No',
      'Date',
      'Executant Name',
      'Executant Address',
      'Identification Proof',
      'Identifier / Witness',
      'Document Nature',
      'Stamp Value (INR)',
      'Fee Charged (INR)',
      'Book No',
      'Page No',
      'Biometric Status',
    ];

    const rows = acts.map((act) => {
      const executant = act.parties.find((p) => p.role !== 'Witness') || act.parties[0];
      const witness = act.parties.find((p) => p.role === 'Witness');

      return [
        `"${act.serialNo}"`,
        `"${act.date}"`,
        `"${executant?.name || 'N/A'}"`,
        `"${executant?.address || 'N/A'}"`,
        `"${executant?.idType || ''} ${executant?.idNumber || ''}"`,
        `"${witness?.name || 'Advocate / Independent'}"`,
        `"${act.customDocumentTitle || act.documentType}"`,
        act.stampValue || 100,
        act.feesCharged || 0,
        act.bookNo || 1,
        act.pageNo || 1,
        executant?.fingerprintUrl ? 'Thumb Verified' : 'Paper Signed',
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Notarial_Register_Form_XV_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintRegister = () => {
    window.print();
  };

  return (
    <div>
      {/* Top Header & Summary KPI Cards */}
      <div className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BookOpen size={28} color="var(--color-seal-red)" />
              {t.registerTitle}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              {t.registerSubtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={handleExportCSV}>
              <Download size={16} />
              {t.regExportCsvBtn}
            </button>
            <button className="btn btn-secondary" onClick={handlePrintRegister}>
              <Printer size={16} />
              {t.regPrintRegisterBtn}
            </button>
            <button className="btn btn-seal" onClick={onNewAct}>
              <Plus size={18} />
              {t.tabDesk}
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                {t.regTotalActs}
              </span>
              <BookOpen size={20} color="#0284C7" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.35rem' }}>
              {totalActs}
            </div>
          </div>

          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                {t.regTotalFees}
              </span>
              <DollarSign size={20} color="#059669" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.35rem', color: '#059669' }}>
              ₹{totalFees.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                {t.regTenancyDocs}
              </span>
              <FileText size={20} color="#D97706" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.35rem' }}>
              {rentalActs}
            </div>
          </div>

          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                {t.regAffidavits}
              </span>
              <CheckCircle size={20} color="#7C3AED" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.35rem' }}>
              {affidavitActs}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
              <Search size={18} color="#64748B" />
              <input
                type="text"
                className="form-input"
                placeholder={t.regSearchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={`btn btn-sm ${filterType === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterType('ALL')}
              >
                {t.regAllFilter}
              </button>
              <button
                className={`btn btn-sm ${filterType === 'RENTAL' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterType('RENTAL')}
              >
                {t.regTenancyFilter}
              </button>
              <button
                className={`btn btn-sm ${filterType === 'AFFIDAVIT' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterType('AFFIDAVIT')}
              >
                {t.regAffidavitFilter}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Form XV Table (Formatted for Screen & Bound Register Print) */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', textTransform: 'uppercase' }}>
                {t.registerTitle}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#475569' }}>
                {lang === 'mr' ? 'नॉटरी:' : 'Notary Public:'} <strong>{profile.notaryName}</strong> | {profile.regNo} | {profile.areaOfPractice}
              </p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748B' }}>
              {t.certBookNo} <strong>1</strong> | Showing {filteredActs.length} of {acts.length} Entries
            </div>
          </div>
        </div>

        <div className="form-xv-table-wrapper">
          <table className="form-xv-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>{t.regColSNo}</th>
                <th style={{ width: '95px' }}>{t.regColDate}</th>
                <th>{t.regColExecutant}</th>
                <th>{t.regColAddress}</th>
                <th>{t.regColWitness}</th>
                <th>{t.regColNature}</th>
                <th style={{ width: '85px', textAlign: 'right' }}>{t.regColFee}</th>
                <th style={{ width: '110px', textAlign: 'center' }}>{t.regColBiometrics}</th>
                <th className="no-print" style={{ width: '90px', textAlign: 'center' }}>
                  {t.regColActions}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredActs.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                    {lang === 'mr' ? 'कोणतीही नोंद आढळली नाही.' : 'No notarial acts found matching your search.'}
                  </td>
                </tr>
              ) : (
                filteredActs.map((act) => {
                  const executants = act.parties.filter((p) => p.role !== 'Witness');
                  const witnesses = act.parties.filter((p) => p.role === 'Witness');

                  return (
                    <tr key={act.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {act.serialNo}
                      </td>
                      <td>{act.date}</td>
                      <td>
                        {executants.map((p, idx) => (
                          <div key={p.id} style={{ marginBottom: idx < executants.length - 1 ? '4px' : 0 }}>
                            <strong>{p.name}</strong>
                            <span style={{ fontSize: '0.7rem', color: '#64748B', marginLeft: '4px' }}>
                              ({p.role})
                            </span>
                          </div>
                        ))}
                      </td>
                      <td>
                        <div style={{ maxWidth: '240px', fontSize: '0.78rem', color: '#334155' }}>
                          {executants[0]?.address}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                          Mob: {executants[0]?.mobile}
                        </div>
                      </td>
                      <td>
                        {witnesses.length > 0 ? (
                          <div>
                            <strong>{witnesses[0].name}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                              {witnesses[0].address}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Identified by Adv.</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{act.customDocumentTitle || act.documentType}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          Stamp: ₹{act.stampValue || 100}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                        ₹{act.feesCharged}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {executants[0]?.fingerprintUrl ? (
                          <span
                            style={{
                              background: '#ECFDF5',
                              color: '#065F46',
                              border: '1px solid #A7F3D0',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <CheckCircle size={10} />
                            Thumb & Photo
                          </span>
                        ) : (
                          <span
                            style={{
                              background: '#F1F5F9',
                              color: '#475569',
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            Wet Ink
                          </span>
                        )}
                      </td>
                      <td className="no-print" style={{ textAlign: 'center' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewCertificate(act)}
                          title="View Official Certificate"
                          style={{ padding: '0.3rem 0.6rem' }}
                        >
                          <Eye size={14} />
                          {t.regViewBtn}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
