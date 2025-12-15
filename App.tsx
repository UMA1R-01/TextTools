import React, { useState } from 'react';
import { SortTool } from './components/SortTool';
import { CaseConverterTool } from './components/CaseConverterTool';
import { CleanerTool } from './components/CleanerTool';
import { DiffCheckerTool } from './components/DiffCheckerTool';
import { Button } from './components/ui/Button';

// Icons for the Sidebar
const MenuIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const SortIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>;
const CaseIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const BroomIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const DiffIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState('sort');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-20 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
      >
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
            T
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">TextFlow</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 mt-2">Tools</div>
          
          <button 
            onClick={() => { setActiveTool('sort'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTool === 'sort' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <SortIcon />
            Line Sorter
          </button>
          
          <button 
            onClick={() => { setActiveTool('case'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTool === 'case' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <CaseIcon />
            Case Converter
          </button>

          <button 
            onClick={() => { setActiveTool('clean'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTool === 'clean' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BroomIcon />
            Text Cleaner
          </button>

          <button 
            onClick={() => { setActiveTool('diff'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTool === 'diff' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <DiffIcon />
            Diff Checker
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* Header - Mobile Only Trigger */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
             <div className="w-6 h-6 rounded bg-primary-600 flex items-center justify-center text-white text-xs">TF</div>
             TextFlow
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <MenuIcon />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-4 md:p-8 relative">
            <div className="max-w-6xl mx-auto h-full flex flex-col">
               {/* Tool Render */}
               {activeTool === 'sort' && (
                  <div className="h-full flex flex-col animate-fadeIn">
                    <SortTool />
                  </div>
               )}
               {activeTool === 'case' && (
                  <div className="h-full flex flex-col animate-fadeIn">
                    <CaseConverterTool />
                  </div>
               )}
               {activeTool === 'clean' && (
                  <div className="h-full flex flex-col animate-fadeIn">
                    <CleanerTool />
                  </div>
               )}
               {activeTool === 'diff' && (
                  <div className="h-full flex flex-col animate-fadeIn">
                    <DiffCheckerTool />
                  </div>
               )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;