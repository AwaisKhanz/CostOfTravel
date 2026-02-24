import React, { useState } from 'react';
import { CancellationOutput, OutcomeRisk } from '@/types/tool';
import { trackEvent } from '@/lib/tracking';

interface ToolResultProps {
  result: any;
}

const riskColors: Record<string, string> = {
  safe: 'bg-brand-success/10 border-brand-success text-brand-success',
  high_risk: 'bg-brand-warning/20 border-brand-warning text-brand-warning-dark',
  denied: 'bg-brand-danger/10 border-brand-danger text-brand-danger',
  partial_loss: 'bg-brand-warning/10 border-brand-warning text-brand-warning',
  full_loss: 'bg-brand-danger/10 border-brand-danger text-brand-danger',
  cannot_determine: 'bg-brand-secondary-low border-border-subtle text-foreground/70',
};

export const ToolResult: React.FC<ToolResultProps> = ({ result }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);

  const storyline = typeof result.storyline === 'string' 
    ? { headline: 'Result', verdict: result.storyline, riskSummary: '' }
    : result.storyline;

  const handleExplain = async () => {
    if (explanation) return; // Already explained
    
    setIsExplaining(true);
    setExplainError(null);
    try {
      const response = await fetch('http://localhost:8000/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      
      if (!response.ok) throw new Error('Failed to generate explanation');
      const data = await response.json();
      setExplanation(data.explanation);
      
      trackEvent('llm_explanation_shown', { 
        toolId: result.output.scenario ? result.output.scenario?.split('.')[0] || 'unknown' : 'unknown', 
        scenario: result.output.scenario,
        outcomeRisk: result.output.outcomeRisk
      });
    } catch (err: any) {
      setExplainError('Could not load AI explanation. Please try again.');
    } finally {
      setIsExplaining(false);
    }
  };

  const output = result.output || result;

  return (
    <div className={`mt-8 p-8 border-l-8 rounded-r-card shadow-premium ${riskColors[output.outcomeRisk] || 'bg-brand-secondary-low border-border-subtle'}`}>
      <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2 uppercase tracking-tight">
        {storyline.headline}
      </h2>
      
      <p className="text-xl mb-4 font-bold leading-relaxed">
        {storyline.verdict}
      </p>

      {storyline.riskSummary && (
        <p className="text-sm italic font-medium opacity-80 mb-8">
          {storyline.riskSummary}
        </p>
      )}

      {storyline.whyThisHappens && (
        <div className="mb-8 p-4 bg-foreground/5 rounded-button border border-foreground/10">
          <p className="text-xs font-extrabold uppercase tracking-widest mb-1 opacity-50">Context</p>
          <p className="text-sm font-medium leading-relaxed">{storyline.whyThisHappens}</p>
        </div>
      )}

      <div className="space-y-4 text-sm font-medium">
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 bg-foreground/10 rounded text-[10px] uppercase font-extrabold">Scenario</span>
           <span className="text-foreground/80">{output.scenario}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 bg-foreground/10 rounded text-[10px] uppercase font-extrabold">Risk Level</span>
           <span className="text-foreground/80 font-bold uppercase">{output.outcomeRisk?.replace('_', ' ')}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 bg-foreground/10 rounded text-[10px] uppercase font-extrabold">Reason Code</span>
           <span className="text-foreground/80">{output.reasonCode}</span>
        </div>
        
        {/* Only show financial metrics if they are explicitly part of the result payload */}
        {(output.refundAmount !== undefined || output.creditAmount !== undefined || output.totalLoss !== undefined) && (
          <div className="mt-6 pt-6 border-t border-foreground/10">
            {output.refundAmount !== undefined && <p className="text-3xl font-extrabold">Refund: {output.currency || '$'} {output.refundAmount}</p>}
            {output.creditAmount !== undefined && <p className="text-xl font-bold opacity-80">Credit: {output.currency || '$'} {output.creditAmount}</p>}
            {output.totalLoss !== undefined && <p className="text-sm opacity-60 font-medium">Total Loss: {output.currency || '$'} {output.totalLoss}</p>}
          </div>
        )}
      </div>

      {result.storyline?.whatHappensNext?.length > 0 && (
         <div className="mt-8 pt-8 border-t border-foreground/10">
           <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground/40 mb-4">What Happens Next</h3>
           <ul className="space-y-3">
             {result.storyline.whatHappensNext.map((item: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm font-medium text-foreground/70">
                  <div className="w-5 h-5 flex-shrink-0 bg-foreground/10 rounded-full flex items-center justify-center text-[10px] font-extrabold">{i+1}</div>
                  {item}
                </li>
             ))}
           </ul>
         </div>
      )}

      {/* Unified Intel Layer Rendering */}
      {result.intel && (
        <div className="mt-10 pt-8 border-t border-foreground/10">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground/40 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Regulatory & Industry Context
          </h3>
          <ul className="space-y-6">
            {(Array.isArray(result.intel) ? result.intel : result.intel.citations || []).map((cite: any, i: number) => (
              <li key={i} className="text-sm group">
                <span className="font-extrabold block text-foreground uppercase tracking-tight text-xs mb-1">{cite.source}</span>
                <p className="text-foreground/70 font-medium leading-relaxed">{cite.context || cite.text}</p>
                {cite.link && (
                  <a href={cite.link} target="_blank" rel="noopener noreferrer" className="text-brand-primary font-bold hover:underline mt-2 inline-flex items-center text-xs transition-all">
                    View Verified Source
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* LLM Explanation Feature */}
      <div className="mt-8 pt-6 border-t border-foreground/10">
        {!explanation && (
          <button
            onClick={handleExplain}
            disabled={isExplaining}
            className="flex items-center text-xs font-extrabold uppercase tracking-widest text-brand-primary hover:text-brand-primary-hover disabled:opacity-50 transition-all bg-card/50 px-4 py-2 rounded-button border border-brand-primary/20 shadow-sm active:scale-95"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            {isExplaining ? 'Processing...' : 'Ask AI Intelligence Layer'}
          </button>
        )}
        
        {explainError && (
          <p className="text-sm text-brand-danger mt-3 font-bold">{explainError}</p>
        )}

        {explanation && (
          <div className="mt-6 bg-card p-6 rounded-card border border-brand-primary/20 shadow-premium relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 bg-brand-primary/5 p-8 rounded-full opacity-50 group-hover:scale-110 transition-transform">
              <svg className="w-12 h-12 text-brand-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-primary mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Plain-English Intelligence
            </h3>
            <div className="prose prose-sm max-w-none text-foreground/80 font-medium">
               <p dangerouslySetInnerHTML={{ 
                 __html: explanation
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-extrabold">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                    .replace(/`(.*?)`/g, '<code class="bg-brand-primary-surface px-1.5 py-0.5 rounded text-brand-primary font-mono text-xs">$1</code>')
                    .replace(/\n\n/g, '</p><p class="mt-4">') 
               }} />
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};
