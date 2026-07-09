import { useState } from 'react';
import { mockIncidents } from '../../../data/mockIncidents';
import { windowsEventKB } from '../../../knowledge-base/event-intel/windowsEvents';
import { KnowledgeEngine } from '../../../core/KnowledgeEngine';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Search, MessageSquare, CheckSquare, FileSearch, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { DEFENSE_CHAIN_STAGES } from '../../../data/defenseChain';
import { EducationalLevel, DefenseStage, DetectionObject, InvestigationObject } from '../../../types';
import { NarrativeEngine } from '../../../core/NarrativeEngine';
import { DefenseChainTracker } from '../../investigate/components/DefenseChainTracker';
import { RiskRadar } from '../../investigate/components/RiskRadar';
import { InvestigationProgress } from '../../investigate/components/InvestigationProgress';

const incident = mockIncidents[0]; // Primary active incident

export default function InvestigationWorkbench() {
  const [selectedEventKB, setSelectedEventKB] = useState<DetectionObject>(windowsEventKB[1]); // 4625
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [eduLevel, setEduLevel] = useState<EducationalLevel>('Analyst');
  const [activeStage, setActiveStage] = useState<DefenseStage>(incident.currentStage);

  const toggleAnswer = (qId: string) => {
    setAnsweredQuestions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const scatterData = incident.events.map((e, i) => ({
    x: i * 10,
    y: e.severity === 'critical' ? 4 : e.severity === 'high' ? 3 : e.severity === 'medium' ? 2 : 1,
    z: 200,
    name: e.eventName,
    time: new Date(e.timestamp).toLocaleTimeString(),
    host: e.hostname,
  }));

  const stage = DEFENSE_CHAIN_STAGES.find(s => s.stage === incident.currentStage);
  
  // Re-generate observed activity dynamically based on selected level
  const dynamicObservedActivity = NarrativeEngine.getEducationalNarrative(eduLevel, incident.narrative.observedActivity.replace(/\[STUDENT MODE\].*did: |\[RESPONDER MODE\] BLUF:.*follows: /g, ''), incident.title);

  // Relational Intelligence Query
  const investigations = KnowledgeEngine.getInvestigationsForDetection(selectedEventKB.id);
  const evidenceToCollect = Array.from(new Set(investigations.flatMap(inv => inv.evidenceSources)));

  return (
    <div className="space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="section-title mb-1">Investigation Workbench</div>
          <h1 className="text-xl font-bold text-text-primary">Active Incident Analysis</h1>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex bg-black/40 rounded-lg p-1 border border-border-subtle">
            {(['Student', 'Analyst', 'Responder'] as EducationalLevel[]).map(l => (
              <button
                key={l}
                onClick={() => setEduLevel(l)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  eduLevel === l ? 'bg-investigate/20 text-investigate' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="badge-critical text-sm px-3 py-1">{incident.id}</span>
            <span className="badge-high px-3 py-1">{incident.priority}</span>
          </div>
        </div>
      </div>

      {/* Active Defense Chain */}
      <DefenseChainTracker currentStage={activeStage} onStageClick={setActiveStage} />

      {/* ETD Narrative Banner - Structured */}
      <div className="space-y-4">
        {/* Executive Summary & Activity */}
        <div className="rounded-xl p-5" style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)' }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}>
              <MessageSquare size={15} className="text-investigate" />
            </div>
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-semibold text-investigate uppercase tracking-wider">ETD Defender Narrative</div>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2 leading-tight">
                {incident.narrative.executiveSummary}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {dynamicObservedActivity}
              </p>
              
              {/* Investigation Notes & Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-investigate/20">
                <div>
                  <div className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">Investigation Notes</div>
                  <p className="text-xs text-text-secondary italic">{incident.narrative.investigationNotes}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">Correlated Evidence</div>
                  <ul className="space-y-1">
                    {incident.narrative.evidenceList.map((ev, i) => (
                      <li key={i} className="text-[10px] font-mono text-text-muted">{ev}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Visualizations & Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Risk Radar */}
          {incident.riskDetails && (
            <div className="xl:col-span-1 h-[300px]">
              <RiskRadar riskDetails={incident.riskDetails} />
            </div>
          )}

          {/* Risk Narrative & Actions */}
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px]">
            <div className="rounded-xl p-5 overflow-y-auto" style={{ background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.2)' }}>
              <div className="text-xs font-semibold mb-2 uppercase tracking-wider flex items-center gap-2" style={{
                color: incident.riskScore >= 90 ? '#f87171' : incident.riskScore >= 70 ? '#fb923c' : '#fbbf24'
              }}>
                <AlertCircle size={14} />
                Risk Assessment Narrative
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{incident.narrative.riskAssessment}</p>
            </div>

            <div className="rounded-xl p-5 overflow-y-auto" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}>
              <div className="text-xs font-semibold text-contain mb-2 uppercase tracking-wider">Recommended Actions</div>
              <ul className="space-y-2">
                {incident.narrative.recommendedActions.immediate.map((act, i) => (
                  <li key={i} className="text-xs text-text-secondary flex gap-2"><span className="text-contain">•</span> {act}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Event Timeline & Knowledge Base */}
        <div className="xl:col-span-2 space-y-5">
          {/* Event Timeline Chart */}
          <div className="etd-card">
            <div className="section-title mb-1">Event Timeline</div>
            <div className="text-sm font-semibold text-text-primary mb-4">Attack Sequence Visualization</div>
            <ResponsiveContainer width="100%" height={160}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="x" name="Time Offset" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'Time →', position: 'insideRight', fill: '#475569', fontSize: 10 }} />
                <YAxis dataKey="y" name="Severity" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => ['', 'Low', 'Med', 'High', 'Crit'][v] || ''} domain={[0.5, 4.5]} />
                <ZAxis dataKey="z" range={[50, 200]} />
                <Tooltip
                  contentStyle={{ background: '#0d1420', border: '1px solid rgba(99,179,237,0.2)', borderRadius: 8, fontSize: 12 }}
                  formatter={(val, name, props) => [props.payload.name, props.payload.time]}
                />
                <ReferenceLine y={3.5} stroke="rgba(212,175,55,0.3)" strokeDasharray="4 4" label={{ value: 'Critical threshold', fill: '#D4AF37', fontSize: 9 }} />
                <Scatter data={scatterData} fill="#D4AF37" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Raw Event Log */}
          <div className="etd-card">
            <div className="section-title mb-3">Event Log</div>
            <div className="space-y-2">
              {incident.events.map(evt => {
                const sevColors: Record<string, string> = { critical: '#f87171', high: '#fb923c', medium: '#fbbf24', low: '#22d3ee', informational: '#64748b' };
                return (
                  <div key={evt.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-white/[0.03]"
                    style={{ border: `1px solid rgba(255,255,255,0.04)` }}
                    onClick={() => {
                      const kb = KnowledgeEngine.getDetectionBySignature(evt.eventId.replace('WEL-', ''));
                      if (kb) setSelectedEventKB(kb);
                    }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sevColors[evt.severity] }} />
                    <div className="font-mono text-[10px] text-text-muted w-20 flex-shrink-0">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="font-mono text-xs text-text-muted w-28 flex-shrink-0 truncate">{evt.hostname}</div>
                    <div className="text-xs font-medium text-text-primary flex-1 truncate">{evt.eventName}</div>
                    <span className={`badge-${evt.severity === 'informational' ? 'info' : evt.severity} flex-shrink-0`}>
                      {evt.eventId.replace('WEL-', '')}
                    </span>
                    <ChevronRight size={12} className="text-text-muted flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Knowledge Base Panel */}
        <div className="space-y-4">
          {/* KB Header */}
          <div className="etd-card">
            <div className="flex items-center gap-2 mb-3">
              <FileSearch size={14} className="text-investigate" />
              <div className="section-title">Knowledge Base</div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-investigate">Event {selectedEventKB.signatureId}</span>
              <span className={`badge-${selectedEventKB.baseSeverity === 'informational' ? 'info' : selectedEventKB.baseSeverity}`}>
                {selectedEventKB.baseSeverity.toUpperCase()}
              </span>
            </div>
            <h3 className="text-sm font-bold text-text-primary">{selectedEventKB.name}</h3>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">{selectedEventKB.defenderInterest}</p>
          </div>

          <div className="h-[200px]">
            <InvestigationProgress 
              totalQuestions={investigations.length} 
              answeredQuestions={Object.values(answeredQuestions).filter(Boolean).length} 
            />
          </div>

          {/* Analyst Question Engine */}
          <div className="etd-card">
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare size={14} className="text-triage" />
              <div className="section-title">Analyst Question Engine</div>
            </div>
            <div className="space-y-2">
              {investigations.map((q: InvestigationObject) => (
                <div key={q.id}
                  className="p-3 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: answeredQuestions[q.id] ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${answeredQuestions[q.id] ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                  onClick={() => toggleAnswer(q.id)}>
                  <div className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold transition-all`}
                      style={{
                        background: answeredQuestions[q.id] ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${answeredQuestions[q.id] ? '#34d399' : 'rgba(255,255,255,0.1)'}`,
                        color: '#34d399',
                      }}>
                      {answeredQuestions[q.id] ? '✓' : ''}
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary">{q.question}</div>
                      {q.hint && (
                        <div className="text-[10px] text-text-muted mt-1 italic">{q.hint}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[10px] text-text-muted">
              {Object.values(answeredQuestions).filter(Boolean).length} / {investigations.length} questions answered
            </div>
          </div>

          {/* Evidence Collection */}
          <div className="etd-card">
            <div className="section-title mb-3">Evidence to Collect</div>
            <ul className="space-y-2">
              {evidenceToCollect.map(e => (
                <li key={e} className="flex items-start gap-2 text-xs text-text-secondary">
                  <AlertCircle size={11} className="text-contain flex-shrink-0 mt-0.5" />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          {/* MITRE Mappings */}
          <div className="etd-card">
            <div className="section-title mb-3">MITRE ATT&CK Mapping</div>
            <div className="space-y-2">
              {selectedEventKB.mitreMappings.map(m => (
                <div key={m.techniqueId} className="p-2 rounded-lg"
                  style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                  <div className="text-[10px] font-bold text-eradicate mb-0.5">{m.tacticId} · {m.tacticName}</div>
                  <div className="text-xs text-text-secondary">{m.techniqueId} — {m.techniqueName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Defense Chain Mapping */}
          <div className="etd-card">
            <div className="section-title mb-3">Defense Chain™ Mapping</div>
            <div className="space-y-2">
              {DEFENSE_CHAIN_STAGES.map(stage => (
                <div key={stage.stage} className="text-xs">
                  <span className="font-bold" style={{ color: stage.color }}>{stage.label}: </span>
                  <span className="text-text-muted">{(selectedEventKB.defenseChainMapping as Record<string, string>)[stage.stage]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
