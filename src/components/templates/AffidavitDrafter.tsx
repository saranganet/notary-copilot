import React, { useState } from 'react';
import { LEGAL_TEMPLATES } from '../../services/templateService';
import type { NotarialAct, NotaryProfile } from '../../types/notary';
import { FileText, Printer, Copy, Check } from 'lucide-react';

interface AffidavitDrafterProps {
  acts: NotarialAct[];
  profile: NotaryProfile;
}

export const AffidavitDrafter: React.FC<AffidavitDrafterProps> = ({ acts, profile }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(LEGAL_TEMPLATES[0].id);
  const [selectedActId, setSelectedActId] = useState<string>(acts[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const selectedTemplate = LEGAL_TEMPLATES.find((t) => t.id === selectedTemplateId) || LEGAL_TEMPLATES[0];
  const activeAct = acts.find((a) => a.id === selectedActId) || acts[0];

  const generatedDraftText = activeAct
    ? selectedTemplate.generateText(activeAct, profile)
    : 'Please select or create a notarial act to merge party information.';

  const handlePrintDraft = () => {
    window.print();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedDraftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="no-print" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileText size={28} color="var(--color-accent)" />
          Affidavit & Agreement Drafter
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Auto-merge client names, addresses, and ID proofs into statutory Indian legal drafts for printing on Non-Judicial Stamp Paper
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Template & Data Picker (Hidden in Print) */}
        <div className="no-print">
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.85rem', textTransform: 'uppercase', color: '#475569' }}>
              1. Select Legal Template
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {LEGAL_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: `1.5px solid ${selectedTemplateId === tmpl.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: selectedTemplateId === tmpl.id ? '#F0F9FF' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: selectedTemplateId === tmpl.id ? '#0369A1' : '#0F172A' }}>
                    {tmpl.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                    {tmpl.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.85rem', textTransform: 'uppercase', color: '#475569' }}>
              2. Merge Data from Client Act
            </h3>
            <div className="form-group">
              <label className="form-label">Choose Notarial Act</label>
              <select
                className="form-select"
                value={selectedActId}
                onChange={(e) => setSelectedActId(e.target.value)}
              >
                {acts.map((act) => (
                  <option key={act.id} value={act.id}>
                    {act.serialNo} - {act.parties[0]?.name || 'Act'} ({act.documentType})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: '1.4' }}>
                💡 <strong>Tip for Mom:</strong> Print this legal draft directly on your ₹100 Non-Judicial Stamp Paper or green ledger sheet, then attach the printed <strong>Notary Certificate</strong> with their photo & thumb impression!
              </div>
            </div>
          </div>
        </div>

        {/* Right Legal Draft Paper Preview */}
        <div>
          {/* Action Toolbar (Hidden in Print) */}
          <div
            className="no-print"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
              background: '#FFFFFF',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Draft Preview: <strong>{selectedTemplate.title}</strong>
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={handleCopyText}>
                {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
              <button className="btn btn-primary btn-sm" onClick={handlePrintDraft}>
                <Printer size={14} />
                Print Draft (Stamp Paper)
              </button>
            </div>
          </div>

          {/* Paper Sheet Preview */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              padding: '2.5rem 3rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              minHeight: '297mm',
              fontFamily: 'serif',
              fontSize: '1rem',
              lineHeight: '1.65',
              whiteSpace: 'pre-wrap',
              color: '#000000',
            }}
          >
            {generatedDraftText}
          </div>
        </div>
      </div>
    </div>
  );
};
