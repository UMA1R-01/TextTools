import React, { useState } from 'react';
import { CleanerMethod } from '../types';
import { Button } from './ui/Button';

// Icons
const BroomIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const CopyIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export const CleanerTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  // Stats
  const lineCount = inputText ? inputText.split(/\r\n|\r|\n/).length : 0;

  const handleClean = (method: CleanerMethod) => {
    if (!inputText) return;

    let result = '';
    const lines = inputText.split(/\r\n|\r|\n/);

    switch (method) {
      case CleanerMethod.REMOVE_DUPLICATES:
        // Use Set to remove duplicates while preserving order of first occurrence
        result = [...new Set(lines)].join('\n');
        break;
      
      case CleanerMethod.REMOVE_EMPTY_LINES:
        result = lines.filter(line => line.trim().length > 0).join('\n');
        break;

      case CleanerMethod.TRIM_LINES:
        result = lines.map(line => line.trim()).join('\n');
        break;

      case CleanerMethod.NORMALIZE_SPACES:
        // Replace multiple spaces/tabs with a single space
        result = lines.map(line => line.replace(/\s+/g, ' ').trim()).join('\n');
        break;

      case CleanerMethod.STRIP_HTML:
        // Simple HTML stripping using DOMParser
        const doc = new DOMParser().parseFromString(inputText, 'text/html');
        result = doc.body.textContent || "";
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
            <BroomIcon />
            Text Cleaner
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Clean, deduplicate, and normalize your text.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearAll} icon={<TrashIcon />}>Clear</Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Actions</span>
        
        <Button variant="secondary" size="sm" onClick={() => handleClean(CleanerMethod.REMOVE_DUPLICATES)}>Remove Duplicates</Button>
        <Button variant="secondary" size="sm" onClick={() => handleClean(CleanerMethod.REMOVE_EMPTY_LINES)}>Remove Empty Lines</Button>
        <Button variant="secondary" size="sm" onClick={() => handleClean(CleanerMethod.TRIM_LINES)}>Trim Whitespace</Button>
        <Button variant="secondary" size="sm" onClick={() => handleClean(CleanerMethod.NORMALIZE_SPACES)}>Normalize Spaces</Button>
        <Button variant="secondary" size="sm" onClick={() => handleClean(CleanerMethod.STRIP_HTML)}>Strip HTML</Button>
      </div>

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Input Pane */}
        <div className="flex-1 flex flex-col min-h-[300px] border-b md:border-b-0 md:border-r border-slate-200 relative group">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none z-10" />
          <textarea
            className="flex-1 p-6 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed bg-white"
            placeholder="Paste text to clean here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            spellCheck={false}
          />
          <div className="absolute bottom-3 right-4 text-xs text-slate-400 bg-white/80 px-2 py-1 rounded backdrop-blur-sm border border-slate-100">
             {lineCount} lines
          </div>
        </div>

        {/* Output Pane */}
        <div className="flex-1 flex flex-col min-h-[300px] bg-slate-50/50 relative group">
           <div className="absolute top-3 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" size="sm" onClick={copyToClipboard} icon={<CopyIcon />}>Copy</Button>
           </div>
          <textarea
            className="flex-1 p-6 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed bg-transparent"
            placeholder="Cleaned output will appear here..."
            value={outputText}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};