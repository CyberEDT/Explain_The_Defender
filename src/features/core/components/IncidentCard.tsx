import type { Incident } from '../../../types';
import { AlertTriangle, Clock, ChevronRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEFENSE_CHAIN_STAGES } from '../../../data/defenseChain';

const severityConfig = {
  informational: { label: 'INFO', cls: 'badge-info' },
  low: { label: 'LOW', cls: 'badge-low' },
  medium: { label: 'MED', cls: 'badge-medium' },
  high: { label: 'HIGH', cls: 'badge-high' },
  critical: { label: 'CRIT', cls: 'badge-critical' },
};

const statusConfig = {
  active: { color: '#f87171', label: 'ACTIVE' },
  investigating: { color: '#fb923c', label: 'INVESTIGATING' },
  contained: { color: '#fbbf24', label: 'CONTAINED' },
  closed: { color: '#34d399', label: 'CLOSED' },
};

interface IncidentCardProps {
  incident: Incident;
}

export default function IncidentCard({ incident }: IncidentCardProps) {
  const navigate = useNavigate();
  const stage = DEFENSE_CHAIN_STAGES.find(s => s.stage === incident.currentStage);
  const sev = severityConfig[incident.severity];
  const status = statusConfig[incident.status];

  const timeAgo = () => {
    const diff = Date.now() - new Date(incident.detectedAt).getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 0) return `${hours}h ${mins}m ago`;
    return `${mins}m ago`;
  };

  return (
    <div
      className="etd-card cursor-pointer group animate-slide-up"
      style={{
        borderLeft: `3px solid ${stage?.color || '#334155'}`,
      }}
      onClick={() => navigate('/investigation')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={sev.cls}>{sev.label}</span>
            <div className="flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold" style={{
              background: incident.riskScore >= 90 ? 'rgba(248, 113, 113, 0.2)' : 
                          incident.riskScore >= 70 ? 'rgba(251, 146, 60, 0.2)' :
                          incident.riskScore >= 40 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(34, 211, 238, 0.2)',
              color: incident.riskScore >= 90 ? '#f87171' : 
                     incident.riskScore >= 70 ? '#fb923c' :
                     incident.riskScore >= 40 ? '#fbbf24' : '#22d3ee',
              border: `1px solid ${
                incident.riskScore >= 90 ? 'rgba(248, 113, 113, 0.4)' : 
                incident.riskScore >= 70 ? 'rgba(251, 146, 60, 0.4)' :
                incident.riskScore >= 40 ? 'rgba(251, 191, 36, 0.4)' : 'rgba(34, 211, 238, 0.4)'
              }`
            }}>
              RISK: {incident.riskScore}
            </div>
            <span className="font-mono text-[10px] text-text-muted">{incident.id}</span>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold"
              style={{ color: status.color, background: `${status.color}15`, border: `1px solid ${status.color}30` }}
            >
              {status.label}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-2 leading-tight group-hover:text-detect transition-colors">
            {incident.title}
          </h3>
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
            {incident.narrative.executiveSummary}
          </p>
        </div>
        <ChevronRight size={16} className="text-text-muted flex-shrink-0 group-hover:text-detect transition-colors mt-1" />
      </div>

      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {/* Current Stage */}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: stage?.color }} />
            <span className="text-[10px] font-bold tracking-wider" style={{ color: stage?.color }}>
              {stage?.label}
            </span>
          </div>

          {/* Affected Assets */}
          <div className="flex items-center gap-1 text-text-muted">
            <Activity size={11} />
            <span className="text-[10px]">{incident.affectedAssets.join(', ')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Metrics */}
          <div className="flex gap-2">
            <span className="text-[10px] text-text-muted">
              Confidence: <span className="text-detect font-medium">{incident.detectionConfidence}%</span>
            </span>
            <span className="text-[10px] text-text-muted">
              Urgency: <span className="text-contain font-medium">{incident.responseUrgency}/10</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-text-muted">
            <Clock size={11} />
            <span className="text-[10px]">{timeAgo()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
