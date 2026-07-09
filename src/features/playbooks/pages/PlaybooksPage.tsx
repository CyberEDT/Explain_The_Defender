import { useState } from 'react';
import { playbooks } from '../../../knowledge-base/playbooks/playbooks';
import { CheckCircle, Circle, AlertTriangle, ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import { DEFENSE_CHAIN_STAGES } from '../../../data/defenseChain';
import type { Playbook, PlaybookStep } from '../../../types';

const priorityConfig = {
  immediate: { label: 'IMMEDIATE', color: '#f87171' },
  standard: { label: 'STANDARD', color: '#fb923c' },
  followup: { label: 'FOLLOW-UP', color: '#60a5fa' },
};

const severityConfig: Record<string, string> = {
  critical: 'badge-critical',
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
};

export default function PlaybooksPage() {
  const [selected, setSelected] = useState<Playbook>(playbooks[0]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setCompleted(prev => ({ ...prev, [id]: !prev[id] }));

  const completedCount = selected.steps.filter(s => completed[s.id]).length;
  const progress = Math.round((completedCount / selected.steps.length) * 100);

  const groupedSteps: Record<string, PlaybookStep[]> = {};
  selected.steps.forEach(step => {
    if (!groupedSteps[step.stage]) groupedSteps[step.stage] = [];
    groupedSteps[step.stage].push(step);
  });

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div>
        <div className="section-title mb-1">Response Playbooks</div>
        <h1 className="text-xl font-bold text-text-primary">Incident Response Guidance</h1>
        <p className="text-sm text-text-secondary mt-1">Select an incident category to begin a structured response workflow.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Playbook List */}
        <div className="xl:col-span-1 space-y-2">
          <div className="section-title mb-3">Playbooks</div>
          {playbooks.map(pb => (
            <button key={pb.id} id={`playbook-${pb.id}`}
              onClick={() => { setSelected(pb); setCompleted({}); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                selected.id === pb.id ? 'glass-bright' : 'hover:bg-white/[0.03]'
              }`}
              style={{
                border: selected.id === pb.id ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(255,255,255,0.05)',
                borderLeft: selected.id === pb.id ? '3px solid #22d3ee' : '1px solid rgba(255,255,255,0.05)',
              }}>
              <div className="flex items-start gap-2">
                <BookOpen size={13} className="text-detect mt-0.5 flex-shrink-0" />
                <div>
                  <div className={`${severityConfig[pb.severity]} mb-1.5 inline-block`}>{pb.severity.toUpperCase()}</div>
                  <div className="text-xs font-medium text-text-primary leading-tight">{pb.name}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active Playbook */}
        <div className="xl:col-span-3 space-y-5">
          {/* Header */}
          <div className="etd-card">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className={`${severityConfig[selected.severity]} mb-2 inline-block`}>{selected.severity.toUpperCase()}</span>
                <h2 className="text-lg font-bold text-text-primary">{selected.name}</h2>
                <p className="text-sm text-text-secondary mt-1">{selected.overview}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold text-detect">{progress}%</div>
                <div className="text-xs text-text-muted">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/30 rounded-full h-2">
              <div className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #22d3ee, #34d399)' }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-text-muted">
              <span>{completedCount} / {selected.steps.length} steps completed</span>
              <span className="text-text-muted">{selected.escalationPath}</span>
            </div>
          </div>

          {/* Why It Matters */}
          <div className="px-5 py-4 rounded-xl" style={{ background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={13} className="text-contain" />
              <span className="text-xs font-semibold text-contain uppercase tracking-wider">Why This Matters</span>
            </div>
            <p className="text-sm text-text-secondary">{selected.whyItMatters}</p>
          </div>

          {/* Detection Indicators */}
          <div className="etd-card">
            <div className="section-title mb-3">Detection Indicators</div>
            <ul className="space-y-2">
              {selected.detectionIndicators.map(ind => (
                <li key={ind} className="flex items-start gap-2 text-xs text-text-secondary">
                  <span className="font-mono text-detect">›</span>
                  {ind}
                </li>
              ))}
            </ul>
          </div>

          {/* Response Steps by Defense Chain Stage */}
          <div className="etd-card">
            <div className="section-title mb-4">Response Checklist</div>
            <div className="space-y-6">
              {DEFENSE_CHAIN_STAGES
                .filter(s => groupedSteps[s.stage])
                .map(stage => (
                  <div key={stage.stage}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-px flex-1" style={{ background: stage.borderColor, opacity: 0.4 }} />
                      <span className="text-[10px] font-bold tracking-widest px-2" style={{ color: stage.color }}>
                        {stage.label}
                      </span>
                      <div className="h-px flex-1" style={{ background: stage.borderColor, opacity: 0.4 }} />
                    </div>
                    <div className="space-y-2">
                      {groupedSteps[stage.stage].map(step => {
                        const isDone = completed[step.id];
                        const pri = priorityConfig[step.priority];
                        return (
                          <div key={step.id}
                            onClick={() => toggle(step.id)}
                            className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200"
                            style={{
                              background: isDone ? 'rgba(52,211,153,0.05)' : 'rgba(255,255,255,0.02)',
                              border: `1px solid ${isDone ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)'}`,
                            }}>
                            {isDone
                              ? <CheckCircle size={16} className="text-recover flex-shrink-0 mt-0.5" />
                              : <Circle size={16} className="text-text-muted flex-shrink-0 mt-0.5" />}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-text-primary">{step.action}</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                  style={{ color: pri.color, background: `${pri.color}15`, border: `1px solid ${pri.color}30` }}>
                                  {pri.label}
                                </span>
                              </div>
                              <p className="text-xs text-text-muted leading-relaxed">{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Improvement Recommendations */}
          <div className="etd-card">
            <div className="section-title mb-3">Improvement Recommendations</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selected.improvementRecommendations.map(rec => (
                <div key={rec} className="flex items-start gap-2 p-3 rounded-lg"
                  style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.15)' }}>
                  <ArrowRight size={12} className="text-improve mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-text-secondary">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
