import React, { useState, useMemo, useRef, useEffect, useDeferredValue } from 'react';
import { Button } from './ui/Button';

// Icons
const CompareIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const PencilIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const BoltIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;

export const DiffCheckerTool: React.FC = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [showStaticDiff, setShowStaticDiff] = useState(false);

  // Use deferred values for diff calculation to keep typing responsive
  const deferredText1 = useDeferredValue(text1);
  const deferredText2 = useDeferredValue(text2);

  // Determine if we should calculate/show diff
  const showDiff = isLive || showStaticDiff;

  const diffResult = useMemo(() => {
    // Only calculate if needed
    if (!showDiff) return null;

    // Use deferred text for calculation
    const t1 = isLive ? deferredText1 : text1;
    const t2 = isLive ? deferredText2 : text2;

    // Split by whitespace boundaries
    const words1 = t1.split(/(\s+)/);
    const words2 = t2.split(/(\s+)/);
    
    const n = words1.length;
    const m = words2.length;
    
    // Optimization: Skip identical prefix
    let start = 0;
    while(start < n && start < m && words1[start] === words2[start]) start++;
    
    // Optimization: Skip identical suffix
    let end1 = n - 1;
    let end2 = m - 1;
    while(end1 >= start && end2 >= start && words1[end1] === words2[end2]) {
      end1--;
      end2--;
    }

    // Core Diff range
    const lcsN = end1 - start + 1;
    const lcsM = end2 - start + 1;
    
    const commonIndices1 = new Set<number>();
    const commonIndices2 = new Set<number>();

    // Mark prefix/suffix as common
    for(let k=0; k<start; k++) { commonIndices1.add(k); commonIndices2.add(k); }
    for(let k=1; k <= (n-1 - end1); k++) { commonIndices1.add(n-k); commonIndices2.add(m-k); }

    // Run LCS on the middle differing part
    if (lcsN > 0 && lcsM > 0) {
       // Standard LCS Dynamic Programming
       const matrix = Array(lcsN + 1).fill(0).map(() => Array(lcsM + 1).fill(0));

       for (let i = 1; i <= lcsN; i++) {
         for (let j = 1; j <= lcsM; j++) {
           if (words1[start + i - 1] === words2[start + j - 1]) {
             matrix[i][j] = matrix[i - 1][j - 1] + 1;
           } else {
             matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
           }
         }
       }

       // Backtrack to find Common Subsequence
       let i = lcsN;
       let j = lcsM;
       while (i > 0 && j > 0) {
         if (words1[start + i - 1] === words2[start + j - 1]) {
           commonIndices1.add(start + i - 1);
           commonIndices2.add(start + j - 1);
           i--;
           j--;
         } else if (matrix[i - 1][j] > matrix[i][j - 1]) {
           i--;
         } else {
           j--;
         }
       }
    }

    return {
      left: words1.map((w, i) => ({ text: w, removed: !commonIndices1.has(i) })),
      right: words2.map((w, i) => ({ text: w, added: !commonIndices2.has(i) }))
    };

  }, [text1, text2, deferredText1, deferredText2, showDiff, isLive]);

  const clearAll = () => {
    setText1('');
    setText2('');
    setShowStaticDiff(false);
  };

  // Scroll Sync Refs
  const leftBackdropRef = useRef<HTMLDivElement>(null);
  const leftTextareaRef = useRef<HTMLTextAreaElement>(null);
  const rightBackdropRef = useRef<HTMLDivElement>(null);
  const rightTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = (sourceRef: React.RefObject<HTMLElement>, targetRef: React.RefObject<HTMLElement>) => {
    if (sourceRef.current && targetRef.current) {
      targetRef.current.scrollTop = sourceRef.current.scrollTop;
      targetRef.current.scrollLeft = sourceRef.current.scrollLeft;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tool Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CompareIcon />
            Diff Checker
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Compare two texts to identify additions and removals.</p>
        </div>
        <div className="flex gap-2 items-center">
            {/* Live Toggle */}
            <div className="flex items-center mr-4 bg-slate-100 rounded-lg p-1 border border-slate-200">
               <button 
                 onClick={() => { setIsLive(!isLive); setShowStaticDiff(false); }}
                 className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${isLive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <BoltIcon />
                 Live Edit {isLive ? 'ON' : 'OFF'}
               </button>
            </div>

           {!isLive && !showStaticDiff && (
              <Button onClick={() => setShowStaticDiff(true)} disabled={!text1 && !text2} icon={<CompareIcon />}>
                Find Difference
              </Button>
           )}
           {!isLive && showStaticDiff && (
              <Button variant="secondary" onClick={() => setShowStaticDiff(false)} icon={<PencilIcon />}>
                Edit
              </Button>
           )}
           <Button variant="ghost" size="sm" onClick={clearAll} icon={<TrashIcon />}>Clear</Button>
        </div>
      </div>

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
         {/* Left Pane: Original */}
         <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-slate-200 min-h-[300px] relative">
             <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between items-center z-20">
                <span>Original Text</span>
             </div>
             
             <div className="relative flex-1 h-full overflow-hidden">
                {/* Mode 1: Static Diff View (Read Only) */}
                {!isLive && showStaticDiff && diffResult && (
                  <div className="absolute inset-0 p-6 overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap bg-white text-slate-600">
                      {diffResult.left.map((item, idx) => (
                        <span 
                          key={idx} 
                          className={item.removed ? "bg-red-100 text-red-700 decoration-red-300 line-through decoration-2 font-bold" : ""}
                        >
                          {item.text}
                        </span>
                      ))}
                  </div>
                )}

                {/* Mode 2: Live Edit with Overlay */}
                {isLive && (
                   <>
                     {/* Backdrop for Highlights */}
                     {/* Note: Added pr-[calc(1.5rem+8px)] to match textarea's scrollbar width (8px) + padding (1.5rem/24px).
                         This ensures the text wraps at exactly the same point. */}
                     <div 
                        ref={leftBackdropRef}
                        className="absolute inset-0 p-6 pr-[calc(1.5rem+8px)] font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-transparent overflow-hidden pointer-events-none z-0"
                        aria-hidden="true"
                     >
                        {diffResult?.left.map((item, idx) => (
                           <span 
                              key={idx} 
                              className={item.removed ? "bg-red-200 decoration-red-400 line-through decoration-2" : ""}
                           >
                              {item.text}
                           </span>
                        )) || text1}
                        <br /> 
                     </div>
                     {/* Front Textarea */}
                     {/* Added overflow-y-scroll to force scrollbar presence for consistent layout */}
                     <textarea
                        ref={leftTextareaRef}
                        className="absolute inset-0 w-full h-full p-6 resize-none bg-transparent font-mono text-sm leading-relaxed text-slate-700 focus:outline-none z-10 break-words overflow-y-scroll"
                        placeholder="Paste original text here..."
                        value={text1}
                        onChange={(e) => setText1(e.target.value)}
                        onScroll={() => handleScroll(leftTextareaRef, leftBackdropRef)}
                        spellCheck={false}
                     />
                   </>
                )}

                {/* Mode 3: Plain Edit (No Diff) */}
                {!isLive && !showStaticDiff && (
                   <textarea
                     className="absolute inset-0 w-full h-full p-6 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed bg-white break-words overflow-y-auto"
                     placeholder="Paste original text here..."
                     value={text1}
                     onChange={(e) => setText1(e.target.value)}
                     spellCheck={false}
                   />
                )}
             </div>
         </div>

         {/* Right Pane: Modified */}
         <div className="flex-1 flex flex-col min-h-[300px] relative">
             <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between items-center z-20">
                <span>New Text</span>
             </div>

             <div className="relative flex-1 h-full overflow-hidden">
                {/* Mode 1: Static Diff View (Read Only) */}
                {!isLive && showStaticDiff && diffResult && (
                  <div className="absolute inset-0 p-6 overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap bg-white text-slate-600">
                      {diffResult.right.map((item, idx) => (
                        <span 
                          key={idx} 
                          className={item.added ? "bg-green-100 text-green-700 font-bold border-b-2 border-green-200" : ""}
                        >
                          {item.text}
                        </span>
                      ))}
                  </div>
                )}

                {/* Mode 2: Live Edit with Overlay */}
                {isLive && (
                   <>
                     {/* Backdrop for Highlights */}
                     <div 
                        ref={rightBackdropRef}
                        className="absolute inset-0 p-6 pr-[calc(1.5rem+8px)] font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-transparent overflow-hidden pointer-events-none z-0"
                        aria-hidden="true"
                     >
                        {diffResult?.right.map((item, idx) => (
                           <span 
                              key={idx} 
                              className={item.added ? "bg-green-200 border-b-2 border-green-400" : ""}
                           >
                              {item.text}
                           </span>
                        )) || text2}
                        <br />
                     </div>
                     {/* Front Textarea */}
                     <textarea
                        ref={rightTextareaRef}
                        className="absolute inset-0 w-full h-full p-6 resize-none bg-transparent font-mono text-sm leading-relaxed text-slate-700 focus:outline-none z-10 break-words overflow-y-scroll"
                        placeholder="Paste new text here..."
                        value={text2}
                        onChange={(e) => setText2(e.target.value)}
                        onScroll={() => handleScroll(rightTextareaRef, rightBackdropRef)}
                        spellCheck={false}
                     />
                   </>
                )}

                {/* Mode 3: Plain Edit (No Diff) */}
                {!isLive && !showStaticDiff && (
                   <textarea
                     className="absolute inset-0 w-full h-full p-6 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed bg-white break-words overflow-y-auto"
                     placeholder="Paste new text here..."
                     value={text2}
                     onChange={(e) => setText2(e.target.value)}
                     spellCheck={false}
                   />
                )}
             </div>
         </div>
      </div>
    </div>
  );
};