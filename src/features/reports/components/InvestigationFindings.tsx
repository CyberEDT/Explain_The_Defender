import React from 'react';
import { Incident } from '../../../types';
import { FileText, Database } from 'lucide-react';
import { windowsEventKB } from '../../../knowledge-base/event-intel/windowsEvents';

interface InvestigationFindingsProps {
  incident: Incident;
}

export function InvestigationFindings({ incident }: InvestigationFindingsProps) {
  return (
    <section className="mb-8 print:break-inside-avoid">
      <div className="flex items-center gap-2 mb-4 border-b border-border-DEFAULT pb-2 mt-8">
        <h2 className="text-xl font-bold text-brand-electricBlue uppercase tracking-widest">3. Investigation Findings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="etd-card border border-border-DEFAULT rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-brand-electricBlue" />
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Analyst Notes</div>
          </div>
          <p className="text-sm text-text-secondary italic leading-relaxed border-l-2 border-brand-defenderBlue pl-3">
            {incident.narrative.investigationNotes}
          </p>
        </div>

        <div className="etd-card border border-border-DEFAULT rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Database size={16} className="text-brand-electricBlue" />
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Correlated Evidence (IOCs)</div>
          </div>
          <ul className="space-y-2">
            {incident.narrative.evidenceList.map((ev, i) => (
              <li key={i} className="text-xs font-mono text-text-secondary bg-bg-primary border border-border-subtle rounded p-2">
                {ev}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="etd-card border border-border-DEFAULT rounded-xl overflow-hidden shadow-card">
        <div className="bg-[#1A1A1A] p-3 border-b border-border-DEFAULT flex items-center justify-between">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Correlated Activity Log</div>
          <div className="text-[10px] text-text-muted">{incident.events.length} Events Analyzed</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-primary text-[10px] uppercase tracking-wider text-text-muted border-b border-border-subtle">
                <th className="p-3 font-medium">Timestamp</th>
                <th className="p-3 font-medium">Host / Asset</th>
                <th className="p-3 font-medium">Event ID</th>
                <th className="p-3 font-medium">Description</th>
                <th className="p-3 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {incident.events.map((evt, idx) => {
                const sevColors: Record<string, string> = { critical: '#f87171', high: '#fb923c', medium: '#fbbf24', low: '#22d3ee', informational: '#64748b' };
                return (
                  <tr key={evt.id} className={`border-b border-border-subtle ${idx % 2 === 0 ? 'etd-card' : 'bg-bg-primary'}`}>
                    <td className="p-3 font-mono text-text-secondary whitespace-nowrap">{new Date(evt.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-mono text-text-secondary">{evt.hostname}</td>
                    <td className="p-3">
                      <span className="bg-[#1A1A1A] border border-border-subtle px-2 py-1 rounded text-text-primary">
                        {evt.eventId.replace('WEL-', '')}
                      </span>
                    </td>
                    <td className="p-3 text-text-primary font-medium">{evt.eventName}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: sevColors[evt.severity] }} />
                        <span className="capitalize text-text-secondary">{evt.severity}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
