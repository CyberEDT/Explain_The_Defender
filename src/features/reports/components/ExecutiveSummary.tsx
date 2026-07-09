import React from 'react';
import { Incident } from '../../../types';
import { AlertTriangle, Info, Clock, ShieldAlert } from 'lucide-react';

interface ExecutiveSummaryProps {
  incident: Incident;
  dynamicObservedActivity: string;
}

export function ExecutiveSummary({ incident, dynamicObservedActivity }: ExecutiveSummaryProps) {
  return (
    <section className="mb-8 print:break-inside-avoid">
      <div className="flex items-center gap-2 mb-4 border-b border-border-DEFAULT pb-2">
        <h2 className="text-xl font-bold text-brand-electricBlue uppercase tracking-widest">1. Executive Summary</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="etd-card p-3">
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Incident ID</div>
          <div className="text-sm font-bold text-text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-defenderBlue"></span>
            {incident.id}
          </div>
        </div>
        <div className="etd-card p-3">
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Severity & Priority</div>
          <div className="text-sm font-bold text-text-primary flex items-center gap-2">
            <AlertTriangle size={14} className={incident.priority === 'P1' ? 'text-eradicate' : 'text-brand-electricBlue'} />
            <span className="uppercase">{incident.severity} / {incident.priority}</span>
          </div>
        </div>
        <div className="etd-card p-3">
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Status</div>
          <div className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Info size={14} className="text-investigate" />
            <span className="uppercase">{incident.status}</span>
          </div>
        </div>
        <div className="etd-card p-3">
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Detection Time</div>
          <div className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Clock size={14} className="text-text-muted" />
            {new Date(incident.detectedAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="etd-card border border-border-DEFAULT rounded-xl p-5 shadow-card">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-investigate/10 border border-investigate/30">
            <ShieldAlert size={15} className="text-brand-electricBlue" />
          </div>
          <div className="w-full">
            <div className="text-xs font-semibold text-brand-electricBlue uppercase tracking-wider mb-2">Bottom Line Up Front (BLUF)</div>
            <h3 className="text-base font-bold text-text-primary mb-3 leading-tight">
              {incident.narrative.executiveSummary}
            </h3>
            <div className="p-3 bg-bg-primary border border-border-subtle rounded-lg">
              <p className="text-sm text-text-secondary leading-relaxed">
                {dynamicObservedActivity}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
