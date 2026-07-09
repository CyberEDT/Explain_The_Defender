import React from 'react';
import { Incident } from '../../../types';
import { Lightbulb, Target } from 'lucide-react';

interface LessonsLearnedProps {
  incident: Incident;
}

export function LessonsLearned({ incident }: LessonsLearnedProps) {
  // Synthesize detection gaps based on the event sequence
  const generateDetectionGaps = () => {
    const gaps: string[] = [];
    const eventIds = incident.events.map(e => e.eventId);
    
    if (eventIds.includes('WEL-4625') && eventIds.includes('WEL-4624')) {
      gaps.push("Lack of automated lockouts after successive failed authentication bursts.");
      gaps.push("No geographic or impossible travel anomaly detection on RDP logins.");
    }
    if (eventIds.includes('WEL-4688') && incident.events.some(e => e.eventName.includes('PowerShell'))) {
      gaps.push("Missing Script Block Logging (EID 4104) for deep PowerShell inspection.");
    }
    if (eventIds.includes('WEL-7045')) {
      gaps.push("Insufficient alerting on unapproved Service Installations in sensitive enclaves.");
    }

    if (gaps.length === 0) {
      gaps.push("Review correlation logic to ensure single events trigger early-warning thresholds.");
    }

    return gaps;
  };

  return (
    <section className="mb-8 print:break-inside-avoid">
      <div className="flex items-center gap-2 mb-4 border-b border-border-DEFAULT pb-2 mt-8">
        <h2 className="text-xl font-bold text-brand-electricBlue uppercase tracking-widest">6. Lessons Learned & Detection Gaps</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="etd-card border border-border-DEFAULT rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-brand-electricBlue" />
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Identified Detection Gaps</div>
          </div>
          <ul className="space-y-3">
            {generateDetectionGaps().map((gap, i) => (
              <li key={i} className="text-sm text-text-secondary leading-relaxed border-l-2 border-investigate pl-3">
                {gap}
              </li>
            ))}
          </ul>
        </div>

        <div className="etd-card border border-border-DEFAULT rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-brand-electricBlue" />
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Strategic Review</div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            Based on the progression of this incident through the Defense Chain, the primary failure occurred during the 
            <span className="font-bold text-text-primary px-1">DETECT</span> and <span className="font-bold text-text-primary px-1">TRIAGE</span> phases, 
            allowing the actor to establish a foothold before containment could be initiated. 
            Implementation of the Recommended Actions (Section 5) is critical to shifting detection earlier in the kill chain.
          </p>
        </div>
      </div>
    </section>
  );
}
