import { motion } from 'framer-motion';
import { Activity, ShieldAlert, Crosshair, Map, Shield } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

const mockTimeline = [
  { time: '08:00', events: 120 },
  { time: '09:00', events: 350 },
  { time: '10:00', events: 800 },
  { time: '11:00', events: 1200 },
  { time: '12:00', events: 600 },
  { time: '13:00', events: 450 },
  { time: '14:00', events: 900 },
];

export default function DashboardPreview() {
  return (
    <div className="w-full rounded-2xl bg-bg-secondary border border-border-DEFAULT overflow-hidden shadow-card-glow relative">
      {/* Top Bar */}
      <div className="h-12 bg-bg-primary border-b border-border-subtle flex items-center px-4 gap-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-severity-critical"></div>
          <div className="w-3 h-3 rounded-full bg-severity-medium"></div>
          <div className="w-3 h-3 rounded-full bg-brand-successGreen"></div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-md bg-bg-tertiary text-xs text-text-muted font-mono flex items-center gap-2">
            <Shield size={12} className="text-brand-electricBlue" />
            <span>ETD — SOC Command Center</span>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-12 gap-4 h-[600px] overflow-hidden">
        {/* Left Column */}
        <div className="col-span-3 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-4 h-32 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-muted font-semibold uppercase">Risk Score</span>
              <Activity size={14} className="text-brand-electricBlue" />
            </div>
            <div className="text-4xl font-bold text-text-primary">84<span className="text-sm text-text-muted">/100</span></div>
            <div className="w-full bg-bg-primary h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-brand-electricBlue to-severity-high w-[84%] h-full"></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-4 h-48"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-text-muted font-semibold uppercase">Active Alerts</span>
              <ShieldAlert size={14} className="text-severity-high" />
            </div>
            <div className="space-y-3">
              {[
                { label: 'Suspicious PowerShell', severity: 'critical', time: '2m ago' },
                { label: 'Impossible Travel', severity: 'high', time: '15m ago' },
                { label: 'Multiple Failed Logins', severity: 'medium', time: '1h ago' },
              ].map((alert, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-bg-primary/50 border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-severity-${alert.severity}`}></div>
                    <span className="text-xs text-text-primary truncate w-24">{alert.label}</span>
                  </div>
                  <span className="text-[10px] text-text-muted">{alert.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Center Column */}
        <div className="col-span-6 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-xl p-4 h-64"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-text-muted font-semibold uppercase">Event Timeline</span>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={mockTimeline}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" hide />
                <Tooltip contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="events" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-4 h-48"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-text-muted font-semibold uppercase">MITRE ATT&CK Mapping</span>
              <Map size={14} className="text-brand-electricBlue" />
            </div>
            <div className="flex gap-2">
              {['Initial Access', 'Execution', 'Persistence', 'Privilege Escalation'].map((tactic, i) => (
                <div key={i} className="flex-1 bg-bg-primary/50 border border-border-subtle rounded-lg p-2 flex flex-col justify-center items-center gap-1">
                  <span className="text-xl font-bold text-brand-electricBlue">{Math.floor(Math.random() * 20) + 1}</span>
                  <span className="text-[10px] text-text-muted text-center leading-tight">{tactic}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl p-4 h-full"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-text-muted font-semibold uppercase">Investigation Feed</span>
              <Crosshair size={14} className="text-brand-successGreen" />
            </div>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[9px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-subtle before:to-transparent">
              {[
                { icon: Shield, color: 'text-brand-electricBlue', text: 'Auto-Triage Complete' },
                { icon: Activity, color: 'text-brand-emeraldGreen', text: 'Host Isolated' },
                { icon: Map, color: 'text-severity-high', text: 'Lateral Movement Detected' },
                { icon: ShieldAlert, color: 'text-severity-critical', text: 'P1 Incident Declared' },
              ].map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full border border-border-DEFAULT bg-bg-primary z-10 shrink-0`}>
                    <step.icon size={10} className={step.color} />
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-2 rounded border border-border-subtle bg-bg-primary/50 shadow">
                    <span className="text-[10px] text-text-secondary">{step.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
