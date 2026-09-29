import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { NotarialAct, NotaryProfile, LegalDraft } from '../../types/notary';
import type { Language } from '../../i18n/translations';
import { StorageService } from '../../services/storageService';
import { LEGAL_TEMPLATES, NOTARY_SNIPPETS } from '../../services/templateService';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Undo2,
  Redo2,
  Printer,
  FileDown,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  FilePlus,
  Save,
  Trash2,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  Scale,
  FileText,
} from 'lucide-react';

interface NotaryDocumentEditorProps {
  acts: NotarialAct[];
  profile: NotaryProfile;
  lang?: Language;
}

export const NotaryDocumentEditor: React.FC<NotaryDocumentEditorProps> = ({ acts, profile, lang = 'en' }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Active Draft State
  const [draftId, setDraftId] = useState<string>(() => `draft-${Date.now()}`);
  const [docTitle, setDocTitle] = useState<string>('General Affidavit - Solemn Affirmation');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(LEGAL_TEMPLATES[0].id);
  const [selectedActId, setSelectedActId] = useState<string>(acts[0]?.id || '');
  const [savedDrafts, setSavedDrafts] = useState<LegalDraft[]>(() => StorageService.getDrafts());
  
  // UI Indicators
  const [copied, setCopied] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('Ready');
  const [showDraftsMenu, setShowDraftsMenu] = useState<boolean>(false);

  // Formatting state for active toolbar buttons
  const [fontFamily, setFontFamily] = useState<string>('Times New Roman');
  const [fontSize, setFontSize] = useState<string>('12pt');
  const [lineHeight, setLineHeight] = useState<string>('1.6');
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('justify');

  // Stats
  const [stats, setStats] = useState({ words: 0, characters: 0, paragraphs: 1 });

  // History stack for custom undo/redo
  const historyStack = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const isUndoRedoAction = useRef<boolean>(false);

  const activeAct = acts.find((a) => a.id === selectedActId) || acts[0];

  // Calculate statistics
  const updateStats = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length || 1;
    setStats({ words, characters, paragraphs });
  }, []);

  // Push to history
  const pushHistory = useCallback((html: string) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    // Truncate future if branched
    historyStack.current = historyStack.current.slice(0, historyIndex.current + 1);
    historyStack.current.push(html);
    historyIndex.current = historyStack.current.length - 1;
  }, []);

  // Update active formatting states based on current selection
  const checkSelectionFormat = useCallback(() => {
    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      
      if (document.queryCommandState('justifyCenter')) setAlignment('center');
      else if (document.queryCommandState('justifyRight')) setAlignment('right');
      else if (document.queryCommandState('justifyFull')) setAlignment('justify');
      else setAlignment('left');
    } catch {
      // Ignore if document.queryCommandState is unsupported in edge cases
    }
  }, []);

  // Initial Content Load
  useEffect(() => {
    // Check if there is an autosaved current draft
    const current = StorageService.getCurrentDraft();
    if (current && editorRef.current) {
      setDraftId(current.id);
      setDocTitle(current.title);
      editorRef.current.innerHTML = current.contentHtml;
      pushHistory(current.contentHtml);
      updateStats();
    } else if (editorRef.current) {
      // Load default template with current act data
      const defaultHtml = LEGAL_TEMPLATES[0].generateHtml(activeAct, profile);
      editorRef.current.innerHTML = defaultHtml;
      pushHistory(defaultHtml);
      updateStats();
    }
  }, []);

  // Autosave logic (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!editorRef.current) return;
      const html = editorRef.current.innerHTML;
      const draft: LegalDraft = {
        id: draftId,
        title: docTitle,
        contentHtml: html,
        stampPaperMargin: false,
        actId: selectedActId,
        updatedAt: new Date().toISOString(),
      };
      StorageService.saveCurrentDraft(draft);
      setSaveStatus('Autosaved');
    }, 1200);

    return () => clearTimeout(timer);
  }, [docTitle, draftId, selectedActId]);

  // Execute standard formatting commands
  const execCmd = (command: string, value: string = '') => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      pushHistory(editorRef.current.innerHTML);
    }
    updateStats();
    checkSelectionFormat();
  };

  // Undo Handler
  const handleUndo = () => {
    if (historyIndex.current > 0) {
      historyIndex.current -= 1;
      isUndoRedoAction.current = true;
      if (editorRef.current) {
        editorRef.current.innerHTML = historyStack.current[historyIndex.current];
      }
      updateStats();
    }
  };

  // Redo Handler
  const handleRedo = () => {
    if (historyIndex.current < historyStack.current.length - 1) {
      historyIndex.current += 1;
      isUndoRedoAction.current = true;
      if (editorRef.current) {
        editorRef.current.innerHTML = historyStack.current[historyIndex.current];
      }
      updateStats();
    }
  };

  // Insert HTML snippet at current cursor selection
  const insertHtmlAtCursor = (html: string) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const frag = document.createDocumentFragment();
      let node;
      let lastNode;
      while ((node = tempDiv.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else if (editorRef.current) {
      editorRef.current.innerHTML += html;
    }
    if (editorRef.current) {
      pushHistory(editorRef.current.innerHTML);
    }
    updateStats();
    setSaveStatus('Modified');
  };

  // Handle Clean Paste
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');

    if (htmlData) {
      // Clean Microsoft Word and web formatting artifacts
      const cleaned = htmlData
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<o:p>[\s\S]*?<\/o:p>/gi, '')
        .replace(/class="[^"]*"/gi, '')
        .replace(/style="[^"]*mso-[^"]*"/gi, '')
        .replace(/<span[^>]*>\s*<\/span>/gi, '');

      insertHtmlAtCursor(cleaned);
    } else if (textData) {
      // Insert plain text with preserved paragraphs
      const paragraphs = textData
        .split(/\r?\n\r?\n/)
        .map((p) => `<p style="margin-bottom: 12px; text-align: justify;">${p.replace(/\r?\n/g, '<br/>')}</p>`)
        .join('');
      insertHtmlAtCursor(paragraphs);
    }
  };

  // Load a chosen Template
  const handleLoadTemplate = (templateId: string) => {
    const tmpl = LEGAL_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;

    if (editorRef.current) {
      const generated = tmpl.generateHtml(activeAct, profile);
      editorRef.current.innerHTML = generated;
      setDocTitle(tmpl.title);
      setSelectedTemplateId(templateId);
      pushHistory(generated);
      updateStats();
      setSaveStatus('Template Loaded');
    }
  };

  // Save to Draft Library
  const handleSaveToLibrary = () => {
    if (!editorRef.current) return;
    const draft: LegalDraft = {
      id: draftId,
      title: docTitle.trim() || 'Untitled Notary Draft',
      contentHtml: editorRef.current.innerHTML,
      stampPaperMargin: false,
      actId: selectedActId,
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveDraft(draft);
    setSavedDrafts(StorageService.getDrafts());
    setSaveStatus('Saved in Library');
    setTimeout(() => setSaveStatus('Autosaved'), 2000);
  };

  // Load a saved draft from library
  const handleLoadSavedDraft = (draft: LegalDraft) => {
    setDraftId(draft.id);
    setDocTitle(draft.title);
    if (editorRef.current) {
      editorRef.current.innerHTML = draft.contentHtml;
      pushHistory(draft.contentHtml);
      updateStats();
    }
    setShowDraftsMenu(false);
    setSaveStatus('Draft Loaded');
  };

  // Delete draft from library
  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.deleteDraft(id);
    setSavedDrafts(StorageService.getDrafts());
  };

  // New Blank Document
  const handleNewDocument = () => {
    const newId = `draft-${Date.now()}`;
    setDraftId(newId);
    setDocTitle('New Legal Draft');
    if (editorRef.current) {
      const blankTmpl = LEGAL_TEMPLATES.find((t) => t.id === 'blank-document');
      const content = blankTmpl ? blankTmpl.generateHtml(activeAct, profile) : '<p>Type or paste here...</p>';
      editorRef.current.innerHTML = content;
      pushHistory(content);
      updateStats();
    }
    setSaveStatus('New Draft');
  };

  // Print Document
  const handlePrint = () => {
    window.print();
  };

  // Download as Word .doc
  const handleDownloadWordDoc = () => {
    const cleanFileName = docTitle.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'Notary-Legal-Draft';
    const content = editorRef.current?.innerHTML || '';
    const topMargin = '25mm';

    const wordHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${docTitle}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: A4 portrait;
      margin: ${topMargin} 20mm 20mm 20mm;
      mso-page-orientation: portrait;
    }
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000000;
      text-align: justify;
    }
    h2 { font-size: 16pt; text-align: center; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; }
    td { vertical-align: top; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;

    const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanFileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy Clean Text
  const handleCopyText = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut listener (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+P, Ctrl+S)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        execCmd('bold');
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        execCmd('italic');
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        execCmd('underline');
      } else if (e.key === 'z' || e.key === 'Z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleSaveToLibrary();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handlePrint();
      }
    }
  };

  return (
    <div className="notary-editor-container">
      {/* 1. TOP HEADER & DOCUMENT ACTIONS BAR (No-Print) */}
      <div className="notary-editor-header no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
          <div className="editor-icon-badge" title="Legal Document Studio">
            <FileText size={20} color="var(--color-seal-red)" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => {
                setDocTitle(e.target.value);
                setSaveStatus('Modified');
              }}
              className="editor-title-input"
              placeholder="Enter Legal Document Title..."
              title="Click to rename document"
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#64748B' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 600 }}>
                <CheckCircle2 size={12} />
                {saveStatus}
              </span>
              <span>•</span>
              <span>Adv. Nileema Saranga</span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Saved Drafts Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowDraftsMenu(!showDraftsMenu)}
            >
              <span>Saved Drafts ({savedDrafts.length})</span>
              <ChevronDown size={13} />
            </button>

            {showDraftsMenu && (
              <div className="editor-dropdown-panel" style={{ right: 0, width: '280px' }}>
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #E2E8F0', fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>
                  YOUR SAVED DRAFTS
                </div>
                <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                  {savedDrafts.length === 0 ? (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem' }}>
                      No saved drafts yet. Click "Save Draft" to keep a copy!
                    </div>
                  ) : (
                    savedDrafts.map((d) => (
                      <div
                        key={d.id}
                        className="editor-dropdown-item"
                        onClick={() => handleLoadSavedDraft(d)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <div style={{ minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {d.title}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                            {new Date(d.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteDraft(d.id, e)}
                          title="Delete draft"
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '2px' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* New Blank Doc */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleNewDocument}
            title={lang === 'mr' ? 'नवीन कोरा दस्तऐवज सुरू करा' : lang === 'hi' ? 'नया कोरा दस्तावेज़ शुरू करें' : 'Start a new blank document'}
          >
            <FilePlus size={14} />
            <span>{lang === 'mr' ? 'नवीन' : lang === 'hi' ? 'नया' : 'New'}</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleSaveToLibrary}
            title={lang === 'mr' ? 'मसुदा जतन करा' : lang === 'hi' ? 'मसौदा सहेजें' : 'Save draft to local storage'}
          >
            <Save size={14} />
            <span>{lang === 'mr' ? 'जतन करा' : lang === 'hi' ? 'सहेजें' : 'Save Draft'}</span>
          </button>

          {/* Copy Clean Text */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopyText}
            title={lang === 'mr' ? 'मजकूर क्लिपबोर्डवर कॉपी करा' : lang === 'hi' ? 'टेक्स्ट कॉपी करें' : 'Copy document text to clipboard'}
          >
            {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
            <span>{copied ? (lang === 'mr' ? 'कॉपी झाले ✓' : lang === 'hi' ? 'कॉपी हुआ ✓' : 'Copied') : (lang === 'mr' ? 'कॉपी' : lang === 'hi' ? 'कॉपी' : 'Copy')}</span>
          </button>

          {/* Export Word .doc */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleDownloadWordDoc}
            title={lang === 'mr' ? 'मायक्रोसॉफ्ट वर्ड (.doc) फाईल डाऊनलोड करा' : lang === 'hi' ? 'माइक्रोसॉफ्ट वर्ड (.doc) फ़ाइल डाउनलोड करें' : 'Download document in Microsoft Word (.doc) format'}
          >
            <FileDown size={14} />
            <span>Word (.doc)</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handlePrint}
            title={lang === 'mr' ? 'दस्तऐवज किंवा स्टॅम्प पेपरवर थेट प्रिंट करा (Ctrl+P)' : lang === 'hi' ? 'दस्तावेज़ अथवा स्टाम्प पेपर पर सीधे प्रिंट करें (Ctrl+P)' : 'Print document directly on A4 paper or Stamp Paper (Ctrl+P)'}
          >
            <Printer size={14} />
            <span>{lang === 'mr' ? 'प्रिंट करा' : lang === 'hi' ? 'प्रिंट करें' : 'Print Draft'}</span>
          </button>
        </div>
      </div>

      {/* 2. LEGAL SNIPPETS & DATA INTEGRATION DECK (No-Print) */}
      <div className="notary-quick-deck no-print">
        {/* Template Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="deck-label">
            <Sparkles size={14} color="var(--color-accent)" />
            <strong>{lang === 'mr' ? 'कायदेशीर नमुना:' : lang === 'hi' ? 'विधिक प्रारूप:' : 'Legal Template:'}</strong>
          </span>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '240px', padding: '0.3rem 0.75rem', fontSize: '0.82rem' }}
            value={selectedTemplateId}
            onChange={(e) => handleLoadTemplate(e.target.value)}
          >
            {LEGAL_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {lang === 'mr' ? (t.marathiTitle || t.title) : lang === 'hi' ? (t.hindiTitle || t.title) : t.title}
              </option>
            ))}
          </select>

          {/* Client Case Selector */}
          <span className="deck-label" style={{ marginLeft: '0.5rem' }}>
            <UserCheck size={14} color="#059669" />
            <strong>{lang === 'mr' ? 'पक्षकार प्रकरण:' : lang === 'hi' ? 'पक्षकार प्रकरण:' : 'Client Case:'}</strong>
          </span>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '220px', padding: '0.3rem 0.75rem', fontSize: '0.82rem' }}
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

        {/* Quick Insert Snippet Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className="deck-label" style={{ fontSize: '0.76rem', color: '#64748B' }}>
            {lang === 'mr' ? 'येथे जोडा:' : lang === 'hi' ? 'कर्सर पर जोड़ें:' : 'Insert at Cursor:'}
          </span>

          <button
            type="button"
            className="snippet-pill"
            onClick={() => insertHtmlAtCursor(NOTARY_SNIPPETS.juratClause(profile, activeAct))}
            title="Insert statutory Notary Attestation Jurat clause with serial number & seal details"
          >
            <Scale size={12} />
            {lang === 'mr' ? '+ नॉटरी जुराट' : lang === 'hi' ? '+ नोटरी जुराट' : '+ Notary Jurat'}
          </button>

          <button
            type="button"
            className="snippet-pill"
            onClick={() => {
              const party = activeAct?.parties[0];
              insertHtmlAtCursor(NOTARY_SNIPPETS.deponentClause(party));
            }}
            title="Insert deponent / executant identification clause with Aadhaar and address"
          >
            <UserCheck size={12} />
            {lang === 'mr' ? '+ शपथकर्ता तपशील' : lang === 'hi' ? '+ शपथकर्ता विवरण' : '+ Deponent Details'}
          </button>

          <button
            type="button"
            className="snippet-pill"
            onClick={() => insertHtmlAtCursor(NOTARY_SNIPPETS.verificationClause(profile, activeAct?.date))}
            title="Insert standard legal verification clause under Oaths Act"
          >
            {lang === 'mr' ? '+ पडताळणी' : lang === 'hi' ? '+ सत्यापन खंड' : '+ Verification'}
          </button>

          <button
            type="button"
            className="snippet-pill"
            onClick={() => insertHtmlAtCursor(NOTARY_SNIPPETS.signatureBlock())}
            title="Insert Deponent and Advocate identification signature table"
          >
            {lang === 'mr' ? '+ स्वाक्षरी तक्ता' : lang === 'hi' ? '+ हस्ताक्षर तालिका' : '+ Signatures Table'}
          </button>

          <button
            type="button"
            className="snippet-pill"
            onClick={() => {
              const todayStr = new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });
              insertHtmlAtCursor(`<strong>${todayStr}</strong>`);
            }}
            title="Insert today's execution date"
          >
            {lang === 'mr' ? '+ तारीख' : lang === 'hi' ? '+ तिथि' : '+ Date'}
          </button>
        </div>
      </div>

      {/* 3. RICH TEXT WYSIWYG FORMATTING TOOLBAR (No-Print) */}
      <div className="notary-editor-toolbar no-print">
        {/* Undo / Redo */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={handleUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={handleRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={15} />
          </button>
        </div>

        {/* Font Family Selector */}
        <div className="toolbar-group">
          <select
            className="toolbar-select font-select"
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              execCmd('fontName', e.target.value);
            }}
            title="Font Family"
          >
            <option value="Times New Roman">Times New Roman (Court Default)</option>
            <option value="Calibri">Calibri</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Noto Sans Devanagari, Mangal">मराठी / Devanagari</option>
          </select>
        </div>

        {/* Font Size Selector */}
        <div className="toolbar-group">
          <select
            className="toolbar-select size-select"
            value={fontSize}
            onChange={(e) => {
              setFontSize(e.target.value);
              // Wrap selection or set font size
              execCmd('fontSize', '3'); // standard base
              if (editorRef.current) {
                // Apply inline font size style
                document.execCommand('styleWithCSS', false, 'true');
              }
            }}
            title="Font Size"
          >
            <option value="10pt">10 pt</option>
            <option value="11pt">11 pt</option>
            <option value="12pt">12 pt (Standard Legal)</option>
            <option value="14pt">14 pt (Headings)</option>
            <option value="16pt">16 pt (Document Title)</option>
            <option value="18pt">18 pt</option>
          </select>
        </div>

        {/* Line Spacing Selector */}
        <div className="toolbar-group">
          <select
            className="toolbar-select"
            style={{ width: '105px' }}
            value={lineHeight}
            onChange={(e) => setLineHeight(e.target.value)}
            title="Line Spacing (1.5 Legal is standard)"
          >
            <option value="1.2">Single (1.2)</option>
            <option value="1.6">1.5 Legal (1.6)</option>
            <option value="2.0">Double (2.0)</option>
          </select>
        </div>

        {/* Text Style: Bold, Italic, Underline */}
        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-btn ${isBold ? 'active' : ''}`}
            onClick={() => execCmd('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${isItalic ? 'active' : ''}`}
            onClick={() => execCmd('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${isUnderline ? 'active' : ''}`}
            onClick={() => execCmd('underline')}
            title="Underline (Ctrl+U)"
          >
            <Underline size={15} />
          </button>
        </div>

        {/* Text Alignment: Left, Center, Right, Justify */}
        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-btn ${alignment === 'left' ? 'active' : ''}`}
            onClick={() => execCmd('justifyLeft')}
            title="Align Left"
          >
            <AlignLeft size={15} />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${alignment === 'center' ? 'active' : ''}`}
            onClick={() => execCmd('justifyCenter')}
            title="Align Center"
          >
            <AlignCenter size={15} />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${alignment === 'right' ? 'active' : ''}`}
            onClick={() => execCmd('justifyRight')}
            title="Align Right"
          >
            <AlignRight size={15} />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${alignment === 'justify' ? 'active' : ''}`}
            onClick={() => execCmd('justifyFull')}
            title="Justify (Standard Legal Alignment)"
          >
            <AlignJustify size={15} />
          </button>
        </div>

        {/* Lists & Indentation */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCmd('insertOrderedList')}
            title="Numbered Legal Clauses (1, 2, 3...)"
          >
            <ListOrdered size={15} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCmd('insertUnorderedList')}
            title="Bullet Points"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCmd('indent')}
            title="Increase Indent (Tab)"
          >
            <Indent size={15} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCmd('outdent')}
            title="Decrease Indent (Shift+Tab)"
          >
            <Outdent size={15} />
          </button>
        </div>

        {/* Clear Formatting / Reset */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCmd('removeFormat')}
            title="Clear Formatting"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* 4. REALISTIC A4 PAPER CANVAS */}
      <div className="legal-editor-canvas">
        <div
          className="legal-editor-sheet"
          style={{
            fontFamily: fontFamily,
            fontSize: fontSize,
            lineHeight: lineHeight,
          }}
        >
          {/* Editable Document Body */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="legal-editable-body"
            onInput={() => {
              if (editorRef.current) {
                pushHistory(editorRef.current.innerHTML);
              }
              updateStats();
              setSaveStatus('Typing...');
            }}
            onKeyUp={checkSelectionFormat}
            onMouseUp={checkSelectionFormat}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            spellCheck={true}
          />
        </div>
      </div>

      {/* 5. EDITOR STATUS BAR (No-Print) */}
      <div className="notary-editor-statusbar no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span><strong>Words:</strong> {stats.words}</span>
          <span><strong>Characters:</strong> {stats.characters}</span>
          <span><strong>Paragraphs:</strong> {stats.paragraphs}</span>
          <span><strong>Estimated Pages:</strong> {Math.max(1, Math.ceil(stats.words / 450))} A4</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748B' }}>
          <span>Font: <strong>{fontFamily}</strong> ({fontSize})</span>
          <span>•</span>
          <span>Alignment: <strong>{alignment.toUpperCase()}</strong></span>
        </div>
      </div>
    </div>
  );
};
