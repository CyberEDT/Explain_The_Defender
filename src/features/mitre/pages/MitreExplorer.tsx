import { mockMitreData } from '../../../data/mockIncidents';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';

const techniques = [
  { id: 'T1078', name: 'Valid Accounts', tactic: 'Initial Access / Lateral Movement', count: 12, color: '#f87171' },
  { id: 'T1059.001', name: 'PowerShell', tactic: 'Execution', count: 8, color: '#fb923c' },
  { id: 'T1110', name: 'Brute Force', tactic: 'Credential Access', count: 18, color: '#fbbf24' },
  { id: 'T1136', name: 'Create Account', tactic: 'Persistence', count: 5, color: '#22d3ee' },
  { id: 'T1543.003', name: 'Windows Service', tactic: 'Persistence', count: 7, color: '#818cf8' },
  { id: 'T1021', name: 'Remote Services', tactic: 'Lateral Movement', count: 9, color: '#60a5fa' },
];

const radarData = [
  { tactic: 'Initial Access', A: 80 },
  { tactic: 'Execution', A: 65 },
  { tactic: 'Persistence', A: 90 },
  { tactic: 'Priv Esc', A: 55 },
  { tactic: 'Def Evasion', A: 45 },
  { tactic: 'Cred Access', A: 95 },
  { tactic: 'Lateral Move', A: 70 },
  { tactic: 'Exfiltration', A: 30 },
];

export default function MitreExplorer() {
  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div>
        <div className="section-title mb-1">MITRE ATT&CK Explorer</div>
        <h1 className="text-xl font-bold text-text-primary">Adversary Tactics & Defender Coverage</h1>
        <p className="text-sm text-text-secondary mt-1">Maps observed attacker techniques to the Defense Chain™ response framework.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="etd-card">
          <div className="section-title mb-1">Coverage Radar</div>
          <div className="text-sm font-semibold text-text-primary mb-4">Detection Coverage by Tactic</div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="tactic" tick={{ fill: '#64748b', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0d1420', border: '1px solid rgba(99,179,237,0.2)', borderRadius: 8, fontSize: 12 }} />
              <Radar name="Coverage %" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="etd-card">
          <div className="section-title mb-1">Active Tactics</div>
          <div className="text-sm font-semibold text-text-primary mb-4">Observed ATT&CK Tactic Frequency</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mockMitreData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="tactic" width={130} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d1420', border: '1px solid rgba(99,179,237,0.2)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {mockMitreData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technique Table */}
      <div className="etd-card">
        <div className="section-title mb-4">Active Techniques</div>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {['Technique ID', 'Name', 'Tactic', 'Observations', 'ETD Coverage'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[10px] font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {techniques.map(t => (
                <tr key={t.id} className="border-b border-border-subtle/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono text-xs font-bold" style={{ color: t.color }}>{t.id}</td>
                  <td className="py-3 px-3 text-sm font-medium text-text-primary">{t.name}</td>
                  <td className="py-3 px-3 text-xs text-text-muted">{t.tactic}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/30 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, t.count * 4)}%`, background: t.color }} />
                      </div>
                      <span className="text-xs font-medium text-text-secondary w-6 text-right">{t.count}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="badge-medium">MAPPED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
