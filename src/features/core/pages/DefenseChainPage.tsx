import { DEFENSE_CHAIN_STAGES } from '../../../data/defenseChain';
import { ArrowDown, Check, Radar, Filter, Search, Shield, Trash2, RefreshCw, TrendingUp } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  radar: <Radar size={20} />,
  filter: <Filter size={20} />,
  search: <Search size={20} />,
  shield: <Shield size={20} />,
  trash: <Trash2 size={20} />,
  refresh: <RefreshCw size={20} />,
  'trending-up': <TrendingUp size={20} />,
};

const stageDetails: Record<string, { mindset: string; inputs: string[]; outputs: string[]; activities: string[] }> = {
  detect: {
    mindset: '"What is abnormal? What triggered this signal?"',
    inputs: ['Raw logs', 'SIEM alerts', 'EDR telemetry', 'User reports'],
    outputs: ['Normalized Detections', 'Security Events'],
    activities: ['Rule matching', 'Anomaly detection', 'Threshold monitoring', 'Behavioral baselining'],
  },
  triage: {
    mindset: '"Does this matter right now? Is it benign or malicious?"',
    inputs: ['Normalized Detections', 'Asset criticality scores', 'Historical context'],
    outputs: ['Prioritized Incident', 'Closed False Positive'],
    activities: ['Alert deduplication', 'Context enrichment', 'Priority assignment', 'False positive elimination'],
  },
  investigate: {
    mindset: '"How did they get in? What did they touch? Who else is involved?"',
    inputs: ['Prioritized incidents', 'Forensic artifacts', 'Network PCAPs', 'Memory dumps'],
    outputs: ['Root cause analysis', 'Attack timeline', 'IoC extraction'],
    activities: ['PowerShell chain analysis', 'Memory forensics', 'Lateral movement tracing', 'Timeline reconstruction'],
  },
  contain: {
    mindset: '"How do we lock them out without breaking the business?"',
    inputs: ['Attack timeline', 'Active network connections', 'Compromised accounts'],
    outputs: ['Isolated hosts', 'Disabled accounts', 'Blocked IPs'],
    activities: ['Network isolation via EDR', 'Session revocation', 'Firewall blocking', 'Account disabling'],
  },
  eradicate: {
    mindset: '"Did we get everything? Are there backdoors remaining?"',
    inputs: ['IoCs', 'Malware samples', 'Persistence mechanisms'],
    outputs: ['Cleaned endpoints', 'Removed artifacts', 'Patched vulnerabilities'],
    activities: ['Registry cleanup', 'Malicious file deletion', 'Service removal', 'Persistence mechanism purging'],
  },
  recover: {
    mindset: '"Is it safe to reconnect? Are we monitoring the restored assets?"',
    inputs: ['Cleaned environments', 'Clean backup images'],
    outputs: ['Restored services', 'Operational endpoints', 'Enhanced monitoring'],
    activities: ['Backup restoration', 'Domain rejoin', 'Hyper-care monitoring', 'Service validation'],
  },
  improve: {
    mindset: '"How do we prevent this again? How do we detect it faster?"',
    inputs: ['Incident post-mortem', 'Missed detection logs', 'Workflow gaps'],
    outputs: ['New detection rules', 'Updated playbooks', 'Architectural improvements'],
    activities: ['Sigma rule creation', 'SOP updates', 'Purple team exercises', 'Detection gap analysis'],
  },
};

export default function DefenseChainPage() {
  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <div className="section-title mb-1">Framework</div>
        <h1 className="text-xl font-bold text-text-primary">Defense Chain™</h1>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl">
          ETD's proprietary incident response framework. An action-centric, defender-focused pipeline that bridges the gap between NIST policy and MITRE ATT&CK intelligence.
        </p>
      </div>

      {/* Chain Visualization */}
      <div className="space-y-4">
        {DEFENSE_CHAIN_STAGES.map((stage, idx) => {
          const details = stageDetails[stage.stage];
          return (
            <div key={stage.stage} className="flex gap-4">
              {/* Connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: stage.bgColor, border: `2px solid ${stage.borderColor}`, boxShadow: `0 0 20px ${stage.glowColor}` }}
                >
                  <span style={{ color: stage.color }}>{iconMap[stage.icon]}</span>
                </div>
                {idx < DEFENSE_CHAIN_STAGES.length - 1 && (
                  <div className="flex flex-col items-center mt-2 gap-1 flex-1">
                    <div className="w-px flex-1 min-h-[20px]" style={{ background: `linear-gradient(${stage.color}, ${DEFENSE_CHAIN_STAGES[idx+1].color})`, opacity: 0.3 }} />
                    <ArrowDown size={12} style={{ color: stage.color, opacity: 0.4 }} />
                  </div>
                )}
              </div>

              {/* Stage Card */}
              <div className="flex-1 etd-card mb-0 animate-fade-in">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold tracking-widest" style={{ color: stage.color }}>
                        STAGE {idx + 1}
                      </span>
                      <span className="text-[10px] text-text-muted">· Defense Chain™</span>
                    </div>
                    <h2 className="text-lg font-bold text-text-primary">{stage.label}</h2>
                    <p className="text-sm text-text-secondary mt-1">{stage.description}</p>
                  </div>
                </div>

                <div className="mb-3 px-3 py-2 rounded-lg italic text-sm text-text-secondary"
                  style={{ background: stage.bgColor, borderLeft: `3px solid ${stage.color}` }}>
                  {details.mindset}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Inputs</div>
                    <ul className="space-y-1">
                      {details.inputs.map(i => (
                        <li key={i} className="text-xs text-text-secondary flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full" style={{ background: stage.color, flexShrink: 0 }} />
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Outputs</div>
                    <ul className="space-y-1">
                      {details.outputs.map(o => (
                        <li key={o} className="text-xs text-text-secondary flex items-center gap-1.5">
                          <Check size={10} style={{ color: stage.color, flexShrink: 0 }} />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Example Activities</div>
                    <ul className="space-y-1">
                      {details.activities.map(a => (
                        <li key={a} className="text-xs text-text-secondary flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }} />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
