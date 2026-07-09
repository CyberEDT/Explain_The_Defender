import React from 'react';
import { DEFENSE_CHAIN_STAGES } from '../../../data/defenseChain';
import { DefenseStage } from '../../../types';
import { Check, ChevronRight } from 'lucide-react';

interface DefenseChainTrackerProps {
  currentStage: DefenseStage;
  onStageClick?: (stage: DefenseStage) => void;
}

export function DefenseChainTracker({ currentStage, onStageClick }: DefenseChainTrackerProps) {
  const currentIndex = DEFENSE_CHAIN_STAGES.findIndex((s) => s.stage === currentStage);

  return (
    <div className="w-full bg-[#111111] border border-border-DEFAULT rounded-xl p-6 shadow-card">
      <div className="text-xs font-semibold text-text-muted mb-6 uppercase tracking-wider">
        Active Defense Chain Progress
      </div>
      
      <div className="flex justify-between w-full relative pb-12">
        {/* Background connecting line */}
        <div className="absolute top-5 left-4 right-4 h-[2px] bg-border-DEFAULT z-0" />
        
        {DEFENSE_CHAIN_STAGES.map((stageInfo, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          
          return (
            <div 
              key={stageInfo.stage} 
              className={`relative z-10 flex flex-col items-center group ${onStageClick ? 'cursor-pointer' : ''}`}
              onClick={() => onStageClick?.(stageInfo.stage)}
            >
              {/* Node */}
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'bg-[#A3A3A3] text-bg-primary' : ''}
                  ${isCurrent ? 'bg-brand-defenderBlue text-bg-primary shadow-glow-orange scale-110' : ''}
                  ${isFuture ? 'bg-bg-secondary border-2 border-border-DEFAULT text-text-muted' : ''}
                `}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : <span className="font-bold text-sm">{index + 1}</span>}
              </div>
              
              {/* Label */}
              <div className="absolute top-14 whitespace-nowrap text-center">
                <div className={`text-xs font-bold uppercase tracking-wider mb-1 transition-colors ${
                  isCurrent ? 'text-brand-electricBlue' : isCompleted ? 'text-text-primary' : 'text-text-muted'
                }`}>
                  {stageInfo.stage}
                </div>
                {/* Description Tooltip (visible on hover) */}
                <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-[#000000] border border-border-bright p-3 rounded-lg shadow-glass z-50">
                  <p className="text-[10px] text-text-secondary whitespace-normal">{stageInfo.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
