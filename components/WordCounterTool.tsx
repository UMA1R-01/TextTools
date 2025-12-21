import React, { useState, useMemo } from 'react';
import { Button } from './ui/Button';

// Icons
const ChartIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const CopyIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ClockIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const StatCard: React.FC<{ label: string; value: number | string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center transition-all hover:bg-white hover:shadow-sm">
    <div className="flex items-center gap-2 mb-1">
      {icon && <span className="text-slate-400">{icon}</span>}
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-2xl font-bold text-slate-800 tracking-tight">{value}</div>
  </div>
);

export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
    const spaces = (text.match(/ /g) || []).length;
    
    // Average reading speed: 225 words per minute
    // Average speaking speed: 130 words per minute
    const readingTime = Math.ceil(words / 225);
    const speakingTime = Math.ceil(words / 130);

    return {
      words,
      chars,
      charsNoSpaces,
      sentences,
      paragraphs,
      spaces,
      readingTime,
      speakingTime
    };
  }, [text]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setText('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tool Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <ChartIcon />
            Word Counter
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Instant metrics for your content.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearAll} icon={<TrashIcon />}>Clear</Button>
          <Button variant="secondary" size="sm" onClick={copyToClipboard} icon={<CopyIcon />}>Copy Text</Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="p-6 bg-slate-50/50 border-b border-slate-100">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard label="Words" value={stats.words} />
          <StatCard label="Characters" value={stats.chars} />
          <StatCard label="No Spaces" value={stats.charsNoSpaces} />
          <StatCard label="Sentences" value={stats.sentences} />
          <StatCard label="Paragraphs" value={stats.paragraphs} />
          <StatCard label="Spaces" value={stats.spaces} />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
            <ClockIcon />
            <span>Reading time: <span className="font-bold text-slate-800">{stats.readingTime} min</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
            <ClockIcon />
            <span>Speaking time: <span className="font-bold text-slate-800">{stats.speakingTime} min</span></span>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        <textarea
          className="flex-1 p-6 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed bg-white border-none"
          placeholder="Paste or type your text here to get instant analysis..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={true}
        />
      </div>
    </div>
  );
};