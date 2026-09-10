import React, { useState } from 'react';
import type {
  NotarialAct,
  NotaryProfile,
  Party,
  PartyRole,
  DocumentType,
  IdentificationType,
} from '../../types/notary';
import { StorageService } from '../../services/storageService';
import { WebcamModal } from '../capture/WebcamModal';
import { FingerprintModal } from '../capture/FingerprintModal';
import { SignatureModal } from '../capture/SignatureModal';
import { TRANSLATIONS, type Language } from '../../i18n/translations';
import {
  Camera,
  Fingerprint,
  PenTool,
  Plus,
  Trash2,
  CheckCircle2,
  Printer,
  FileCheck,
  Sparkles,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';

interface NotaryDeskProps {
  profile: NotaryProfile;
  lang?: Language;
  onViewCertificate: (act: NotarialAct) => void;
  onActSaved: (act: NotarialAct) => void;
}

export const NotaryDesk: React.FC<NotaryDeskProps> = ({
  lang = 'en',
  onViewCertificate,
  onActSaved,
}) => {
  const t = TRANSLATIONS[lang];

  // Generate next serial number (editable and auto-incremented)
  const [serialNo, setSerialNo] = useState<string>(() => StorageService.getNextSerialNo());
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [docType, setDocType] = useState<DocumentType>('Rental Agreement');
  const [customTitle, setCustomTitle] = useState<string>(
    lang === 'mr' ? 'निवासी भाडेकरार (११ महिने)' : 'Residential Tenancy Agreement (11 Months)'
  );
  const [stampValue, setStampValue] = useState<number>(100);
  const [feesCharged, setFeesCharged] = useState<number>(500);
  const [bookNo, setBookNo] = useState<number>(1);
  const [pageNo, setPageNo] = useState<number>(28);

  const handleResetToNewEntry = () => {
    setSerialNo(StorageService.getNextSerialNo());
    setDate(new Date().toISOString().split('T')[0]);
    setDocType('Rental Agreement');
    setCustomTitle(
      lang === 'mr' ? 'निवासी भाडेकरार (११ महिने)' : 'Residential Tenancy Agreement (11 Months)'
    );
    setStampValue(100);
    setFeesCharged(500);
    setParties([
      {
        id: 'party-1',
        role: 'Owner',
        name: '',
        relationType: 'S/o',
        relativeName: '',
        age: '45',
        address: '',
        idType: 'Aadhaar Card',
        idNumber: '',
        mobile: '',
        signatureMode: 'physical',
      },
      {
        id: 'party-2',
        role: 'Tenant',
        name: '',
        relationType: 'S/o',
        relativeName: '',
        age: '30',
        address: '',
        idType: 'Aadhaar Card',
        idNumber: '',
        mobile: '',
        signatureMode: 'physical',
      },
      {
        id: 'party-3',
        role: 'Witness',
        name: '',
        relationType: 'S/o',
        relativeName: '',
        age: '35',
        address: '',
        idType: 'Aadhaar Card',
        idNumber: '',
        mobile: '',
        signatureMode: 'physical',
      },
    ]);
  };

  // Initial parties matching standard Rental Agreement (Owner, Tenant, Witness)
  const [parties, setParties] = useState<Party[]>([
    {
      id: 'party-1',
      role: 'Owner',
      name: '',
      relationType: 'S/o',
      relativeName: '',
      age: '45',
      address: '',
      idType: 'Aadhaar Card',
      idNumber: '',
      mobile: '',
      signatureMode: 'physical',
    },
    {
      id: 'party-2',
      role: 'Tenant',
      name: '',
      relationType: 'S/o',
      relativeName: '',
      age: '30',
      address: '',
      idType: 'Aadhaar Card',
      idNumber: '',
      mobile: '',
      signatureMode: 'physical',
    },
    {
      id: 'party-3',
      role: 'Witness',
      name: '',
      relationType: 'S/o',
      relativeName: '',
      age: '35',
      address: '',
      idType: 'Aadhaar Card',
      idNumber: '',
      mobile: '',
      signatureMode: 'physical',
    },
  ]);

  // Modal active states
  const [activeWebcamParty, setActiveWebcamParty] = useState<Party | null>(null);
  const [activeFingerprintParty, setActiveFingerprintParty] = useState<Party | null>(null);
  const [activeSignatureParty, setActiveSignatureParty] = useState<Party | null>(null);

  // Switch document preset
  const handleDocTypeChange = (newType: DocumentType) => {
    setDocType(newType);
    if (newType === 'Rental Agreement') {
      setCustomTitle(
        lang === 'mr' ? 'निवासी भाडेकरार (११ महिने)' : 'Residential Tenancy Agreement (11 Months)'
      );
      setStampValue(100);
      setFeesCharged(500);
      setParties([
        {
          id: 'p-1',
          role: 'Owner',
          name: '',
          relationType: 'S/o',
          relativeName: '',
          age: '45',
          address: '',
          idType: 'Aadhaar Card',
          idNumber: '',
          mobile: '',
          signatureMode: 'physical',
        },
        {
          id: 'p-2',
          role: 'Tenant',
          name: '',
          relationType: 'S/o',
          relativeName: '',
          age: '30',
          address: '',
          idType: 'Aadhaar Card',
          idNumber: '',
          mobile: '',
          signatureMode: 'physical',
        },
        {
          id: 'p-3',
          role: 'Witness',
          name: '',
          relationType: 'S/o',
          relativeName: '',
          age: '35',
          address: '',
          idType: 'Aadhaar Card',
          idNumber: '',
          mobile: '',
          signatureMode: 'physical',
        },
      ]);
    } else if (newType.includes('Affidavit')) {
      setCustomTitle(newType);
      setStampValue(100);
      setFeesCharged(250);
      setParties([
        {
          id: 'p-1',
          role: 'Deponent',
          name: '',
          relationType: 'S/o',
          relativeName: '',
          age: '32',
          address: '',
          idType: 'Aadhaar Card',
          idNumber: '',
          mobile: '',
          signatureMode: 'physical',
        },
        {
          id: 'p-2',
          role: 'Witness',
          name: '',
          relationType: 'S/o',
          relativeName: '',
          age: '40',
          address: '',
          idType: 'Voter ID',
          idNumber: '',
          mobile: '',
          signatureMode: 'physical',
        },
      ]);
    } else if (newType === 'Other Legal Document') {
      setCustomTitle('');
      setStampValue(100);
      setFeesCharged(500);
      setParties([
        {
          id: 'p-1',
          role: 'Executant',
          name: '',
          relationType: 'S/o',
          relativeName: '',
          age: '35',
          address: '',
          idType: 'Aadhaar Card',
          idNumber: '',
          mobile: '',
          signatureMode: 'physical',
        },
        {
          id: 'p-2',
          role: 'Witness',
          name: '',
          relationType: 'S/o',
          relativeName: '',
          age: '35',
          address: '',
          idType: 'Aadhaar Card',
          idNumber: '',
          mobile: '',
          signatureMode: 'physical',
        },
      ]);
    } else {
      setCustomTitle(newType);
    }
  };

  const handleAddParty = (role: PartyRole = 'Executant') => {
    const newParty: Party = {
      id: 'party-' + Date.now(),
      role,
      name: '',
      relationType: 'S/o',
      relativeName: '',
      age: '35',
      address: '',
      idType: 'Aadhaar Card',
      idNumber: '',
      mobile: '',
      signatureMode: 'physical',
    };
    setParties((prev) => [...prev, newParty]);
  };

  const handleRemoveParty = (id: string) => {
    if (parties.length <= 1) return;
    setParties((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePartyChange = (id: string, field: keyof Party, value: any) => {
    setParties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Quick autofill sample client data (No Ramesh Kumhar, clean Indian parties)
  const handleAutofillRentalDemo = () => {
    setDocType('Rental Agreement');
    setCustomTitle(
      lang === 'mr' ? 'निवासी भाडेकरार (११ महिने)' : 'Residential Tenancy Agreement (11 Months)'
    );
    setParties([
      {
        id: 'p-demo-1',
        role: 'Owner',
        name: lang === 'mr' ? 'राजेश अनंत पाटील' : 'Rajesh Anant Patil',
        relationType: 'S/o',
        relativeName: lang === 'mr' ? 'अनंत पाटील' : 'Anant Patil',
        age: '46',
        address: lang === 'mr' ? 'प्लॉट १२, सहकार नगर, पुणे ४११००९' : 'Plot 12, Sahakar Nagar, Pune 411009',
        idType: 'Aadhaar Card',
        idNumber: '984211223344',
        mobile: '9822101010',
        photoUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="#F1F5F9"/><circle cx="100" cy="90" r="45" fill="#0284C7"/><path d="M40 220 C40 160, 160 160, 160 220 Z" fill="#0284C7" opacity="0.85"/><text x="100" y="100" font-size="26" font-family="sans-serif" font-weight="bold" fill="#FFFFFF" text-anchor="middle">RP</text></svg>`),
        fingerprintUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="#FFFFFF"/><g stroke="#1E293B" stroke-width="2.2" fill="none"><path d="M100 40 C60 40, 45 80, 45 120 C45 165, 65 200, 100 200 C135 200, 155 165, 155 120 C155 80, 140 40, 100 40 Z"/><circle cx="100" cy="120" r="3" fill="#1E293B"/></g></svg>`),
        fingerprintQuality: 93,
        signatureMode: 'physical',
      },
      {
        id: 'p-demo-2',
        role: 'Tenant',
        name: lang === 'mr' ? 'संजय प्रकाश देशमुख' : 'Sanjay Prakash Deshmukh',
        relationType: 'S/o',
        relativeName: lang === 'mr' ? 'प्रकाश देशमुख' : 'Prakash Deshmukh',
        age: '31',
        address: lang === 'mr' ? 'फ्लॅट ३०२, साई रेसिडेन्सी, कोथरूड, पुणे ४११०३८' : 'Flat 302, Sai Residency, Kothrud, Pune 411038',
        idType: 'PAN Card',
        idNumber: 'ABCDE1234F',
        mobile: '9823445566',
        photoUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="#F1F5F9"/><circle cx="100" cy="90" r="45" fill="#0D9488"/><path d="M40 220 C40 160, 160 160, 160 220 Z" fill="#0D9488" opacity="0.85"/><text x="100" y="100" font-size="26" font-family="sans-serif" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SD</text></svg>`),
        fingerprintUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="#FFFFFF"/><g stroke="#1E293B" stroke-width="2.2" fill="none"><path d="M100 40 C60 40, 45 80, 45 120 C45 165, 65 200, 100 200 C135 200, 155 165, 155 120 C155 80, 140 40, 100 40 Z"/><circle cx="100" cy="120" r="3" fill="#1E293B"/></g></svg>`),
        fingerprintQuality: 91,
        signatureMode: 'physical',
      },
      {
        id: 'p-demo-3',
        role: 'Witness',
        name: lang === 'mr' ? 'अमित दत्तात्रय शिंदे' : 'Amit Dattatray Shinde',
        relationType: 'S/o',
        relativeName: lang === 'mr' ? 'दत्तात्रय शिंदे' : 'Dattatray Shinde',
        age: '38',
        address: lang === 'mr' ? 'शिवाजी नगर, पुणे ४११००५' : 'Shivaji Nagar, Pune 411005',
        idType: 'Aadhaar Card',
        idNumber: '776655443322',
        mobile: '9822778899',
        photoUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="#F1F5F9"/><circle cx="100" cy="90" r="45" fill="#4F46E5"/><path d="M40 220 C40 160, 160 160, 160 220 Z" fill="#4F46E5" opacity="0.85"/><text x="100" y="100" font-size="26" font-family="sans-serif" font-weight="bold" fill="#FFFFFF" text-anchor="middle">AS</text></svg>`),
        fingerprintUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="#FFFFFF"/><g stroke="#1E293B" stroke-width="2.2" fill="none"><path d="M100 40 C60 40, 45 80, 45 120 C45 165, 65 200, 100 200 C135 200, 155 165, 155 120 C155 80, 140 40, 100 40 Z"/><circle cx="100" cy="120" r="3" fill="#1E293B"/></g></svg>`),
        fingerprintQuality: 95,
        signatureMode: 'physical',
      },
    ]);
  };

  // Build the complete Notarial Act
  const constructAct = (): NotarialAct => {
    const finalDocTitle =
      customTitle.trim() ||
      (docType === 'Other Legal Document'
        ? lang === 'mr'
          ? 'इतर कायदेशीर दस्तऐवज'
          : 'Other Legal Document'
        : docType);

    return {
      id: 'act-' + Date.now(),
      serialNo: serialNo.trim() || StorageService.getNextSerialNo(),
      date,
      documentType: docType,
      customDocumentTitle: finalDocTitle,
      parties,
      feesCharged,
      stampValue,
      bookNo,
      pageNo,
      watermark: 'Preview',
      verifiedToken: `${serialNo.replace(/[^A-Za-z0-9]/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'Completed',
    };
  };

  const handleSaveAndPrint = () => {
    const act = constructAct();
    StorageService.saveAct(act);
    onActSaved(act);
    onViewCertificate(act);
    // Advance serialNo for next entry
    setSerialNo(StorageService.getNextSerialNo());
  };

  return (
    <div>
      {/* Top Banner with Quick Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileCheck size={28} color="var(--color-seal-red)" />
            {t.deskTitle}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            {t.deskSubtitle}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleResetToNewEntry}
            title={lang === 'mr' ? 'नवीन कोरी नोंद सुरू करा' : 'Start a fresh blank entry'}
          >
            <RotateCcw size={15} />
            {lang === 'mr' ? 'नवीन कोरी नोंद' : 'New Blank Entry'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleAutofillRentalDemo}
            title="Load sample client entry"
          >
            <Sparkles size={16} color="var(--color-accent)" />
            {t.fillDemoBtn}
          </button>
          <button
            type="button"
            className="btn btn-seal"
            onClick={handleSaveAndPrint}
            style={{ fontWeight: 700 }}
          >
            <Printer size={18} />
            {t.generatePrintBtn}
          </button>
        </div>
      </div>

      {/* 1. Document Details & Presets Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">{t.docDetailsTitle}</h2>
            <p className="card-subtitle">{t.docDetailsSubtitle}</p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F1F5F9',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {t.serialNoLabel}:
            </span>
            <input
              type="text"
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.92rem',
                color: 'var(--color-seal-red)',
                background: '#FFFFFF',
                width: '135px',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid #94A3B8',
                textAlign: 'center',
              }}
              title={lang === 'mr' ? 'नोंदणी अनुक्रमांक (आपोआप वाढतो किंवा हस्ते बदलता येतो)' : 'Serial Number (Auto-increments, editable)'}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSerialNo(StorageService.getNextSerialNo())}
              style={{ padding: '2px 6px', fontSize: '0.75rem', height: '26px' }}
              title={lang === 'mr' ? 'पुढील अनुक्रमांक आपोआप आणा' : 'Auto-advance to next serial'}
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">{t.docTypeLabel}</label>
            <select
              className="form-select"
              value={docType}
              onChange={(e) => handleDocTypeChange(e.target.value as DocumentType)}
            >
              <option value="Rental Agreement">{lang === 'mr' ? 'भाडेकरार (Tenancy)' : 'Rental Agreement (Tenancy)'}</option>
              <option value="General Affidavit">{lang === 'mr' ? 'सामान्य शपथपत्र (General Affidavit)' : 'General Affidavit'}</option>
              <option value="Name Change Affidavit">{lang === 'mr' ? 'नाव बदल शपथपत्र (Name Change)' : 'Name Change Affidavit'}</option>
              <option value="Gap Certificate Affidavit">{lang === 'mr' ? 'शैक्षणिक गॅप शपथपत्र (Gap Certificate)' : 'Educational Gap Year Affidavit'}</option>
              <option value="Address Proof Affidavit">{lang === 'mr' ? 'पत्ता पुरावा शपथपत्र' : 'Address Proof Affidavit'}</option>
              <option value="Vehicle Sale Agreement">{lang === 'mr' ? 'वाहन खरेदी-विक्री करार / NOC' : 'Vehicle Sale Agreement / NOC'}</option>
              <option value="Special Power of Attorney">{lang === 'mr' ? 'विशेष कुलमुखत्यारपत्र (SPA)' : 'Special Power of Attorney (SPA)'}</option>
              <option value="General Power of Attorney">{lang === 'mr' ? 'कुलमुखत्यारपत्र (GPA)' : 'General Power of Attorney (GPA)'}</option>
              <option value="Indemnity Bond">{lang === 'mr' ? 'नुकसान भरपाई बंधपत्र (Indemnity Bond)' : 'Indemnity Bond'}</option>
              <option value="Declaration">{lang === 'mr' ? 'सत्यप्रतिज्ञापत्र / घोषणापत्र' : 'Solemn Declaration'}</option>
              <option value="True Copy Attestation">{lang === 'mr' ? 'खऱ्या प्रतीचे साक्षांकन (True Copy)' : 'True Copy Document Attestation'}</option>
              <option value="Other Legal Document">{lang === 'mr' ? 'इतर कायदेशीर दस्तऐवज (Other Document)' : 'Other Legal Document'}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {t.docTitleLabel}
              {docType === 'Other Legal Document' && (
                <span
                  style={{
                    background: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  {lang === 'mr' ? 'प्रमाणपत्रावर छापले जाईल' : 'Will appear on Certificate'}
                </span>
              )}
            </label>
            <input
              type="text"
              className="form-input"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder={
                docType === 'Other Legal Document'
                  ? (lang === 'mr' ? 'उदा. बक्षीसपत्र (Gift Deed), खरेदीखत (Sale Deed), मृत्यूपत्र (Will)' : 'e.g. Gift Deed, Sale Deed, Will, Partnership Deed')
                  : 'e.g. Residential Tenancy Agreement'
              }
              style={
                docType === 'Other Legal Document'
                  ? { border: '2px solid var(--color-primary)', background: '#F8FAFC' }
                  : undefined
              }
              autoFocus={docType === 'Other Legal Document'}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.executionDateLabel}</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.feeChargedLabel}</label>
            <input
              type="number"
              className="form-input"
              value={feesCharged}
              onChange={(e) => setFeesCharged(Number(e.target.value))}
              placeholder="500"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.stampValueLabel}</label>
            <input
              type="number"
              className="form-input"
              value={stampValue}
              onChange={(e) => setStampValue(Number(e.target.value))}
              placeholder="100"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {lang === 'mr' ? 'वही क्र. (Book No.)' : 'Book No.'}
            </label>
            <input
              type="number"
              className="form-input"
              value={bookNo}
              onChange={(e) => setBookNo(Number(e.target.value))}
              placeholder="1"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {lang === 'mr' ? 'पान क्र. (Page No.)' : 'Page No.'}
            </label>
            <input
              type="number"
              className="form-input"
              value={pageNo}
              onChange={(e) => setPageNo(Number(e.target.value))}
              placeholder="28"
              required
            />
          </div>
        </div>
      </div>

      {/* 2. Executing Parties & Biometric Capture Station */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">{t.partiesTitle}</h2>
            <p className="card-subtitle">{t.partiesSubtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleAddParty('Witness')}
            >
              <Plus size={15} />
              {t.addWitnessBtn}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleAddParty('Executant')}
            >
              <Plus size={15} />
              {t.addExecutantBtn}
            </button>
          </div>
        </div>

        {/* List of Party Cards */}
        {parties.map((party, index) => {
          const isComplete = !!(party.name && party.idNumber && party.fingerprintUrl);

          return (
            <div
              key={party.id}
              className={`party-card ${isComplete ? 'verified' : ''}`}
            >
              <div className="party-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className={`role-badge ${party.role}`}>{party.role}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {party.name || `Party #${index + 1}`}
                  </span>
                  {isComplete && (
                    <span
                      style={{
                        color: 'var(--color-success)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <CheckCircle2 size={14} /> {t.readyForCert}
                    </span>
                  )}
                </div>

                {parties.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleRemoveParty(party.id)}
                    style={{ color: '#DC2626' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Party Information Inputs */}
              <div className="form-grid" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t.fullNameLabel}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={party.name}
                    onChange={(e) => handlePartyChange(party.id, 'name', e.target.value)}
                    placeholder={lang === 'mr' ? 'उदा. राजेश अनंत पाटील' : 'e.g. Rajesh Anant Patil'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t.relationLabel}</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <select
                      className="form-select"
                      style={{ width: '85px', flexShrink: 0 }}
                      value={party.relationType}
                      onChange={(e) => handlePartyChange(party.id, 'relationType', e.target.value)}
                    >
                      <option value="S/o">S/o</option>
                      <option value="D/o">D/o</option>
                      <option value="W/o">W/o</option>
                      <option value="C/o">C/o</option>
                    </select>
                    <input
                      type="text"
                      className="form-input"
                      value={party.relativeName}
                      onChange={(e) => handlePartyChange(party.id, 'relativeName', e.target.value)}
                      placeholder={lang === 'mr' ? 'उदा. अनंत पाटील' : 'e.g. Anant Patil'}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.idProofLabel}</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <select
                      className="form-select"
                      style={{ width: '130px', flexShrink: 0 }}
                      value={party.idType}
                      onChange={(e) => handlePartyChange(party.id, 'idType', e.target.value as IdentificationType)}
                    >
                      <option value="Aadhaar Card">Aadhaar</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">DL</option>
                    </select>
                    <input
                      type="text"
                      className="form-input"
                      value={party.idNumber}
                      onChange={(e) => handlePartyChange(party.id, 'idNumber', e.target.value)}
                      placeholder="ID No (e.g. 984211223344)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.mobileLabel}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={party.mobile}
                    onChange={(e) => handlePartyChange(party.id, 'mobile', e.target.value)}
                    placeholder="e.g. 9822101010"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">{t.addressLabel}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={party.address}
                    onChange={(e) => handlePartyChange(party.id, 'address', e.target.value)}
                    placeholder={lang === 'mr' ? 'उदा. प्लॉट १२, सहकार नगर, पुणे ४११००९' : 'e.g. Plot 12, Sahakar Nagar, Pune 411009'}
                  />
                </div>
              </div>

              {/* Biometric Capture Slots for this Party */}
              <div className="biometric-tray">
                {/* 1. Digital Photo Slot */}
                <div
                  className={`biometric-slot ${party.photoUrl ? 'has-data' : ''}`}
                  onClick={() => setActiveWebcamParty(party)}
                >
                  {party.photoUrl ? (
                    <img
                      src={party.photoUrl}
                      alt="Party Photo"
                      className="biometric-preview-img"
                    />
                  ) : (
                    <>
                      <Camera size={26} color="var(--color-text-muted)" />
                      <span className="biometric-slot-label">{t.takePhotoBtn}</span>
                    </>
                  )}
                  {party.photoUrl && <div className="biometric-slot-status">✓</div>}
                </div>

                {/* 2. SecuGen Fingerprint Scanner Slot */}
                <div
                  className={`biometric-slot ${party.fingerprintUrl ? 'has-data' : ''}`}
                  onClick={() => setActiveFingerprintParty(party)}
                >
                  {party.fingerprintUrl ? (
                    <img
                      src={party.fingerprintUrl}
                      alt="Thumb Impression"
                      className="biometric-preview-img"
                    />
                  ) : (
                    <>
                      <Fingerprint size={26} color="var(--color-text-muted)" />
                      <span className="biometric-slot-label">{t.scanThumbBtn}</span>
                    </>
                  )}
                  {party.fingerprintUrl && <div className="biometric-slot-status">✓</div>}
                </div>

                {/* 3. Signature Slot */}
                <div
                  className={`biometric-slot ${party.signatureUrl || party.signatureMode === 'physical' ? 'has-data' : ''}`}
                  onClick={() => setActiveSignatureParty(party)}
                >
                  {party.signatureUrl && party.signatureMode === 'digital' ? (
                    <img
                      src={party.signatureUrl}
                      alt="Signature"
                      className="biometric-preview-img"
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <>
                      <PenTool size={24} color="var(--color-accent)" />
                      <span className="biometric-slot-label" style={{ color: 'var(--color-primary)' }}>
                        {t.paperSignBtn}
                      </span>
                      <span style={{ fontSize: '0.62rem', color: '#64748B' }}>
                        {t.physicalInkNote}
                      </span>
                    </>
                  )}
                  <div className="biometric-slot-status">✓</div>
                </div>

                {/* Status Guidance */}
                <div style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: '1.4' }}>
                  <p>
                    <strong>Biometric Status:</strong>
                  </p>
                  <ul style={{ paddingLeft: '1.1rem', marginTop: '2px', fontSize: '0.76rem' }}>
                    <li>
                      {t.certDigitalPhoto}: {party.photoUrl ? <span style={{ color: '#059669', fontWeight: 700 }}>{t.photoCaptured}</span> : 'Click camera box to take photo'}
                    </li>
                    <li>
                      SecuGen {t.certThumbImpression}: {party.fingerprintUrl ? <span style={{ color: '#059669', fontWeight: 700 }}>{t.thumbCaptured} ({party.fingerprintQuality || 93}%)</span> : 'Click fingerprint box to scan'}
                    </li>
                    <li>
                      {t.certSignature}: {party.signatureMode === 'physical' ? t.paperSignSelected : 'Digital canvas'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Submit Deck */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.5rem',
          padding: '1.25rem',
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            {lang === 'mr' ? 'नॉटरी प्रमाणपत्र तयार करण्यास तयार आहात का?' : 'Ready to finalize this Notarial Act?'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
            {lang === 'mr' ? 'प्रमाणपत्र तयार होईल व नमुना १५ नोंदवहीत नोंद आपोआप होईल.' : 'Will generate the official certificate and automatically record in Form XV register.'}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-seal btn-lg"
          onClick={handleSaveAndPrint}
          style={{ fontWeight: 700 }}
        >
          <Printer size={20} />
          {t.generatePrintBtn}
        </button>
      </div>

      {/* Modals for Camera, SecuGen Fingerprint, and Signature */}
      {activeWebcamParty && (
        <WebcamModal
          partyName={activeWebcamParty.name || activeWebcamParty.role}
          onCapture={(photoDataUrl) => {
            handlePartyChange(activeWebcamParty.id, 'photoUrl', photoDataUrl);
          }}
          onClose={() => setActiveWebcamParty(null)}
        />
      )}

      {activeFingerprintParty && (
        <FingerprintModal
          partyName={activeFingerprintParty.name || activeFingerprintParty.role}
          role={activeFingerprintParty.role}
          onCapture={(fingerprintUrl, qualityScore) => {
            handlePartyChange(activeFingerprintParty.id, 'fingerprintUrl', fingerprintUrl);
            handlePartyChange(activeFingerprintParty.id, 'fingerprintQuality', qualityScore);
            handlePartyChange(activeFingerprintParty.id, 'fingerprintCapturedAt', new Date().toISOString());
          }}
          onClose={() => setActiveFingerprintParty(null)}
        />
      )}

      {activeSignatureParty && (
        <SignatureModal
          partyName={activeSignatureParty.name || activeSignatureParty.role}
          role={activeSignatureParty.role}
          onSave={(signatureDataUrl, mode) => {
            handlePartyChange(activeSignatureParty.id, 'signatureUrl', signatureDataUrl);
            handlePartyChange(activeSignatureParty.id, 'signatureMode', mode);
          }}
          onClose={() => setActiveSignatureParty(null)}
        />
      )}
    </div>
  );
};
