import React, { useState } from 'react';
import { SortMethod } from '../types';
import { Button } from './ui/Button';

// Icons
const ArrowDownIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
const ArrowUpIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const SortAscIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>;
const CopyIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export const SortTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [lineCount, setLineCount] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setLineCount(text ? text.split(/\r\n|\r|\n/).length : 0);
  };

  const handleSort = (method: SortMethod) => {
    if (!inputText.trim()) return;
    
    // Local deterministic sort
    let lines = inputText.split(/\r\n|\r|\n/);
    
    switch (method) {
      case SortMethod.ALPHA_ASC:
        lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        break;
      case SortMethod.ALPHA_DESC:
        lines.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
        break;
      case SortMethod.LENGTH_ASC:
        lines.sort((a, b) => a.length - b.length || a.localeCompare(b));
        break;
      case SortMethod.LENGTH_DESC:
        lines.sort((a, b) => b.length - a.length || a.localeCompare(b));
        break;
      case SortMethod.NUMERIC_ASC:
          lines.sort((a, b) => {
            const numA = parseFloat(a.replace(/[^0-9.-]+/g, ""));
            const numB = parseFloat(b.replace(/[^0-9.-]+/g, ""));
            if (isNaN(numA)) return 1;
            if (isNaN(numB)) return -1;
            return numA - numB;
          });
          break;
      case SortMethod.RANDOM:
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        break;
      case SortMethod.REVERSE_ORDER:
        lines.reverse();
        break;
    }
    setOutputText(lines.join('\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setLineCount(0);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tool Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <SortAscIcon />
            Line Sorter
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Organize your lists, code, or data instantly.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearAll} icon={<TrashIcon />}>Clear</Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Quick Sort</span>
        <Button variant="secondary" size="sm" onClick={() => handleSort(SortMethod.ALPHA_ASC)} icon={<ArrowDownIcon />}>A-Z</Button>
        <Button variant="secondary" size="sm" onClick={() => handleSort(SortMethod.ALPHA_DESC)} icon={<ArrowUpIcon />}>Z-A</Button>
        <Button variant="secondary" size="sm" onClick={() => handleSort(SortMethod.LENGTH_ASC)}>Shortest</Button>
        <Button variant="secondary" size="sm" onClick={() => handleSort(SortMethod.LENGTH_DESC)}>Longest</Button>
        <Button variant="secondary" size="sm" onClick={() => handleSort(SortMethod.NUMERIC_ASC)}>Numeric</Button>
        <Button variant="secondary" size="sm" onClick={() => handleSort(SortMethod.RANDOM)}>Shuffle</Button>
      </div>

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Input Pane */}
        <div className="flex-1 flex flex-col min-h-[300px] border-b md:border-b-0 md:border-r border-slate-200 relative group">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none z-10" />
          <textarea
            className="flex-1 p-6 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed bg-white"
            placeholder="Paste your text lines here..."
            value={inputText}
            onChange={handleInputChange}
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
            placeholder="Sorted output will appear here..."
            value={outputText}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};