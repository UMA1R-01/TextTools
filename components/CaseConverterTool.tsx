import React, { useState } from 'react';
import { CaseMethod } from '../types';
import { Button } from './ui/Button';

// Icons
const CaseIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CopyIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export const CaseConverterTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // Stats
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleConvert = (method: CaseMethod) => {
    if (!inputText.trim()) return;

    // Local deterministic processing
    let result = '';
    switch (method) {
      case CaseMethod.UPPERCASE:
        result = inputText.toUpperCase();
        break;
      case CaseMethod.LOWERCASE:
        result = inputText.toLowerCase();
        break;
      case CaseMethod.TITLE_CASE:
        // Capitalize first letter of every word
        result = inputText.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
        break;
      case CaseMethod.SENTENCE_CASE:
        // Capitalize first letter of sentences. Crude regex approximation.
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case CaseMethod.CAMEL_CASE:
        result = inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        // Remove non-alphanumeric at start
        result = result.replace(/^[^a-z0-9]+/, '');
        break;
      case CaseMethod.SNAKE_CASE:
        result = inputText
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w_]/g, '');
        break;
      case CaseMethod.KEBAB_CASE:
        result = inputText
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        break;
      default:
        result = inputText;
    }
    setOutputText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tool Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CaseIcon />
            Case Converter
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Transform text casing instantly.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearAll} icon={<TrashIcon />}>Clear</Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Convert</span>
        
        {/* Basic Group */}
        <div className="flex gap-1">
            <Button variant="secondary" size="sm" onClick={() => handleConvert(CaseMethod.UPPERCASE)}>UPPERCASE</Button>
            <Button variant="secondary" size="sm" onClick={() => handleConvert(CaseMethod.LOWERCASE)}>lowercase</Button>
            <Button variant="secondary" size="sm" onClick={() => handleConvert(CaseMethod.TITLE_CASE)}>Title Case</Button>
            <Button variant="secondary" size="sm" onClick={() => handleConvert(CaseMethod.SENTENCE_CASE)}>Sentence case</Button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden lg:block"></div>

        {/* Code Group */}
        <div className="flex gap-1">
            <Button variant="secondary" size="sm" onClick={() => handleConvert(CaseMethod.CAMEL_CASE)}>camelCase</Button>
            <Button variant="secondary" size="sm" onClick={() => handleConvert(CaseMethod.SNAKE_CASE)}>snake_case</Button>
            <Button variant="secondary" size="sm" onClick={() => handleConvert(CaseMethod.KEBAB_CASE)}>kebab-case</Button>
        </div>
      </div>

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Input Pane */}
        <div className="flex-1 flex flex-col min-h-[300px] border-b md:border-b-0 md:border-r border-slate-200 relative group">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none z-10" />
          <textarea
            className="flex-1 p-6 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed bg-white"
            placeholder="Type or paste content here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            spellCheck={false}
          />
          <div className="absolute bottom-3 right-4 text-xs text-slate-400 bg-white/80 px-2 py-1 rounded backdrop-blur-sm border border-slate-100 flex gap-3">
             <span>{wordCount} words</span>
             <span>{charCount} chars</span>
          </div>
        </div>

        {/* Output Pane */}
        <div className="flex-1 flex flex-col min-h-[300px] bg-slate-50/50 relative group">
           <div className="absolute top-3 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" size="sm" onClick={copyToClipboard} icon={<CopyIcon />}>Copy</Button>
           </div>
          <textarea
            className="flex-1 p-6 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed bg-transparent"
            placeholder="Converted text will appear here..."
            value={outputText}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};