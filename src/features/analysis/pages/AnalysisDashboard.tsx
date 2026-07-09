import { useState } from 'react';
import { mockIncidents, mockTimelineData, mockDefenseChainStats } from '../../../data/mockIncidents';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import IncidentCard from '../../core/components/IncidentCard';
import DefenseChainHUD from '../../core/components/DefenseChainHUD';

const COLORS = ['#22d3ee', '#818cf8', '#60a5fa', '#fb923c', '#f87171', '#34d399', '#a78bfa'];

export default function AnalysisDashboard() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? mockIncidents
    : mockIncidents.filter(i => i.severity === filter);

  return (
    <div className="space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="section-title mb-1">Analysis Dashboard</div>
          <h1 className="text-xl font-bold text-text-primary">Security Operations Overview</h1>
        </div>
        <div className="flex gap-2">
          <button id="refresh-dashboard-btn" className="btn-ghost flex items-center gap-2 text-xs">
            <RefreshCw size={12} /> Refresh
          </button>
          <select id="severity-filter" value={filter} onChange={e => setFilter(e.target.value)}
            className="text-xs bg-black/20 border border-border-subtle rounded-lg px-3 py-1.5 text-text-secondary focus:outline-none focus:border-border-bright">
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Defense Chain Pipeline Stats */}
      <DefenseChainHUD activeStage="investigate" completedStages={['detect', 'triage']} />

      {/* Defense Chain Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="etd-card">
          <div className="section-title mb-1">Defense Chain Workload</div>
          <div className="text-sm font-semibold text-text-primary mb-4">Active vs Resolved per Stage</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockDefenseChainStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="stage" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d1420', border: '1px solid rgba(99,179,237,0.2)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="active" fill="#f87171" name="Active" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" fill="rgba(52,211,153,0.4)" name="Resolved" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alert Volume */}
        <div className="etd-card">
          <div className="section-title mb-1">Alert Volume</div>
          <div className="text-sm font-semibold text-text-primary mb-4">Events & Severity Over Time</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockTimelineData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d1420', border: '1px solid rgba(99,179,237,0.2)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="events" stroke="#22d3ee" strokeWidth={2} fill="url(#grad1)" name="Events" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incident List */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={16} className="text-contain" />
          <div className="section-title">Incident Queue</div>
          <span className="badge-high ml-auto">{filtered.length} Incidents</span>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map(incident => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>
    </div>
  );
}
