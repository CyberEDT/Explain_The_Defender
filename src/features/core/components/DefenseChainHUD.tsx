import { DEFENSE_CHAIN_STAGES, STAGE_ORDER } from '../../../data/defenseChain';
import type { DefenseStage } from '../../../types';
import { ChevronRight, ArrowRight } from 'lucide-react';

interface DefenseChainHUDProps {
  activeStage?: DefenseStage;
  completedStages?: DefenseStage[];
}

export default function DefenseChainHUD({ activeStage, completedStages = [] }: DefenseChainHUDProps) {
  return (
    <div className="etd-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="section-title mb-1">Defense Chain™</div>
          <div className="text-sm font-semibold text-text-primary">Active Response Pipeline</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-critical">INC-2024-0847</span>
          <span className="text-xs text-text-muted">Active Incident</span>
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {DEFENSE_CHAIN_STAGES.map((stage, idx) => {
          const isActive = activeStage === stage.stage;
          const isCompleted = completedStages.includes(stage.stage);
          const activeIdx = activeStage ? STAGE_ORDER[activeStage] : -1;
          const isPast = STAGE_ORDER[stage.stage] < activeIdx;
          const isFuture = STAGE_ORDER[stage.stage] > activeIdx;

          return (
            <div key={stage.stage} className="flex items-center gap-1 flex-shrink-0">
              <div
                className={`relative flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-500 min-w-[100px] ${
                  isActive ? 'pulse-ring' : ''
                }`}
                style={{
                  background: isActive
                    ? stage.bgColor
                    : isPast || isCompleted
                    ? 'rgba(255,255,255,0.03)'
                    : 'transparent',
                  border: `1px solid ${
                    isActive
                      ? stage.borderColor
                      : isPast || isCompleted
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(255,255,255,0.04)'
                  }`,
                  boxShadow: isActive ? `0 0 20px ${stage.glowColor}` : 'none',
                  opacity: isFuture && !isActive ? 0.4 : 1,
                }}
              >
                {/* Step number */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-2"
                  style={{
                    background: isActive ? stage.color : isPast ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#080c14' : isPast ? stage.color : '#475569',
                  }}
                >
                  {isPast || isCompleted ? '✓' : idx + 1}
                </div>
                <span
                  className="text-[10px] font-bold tracking-widest"
                  style={{ color: isActive ? stage.color : isPast ? stage.color : '#475569' }}
                >
                  {stage.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping"
                    style={{ background: stage.color }}>
                  </div>
                )}
              </div>
              {idx < DEFENSE_CHAIN_STAGES.length - 1 && (
                <ArrowRight
                  size={12}
                  style={{ color: isPast ? '#334155' : '#1e293b', flexShrink: 0 }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between">
        <div className="text-xs text-text-muted">
          Currently at: <span className="text-investigate font-semibold">INVESTIGATE</span>
        </div>
        <div className="flex gap-3 text-xs text-text-muted">
          <span><span className="text-recover">●</span> Completed</span>
          <span><span className="text-detect animate-pulse">●</span> Active</span>
          <span><span className="text-text-muted opacity-30">●</span> Pending</span>
        </div>
      </div>
    </div>
  );
}
