import { CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react';

const services = [
  { name: 'Detection Engine', status: 'operational', uptime: '99.98%', latency: '12ms' },
  { name: 'Investigation Engine', status: 'operational', uptime: '99.95%', latency: '34ms' },
  { name: 'Triage Engine', status: 'operational', uptime: '100%', latency: '8ms' },
  { name: 'Playbook Engine', status: 'operational', uptime: '99.99%', latency: '21ms' },
  { name: 'Narrative Engine', status: 'operational', uptime: '99.91%', latency: '45ms' },
  { name: 'Scoring Engine', status: 'operational', uptime: '100%', latency: '6ms' },
  { name: 'Defense Chain Mapper', status: 'degraded', uptime: '98.2%', latency: '142ms' },
  { name: 'Knowledge Base API', status: 'operational', uptime: '99.97%', latency: '18ms' },
];

const incidents_hist = [
  { date: 'Jan 15, 2024', summary: 'Scheduled maintenance — Detection Engine', duration: '22m', impact: 'none' },
  { date: 'Jan 12, 2024', summary: 'Defense Chain Mapper elevated latency', duration: '1h 14m', impact: 'degraded' },
  { date: 'Jan 8, 2024', summary: 'Knowledge Base API — cache miss spike', duration: '8m', impact: 'none' },
];

const statusConfig: Record<string, { color: string; label: string; icon: typeof CheckCircle }> = {
  operational: { color: '#34d399', label: 'Operational', icon: CheckCircle },
  degraded: { color: '#fbbf24', label: 'Degraded', icon: AlertCircle },
  down: { color: '#f87171', label: 'Down', icon: AlertCircle },
};

export default function PlatformStatus() {
  const allOk = services.every(s => s.status === 'operational');

  return (
    <div className="space-y-6 max-w-screen-lg">
      <div>
        <div className="section-title mb-1">Platform Status</div>
        <h1 className="text-xl font-bold text-text-primary">ETD System Health</h1>
      </div>

      {/* Overall Status */}
      <div className="etd-card"
        style={{ borderLeft: `4px solid ${allOk ? '#34d399' : '#fbbf24'}` }}>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full animate-pulse-slow" style={{ background: allOk ? '#34d399' : '#fbbf24' }} />
          <div>
            <div className="text-base font-bold" style={{ color: allOk ? '#34d399' : '#fbbf24' }}>
              {allOk ? 'All Systems Operational' : 'Partial Degradation Detected'}
            </div>
            <div className="text-xs text-text-muted">Last checked: just now</div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <div className="section-title mb-4">ETD Intelligence Engines</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map(svc => {
            const cfg = statusConfig[svc.status];
            const Icon = cfg.icon;
            return (
              <div key={svc.name} className="etd-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon size={15} style={{ color: cfg.color }} />
                    <div>
                      <div className="text-sm font-medium text-text-primary">{svc.name}</div>
                      <div className="text-[10px] text-text-muted">Uptime: {svc.uptime} · Latency: {svc.latency}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded"
                    style={{ color: cfg.color, background: `${cfg.color}12`, border: `1px solid ${cfg.color}25` }}>
                    {cfg.label.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incident History */}
      <div className="etd-card">
        <div className="section-title mb-4">Incident History</div>
        <div className="space-y-3">
          {incidents_hist.map(inc => (
            <div key={inc.date} className="flex items-start gap-3 py-3 border-b border-border-subtle last:border-0">
              <Clock size={13} className="text-text-muted mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-medium text-text-primary">{inc.summary}</div>
                <div className="text-[10px] text-text-muted mt-1">
                  {inc.date} · Duration: {inc.duration} ·
                  Impact: <span className={inc.impact === 'none' ? 'text-recover' : 'text-medium'}>{inc.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
