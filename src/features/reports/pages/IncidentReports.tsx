import React, { useState } from 'react';
import { mockIncidents } from '../../../data/mockIncidents';
import { Printer, FileText } from 'lucide-react';
import { EducationalLevel } from '../../../types';
import { NarrativeEngine } from '../../../core/NarrativeEngine';

import { ExecutiveSummary } from '../../reports/components/ExecutiveSummary';
import { InvestigationFindings } from '../../reports/components/InvestigationFindings';
import { RecommendedActions } from '../../reports/components/RecommendedActions';
import { LessonsLearned } from '../../reports/components/LessonsLearned';
import { DefenseChainTracker } from '../../investigate/components/DefenseChainTracker';
import { RiskRadar } from '../../investigate/components/RiskRadar';

export default function IncidentReports() {
  const [selectedIncidentId, setSelectedIncidentId] = useState(mockIncidents[0].id);
  const [eduLevel, setEduLevel] = useState<EducationalLevel>('Analyst');

  const incident = mockIncidents.find(i => i.id === selectedIncidentId) || mockIncidents[0];

  const handlePrint = () => {
    window.print();
  };

  // Generate dynamic text based on Edu level
  const dynamicObservedActivity = NarrativeEngine.getEducationalNarrative(
    eduLevel, 
    incident.narrative.observedActivity.replace(/\[STUDENT MODE\].*did: |\[RESPONDER MODE\] BLUF:.*follows: /g, ''), 
    incident.title
  );

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto pb-12">
      {/* Report Controls (Hidden in Print) */}
      <div className="print:hidden flex flex-col md:flex-row items-center justify-between gap-4 etd-card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-brand-electricBlue" />
            <span className="text-sm font-bold text-text-primary uppercase tracking-widest">Report Generator</span>
          </div>
          <select 
            className="bg-bg-primary border border-border-subtle text-sm text-text-primary rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-defenderBlue transition-colors"
            value={selectedIncidentId}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
          >
            {mockIncidents.map(inc => (
              <option key={inc.id} value={inc.id}>{inc.id} - {inc.title}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 rounded-lg p-1 border border-border-subtle">
            {(['Student', 'Analyst', 'Responder'] as EducationalLevel[]).map(l => (
              <button
                key={l}
                onClick={() => setEduLevel(l)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                  eduLevel === l ? 'bg-brand-defenderBlue/20 text-brand-electricBlue border border-brand-defenderBlue/50' : 'text-text-muted hover:text-text-primary border border-transparent'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <button onClick={handlePrint} className="btn-primary flex items-center gap-2 text-xs text-[#000000] bg-brand-defenderBlue border-brand-defenderBlue hover:bg-[#FBBF24]">
            <Printer size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* ----------------- REPORT DOCUMENT ----------------- */}
      <div className="glass rounded-xl p-8 print:bg-white print:text-black">
        {/* Document Header */}
        <div className="text-center mb-10 border-b border-border-DEFAULT pb-6 print:border-black">
          <h1 className="text-3xl font-black text-text-primary uppercase tracking-widest mb-2 print:text-black">ETD Incident Report</h1>
          <p className="text-sm text-text-muted font-mono print:text-gray-600">Generated: {new Date().toUTCString()}</p>
          <div className="mt-4 inline-block px-4 py-1 border-2 border-[#f87171] text-[#f87171] text-xs font-bold uppercase tracking-widest rounded print:border-red-600 print:text-red-600">
            TLP:AMBER
          </div>
        </div>

        {/* 1. Executive Summary */}
        <ExecutiveSummary incident={incident} dynamicObservedActivity={dynamicObservedActivity} />

        {/* 2. Defense Chain Analysis */}
        <section className="mb-8 print:break-inside-avoid">
          <div className="flex items-center gap-2 mb-4 border-b border-border-DEFAULT pb-2">
            <h2 className="text-xl font-bold text-brand-electricBlue uppercase tracking-widest">2. Defense Chain Analysis</h2>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            The incident is currently in the <span className="font-bold text-brand-electricBlue uppercase">{incident.currentStage}</span> phase.
          </p>
          <div className="print:hidden">
            <DefenseChainTracker currentStage={incident.currentStage} />
          </div>
        </section>

        {/* 3. Investigation Findings */}
        <InvestigationFindings incident={incident} />

        {/* 4. Risk Assessment */}
        <section className="mb-8 print:break-inside-avoid">
          <div className="flex items-center gap-2 mb-4 border-b border-border-DEFAULT pb-2 mt-8">
            <h2 className="text-xl font-bold text-brand-electricBlue uppercase tracking-widest">4. Risk Assessment</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[250px] print:hidden">
              {incident.riskDetails && <RiskRadar riskDetails={incident.riskDetails} />}
            </div>
            <div className="etd-card flex flex-col justify-center">
               <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Business Impact Analysis</div>
               <p className="text-sm text-text-secondary leading-relaxed border-l-2 border-brand-defenderBlue pl-3">
                 {incident.narrative.riskAssessment}
               </p>
            </div>
          </div>
        </section>

        {/* 5. Recommended Actions */}
        <RecommendedActions incident={incident} />

        {/* 6. Lessons Learned */}
        <LessonsLearned incident={incident} />

      </div>
    </div>
  );
}
