import React from 'react';
import { Incident } from '../../../types';
import { Shield, Search, Lock, RefreshCw, Zap } from 'lucide-react';

interface RecommendedActionsProps {
  incident: Incident;
}

export function RecommendedActions({ incident }: RecommendedActionsProps) {
  const { recommendedActions } = incident.narrative;

  return (
    <section className="mb-8 print:break-inside-avoid">
      <div className="flex items-center gap-2 mb-4 border-b border-border-DEFAULT pb-2 mt-8">
        <h2 className="text-xl font-bold text-brand-electricBlue uppercase tracking-widest">5. Recommended Actions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Immediate Containment */}
        <div className="bg-[rgba(248,113,113,0.05)] border border-[rgba(248,113,113,0.2)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lock size={16} className="text-[#f87171]" />
            <div className="text-xs font-semibold text-[#f87171] uppercase tracking-wider">Immediate Containment</div>
          </div>
          <ul className="space-y-2">
            {recommendedActions.immediate.map((act, i) => (
              <li key={i} className="text-sm text-text-primary flex gap-2">
                <span className="text-[#f87171] mt-1">•</span> {act}
              </li>
            ))}
          </ul>
        </div>

        {/* Investigation */}
        <div className="bg-[rgba(96,165,250,0.05)] border border-[rgba(96,165,250,0.2)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Search size={16} className="text-[#60a5fa]" />
            <div className="text-xs font-semibold text-[#60a5fa] uppercase tracking-wider">Investigation Steps</div>
          </div>
          <ul className="space-y-2">
            {recommendedActions.investigation.map((act, i) => (
              <li key={i} className="text-sm text-text-primary flex gap-2">
                <span className="text-[#60a5fa] mt-1">•</span> {act}
              </li>
            ))}
          </ul>
        </div>

        {/* Recovery */}
        <div className="bg-[rgba(52,211,153,0.05)] border border-[rgba(52,211,153,0.2)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw size={16} className="text-[#34d399]" />
            <div className="text-xs font-semibold text-[#34d399] uppercase tracking-wider">Recovery Actions</div>
          </div>
          <ul className="space-y-2">
            {recommendedActions.recovery.map((act, i) => (
              <li key={i} className="text-sm text-text-primary flex gap-2">
                <span className="text-[#34d399] mt-1">•</span> {act}
              </li>
            ))}
          </ul>
        </div>

        {/* Strategic Improvement */}
        <div className="bg-[rgba(167,139,250,0.05)] border border-[rgba(167,139,250,0.2)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-[#a78bfa]" />
            <div className="text-xs font-semibold text-[#a78bfa] uppercase tracking-wider">Strategic Improvements</div>
          </div>
          <ul className="space-y-2">
            {recommendedActions.improvement.map((act, i) => (
              <li key={i} className="text-sm text-text-primary flex gap-2">
                <span className="text-[#a78bfa] mt-1">•</span> {act}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
