import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Activity, Map, FileText, BookOpen, Terminal, Zap, Eye, Lock, Radio, AlertOctagon, CheckCircle2, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DefenseChainHUD from '../components/DefenseChainHUD';

// ── Animated counter hook ──────────────────────────────────────────────────
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return { count, ref };
}

// ── Live threat feed data ──────────────────────────────────────────────────
const threatEvents = [
  { id: 1, severity: 'critical', event: 'Lateral Movement Detected', host: 'WS-CORP-047', time: '2s ago' },
  { id: 2, severity: 'high',     event: 'Credential Dumping – LSASS', host: 'DC-PROD-01',  time: '18s ago' },
  { id: 3, severity: 'medium',   event: 'Suspicious PowerShell Exec', host: 'WS-CORP-021', time: '1m ago' },
  { id: 4, severity: 'high',     event: 'Impossible Travel Alert',    host: 'ADM-USER-09', time: '3m ago' },
  { id: 5, severity: 'low',      event: 'Port Scan from Internal IP', host: '10.10.1.55',  time: '7m ago' },
  { id: 6, severity: 'critical', event: 'Ransomware IOC Matched',     host: 'FS-SERVER-03',time: '12m ago' },
];

const severityColors: Record<string, string> = {
  critical: 'bg-severity-critical text-severity-critical',
  high:     'bg-severity-high text-severity-high',
  medium:   'bg-severity-medium text-severity-medium',
  low:      'bg-severity-low text-severity-low',
};

// ── Stage colors ───────────────────────────────────────────────────────────
const stages = [
  { id: 'DETECT',      icon: Eye,          color: '#3B82F6', desc: 'Identify malicious signals across all telemetry planes.' },
  { id: 'ALERT',       icon: Radio,        color: '#2563EB', desc: 'Generate high-fidelity, deduplicated SOC alerts.' },
  { id: 'INVESTIGATE', icon: Terminal,     color: '#1D4ED8', desc: 'Reconstruct the attack narrative from evidence.' },
  { id: 'CONTAIN',     icon: Lock,         color: '#F59E0B', desc: 'Isolate compromised assets and stop the spread.' },
  { id: 'ERADICATE',   icon: AlertOctagon, color: '#EF4444', desc: 'Remove the threat root cause from the environment.' },
  { id: 'RECOVER',     icon: CheckCircle2, color: '#10B981', desc: 'Restore operations to verified clean state.' },
  { id: 'IMPROVE',     icon: Zap,          color: '#22C55E', desc: 'Harden defenses using post-incident intelligence.' },
];

const features = [
  { icon: Eye,          title: 'Detection Intelligence',    desc: 'Maps attack techniques to detection opportunities across endpoint, identity, and network planes.' },
  { icon: Terminal,     title: 'IOC Generator',             desc: 'Derives high-confidence Indicators of Compromise from correlated raw event data.' },
  { icon: Radio,        title: 'Alert Simulator',           desc: 'Visualizes exactly which SIEM/EDR rules would fire at each stage of the kill chain.' },
  { icon: Map,          title: 'MITRE ATT&CK Mapping',      desc: 'Every tactic and technique is cross-referenced with live D3FEND mitigations.' },
  { icon: Lock,         title: 'Incident Response Engine',  desc: 'Dynamic playbooks built in real-time from threat context and severity scoring.' },
  { icon: Activity,     title: 'SOC Timeline',              desc: 'Visual incident chronology from first beacon to full containment.' },
  { icon: Shield,       title: 'Risk Score Engine',         desc: 'Continuous risk quantification using CVSS, asset criticality, and blast radius.' },
  { icon: FileText,     title: 'Report Generator',          desc: 'MITRE D3FEND–aligned incident reports separated into verified vs residual risk.' },
];

const stats = [
  { value: 1240000, suffix: '+', label: 'Events Processed Daily',    color: '#3B82F6' },
  { value: 94,      suffix: '%', label: 'Detection Coverage',        color: '#10B981' },
  { value: 4,       suffix: 'm', label: 'Avg Detection Time',        color: '#F59E0B' },
  { value: 847,     suffix: '+', label: 'Threats Contained (90d)',   color: '#22C55E' },
];

// ── Floating particle background ──────────────────────────────────────────
function ParticleBg() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 5,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-brand-electricBlue/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── Stat Counter Block ──────────────────────────────────────────────────────
function StatCard({ value, suffix, label, color }: { value: number; suffix: string; label: string; color: string }) {
  const { count, ref } = useCounter(value, 2200);
  const display = value >= 10000 ? `${(count / 1000).toFixed(0)}K` : count.toString();
  return (
    <div className="glass rounded-2xl p-6 text-center border border-border-subtle hover:border-brand-electricBlue/40 transition-colors">
      <span ref={ref} className="text-4xl font-black" style={{ color }}>
        {display}{suffix}
      </span>
      <p className="text-sm text-text-muted mt-2 font-medium">{label}</p>
    </div>
  );
}

// ── Live Threat Feed ────────────────────────────────────────────────────────
function LiveThreatFeed() {
  const [events, setEvents] = useState(threatEvents);
  const [newIdx, setNewIdx] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = {
        ...threatEvents[Math.floor(Math.random() * threatEvents.length)],
        id: Date.now(),
        time: 'just now',
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 5)]);
      setNewIdx(0);
      setTimeout(() => setNewIdx(null), 800);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      {events.map((ev, i) => (
        <motion.div
          key={ev.id}
          initial={i === 0 && newIdx === 0 ? { opacity: 0, x: -20 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-bg-primary/60 border border-border-subtle hover:border-brand-electricBlue/30 transition-colors"
        >
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${severityColors[ev.severity].split(' ')[0]}/80`}
               style={{ backgroundColor: ev.severity === 'critical' ? '#EF4444' : ev.severity === 'high' ? '#F97316' : ev.severity === 'medium' ? '#F59E0B' : '#22C55E' }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-text-primary truncate">{ev.event}</div>
            <div className="text-[10px] text-text-muted font-mono">{ev.host}</div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-text-muted flex-shrink-0">
            <Clock size={9} />
            {ev.time}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col">

      {/* ══ 1. HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-12 text-center overflow-hidden py-24">
        <ParticleBg />

        {/* Radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-defenderBlue/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-securityGreen/8 blur-[100px] rounded-full pointer-events-none" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-brand-defenderBlue/10 border border-brand-defenderBlue/30 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-brand-electricBlue animate-pulse" />
          <span className="text-xs font-semibold text-brand-electricBlue uppercase tracking-[0.2em]">Blue Team Operations Platform</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight max-w-6xl mb-6 leading-[1.05]"
        >
          Understand how{' '}
          <span className="text-transparent bg-clip-text bg-primary-gradient">defenders</span>
          {' '}detect, investigate, and recover.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mb-12 leading-relaxed"
        >
          A technical deep-dive into modern defender methodologies — from first signal to full recovery, visualized through the <span className="text-brand-electricBlue font-semibold">Defense Chain™</span> framework.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <button
            onClick={() => navigate('/app')}
            className="btn-primary px-10 py-4 text-base font-bold shadow-card-glow hover:scale-105 active:scale-100 transition-transform flex items-center gap-2"
          >
            Initialize Defense <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/app/defense-chain')}
            className="btn-ghost px-10 py-4 text-base font-bold hover:scale-105 active:scale-100 transition-transform flex items-center gap-2"
          >
            View Live Incident <Activity size={18} />
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </motion.div>
      </section>

      {/* ══ 2. LIVE SOC PANEL ════════════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-12 bg-bg-secondary/40 border-y border-border-subtle">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left – Live Threat Feed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-brand-electricBlue font-mono text-sm mb-3 font-semibold">01 // LIVE THREAT FEED</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Real-Time Event Stream</h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              A live view of the ingested security event pipeline. Every alert is classified, correlated, and mapped to a Defense Chain stage before reaching a SOC analyst.
            </p>

            <div className="glass rounded-2xl p-4 border border-border-DEFAULT">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-securityGreen animate-pulse" />
                  <span className="text-xs font-semibold text-brand-securityGreen uppercase tracking-widest">Live — Security Event Stream</span>
                </div>
                <span className="text-xs text-text-muted font-mono">ETD-SOC-01</span>
              </div>
              <LiveThreatFeed />
            </div>
          </motion.div>

          {/* Right – Visual SOC card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Risk Meter */}
            <div className="glass rounded-2xl p-6 border border-border-DEFAULT">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-text-muted uppercase tracking-widest">Current Risk Score</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-severity-high animate-pulse" />
                  <span className="text-xs text-severity-high font-semibold">HIGH</span>
                </div>
              </div>
              <div className="text-6xl font-black text-white mb-4">84 <span className="text-xl text-text-muted font-normal">/ 100</span></div>
              <div className="w-full h-3 bg-bg-primary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '84%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #2563EB, #EF4444)' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-text-muted mt-1.5">
                <span>Low</span><span>Critical</span>
              </div>
            </div>

            {/* Active Defense Stages */}
            <div className="glass rounded-2xl p-6 border border-border-DEFAULT">
              <div className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-4">Defense Chain Status</div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { stage: 'DETECT', done: true },
                  { stage: 'ALERT', done: true },
                  { stage: 'INVESTIGATE', active: true },
                  { stage: 'CONTAIN', pending: true },
                  { stage: 'ERADICATE', pending: true },
                  { stage: 'RECOVER', pending: true },
                  { stage: 'IMPROVE', pending: true },
                ].map(s => (
                  <div key={s.stage} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    s.done    ? 'bg-brand-securityGreen/15 text-brand-securityGreen border border-brand-securityGreen/30' :
                    s.active  ? 'bg-brand-defenderBlue/20 text-brand-electricBlue border border-brand-electricBlue/40 animate-pulse' :
                                'bg-bg-primary/50 text-text-muted border border-border-subtle'
                  }`}>
                    {s.stage}
                  </div>
                ))}
              </div>
            </div>

            {/* Incident Count */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Critical', count: 2, color: '#EF4444' },
                { label: 'High',     count: 5, color: '#F97316' },
                { label: 'Medium',   count: 12, color: '#F59E0B' },
              ].map(item => (
                <div key={item.label} className="glass rounded-xl p-4 text-center border border-border-subtle">
                  <div className="text-2xl font-black mb-1" style={{ color: item.color }}>{item.count}</div>
                  <div className="text-xs text-text-muted">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══ 3. DEFENSE CHAIN STAGES ══════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-brand-electricBlue font-mono text-sm mb-3 font-semibold">02 // DEFENSE CHAIN™ FRAMEWORK</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Every stage. Every action.</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              ETD maps every security event to one of seven structured stages, giving your team a clear tactical picture at all times.
            </p>
          </motion.div>

          {/* Stage cards with connector line */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-defenderBlue/40 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
              {stages.map((stage, i) => {
                const Icon = stage.icon;
                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="glass rounded-2xl p-5 text-center border border-border-subtle hover:shadow-card-glow transition-all duration-300 cursor-default relative"
                    style={{ '--stage-color': stage.color } as React.CSSProperties}
                  >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-4 right-4 h-0.5 rounded-b-full" style={{ background: stage.color }} />

                    <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${stage.color}18`, border: `1px solid ${stage.color}40` }}>
                      <Icon size={18} style={{ color: stage.color }} />
                    </div>
                    <div className="text-xs font-mono text-text-muted mb-1">{String(i + 1).padStart(2, '0')}</div>
                    <h3 className="text-sm font-black text-white mb-2">{stage.id}</h3>
                    <p className="text-[10px] text-text-secondary leading-relaxed">{stage.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Live HUD preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-bg-primary rounded-2xl p-8 border border-border-DEFAULT shadow-glass"
          >
            <DefenseChainHUD activeStage="investigate" completedStages={['detect', 'triage']} />
          </motion.div>
        </div>
      </section>

      {/* ══ 4. FEATURE GRID ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-12 bg-bg-secondary/40 border-y border-border-subtle">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-brand-electricBlue font-mono text-sm mb-3 font-semibold">03 // PLATFORM CAPABILITIES</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Built for the modern SOC.</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Modular engines covering detection, investigation, response, and reporting — fully integrated into a single defender intelligence platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -6 }}
                  className="glass rounded-2xl p-6 border border-border-subtle hover:border-brand-electricBlue/40 hover:shadow-card-glow transition-all duration-300 cursor-default group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-defenderBlue/10 border border-brand-defenderBlue/20 flex items-center justify-center mb-5 group-hover:bg-brand-defenderBlue/20 transition-colors">
                    <Icon size={22} className="text-brand-electricBlue" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 5. DEFENSE IN DEPTH ══════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <div className="text-brand-electricBlue font-mono text-sm mb-3 font-semibold">04 // DEFENSIVE PHILOSOPHY</div>
              <h2 className="text-4xl font-bold text-white mb-5">Defense in Depth, visualized.</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Modern defenders layer controls across telemetry, identity, and network planes so a single failure never becomes a full breach. ETD shows you exactly where those layers are — and where they fail.
              </p>
              <p className="text-text-secondary leading-relaxed">
                By correlating signals across planes, ETD reconstructs the attacker's path and the defender's counter-move side by side — turning a noisy SOC into a clear, navigable narrative.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-border-subtle">
              {[
                { icon: Activity, color: '#3B82F6', title: 'Raw Signals to Narrative', desc: 'SIEM events, EDR alerts, and identity telemetry fused into a single attacker story.' },
                { icon: Shield,   color: '#10B981', title: 'Predictive Containment',   desc: "Anticipate attacker next-moves and pre-position containment before spread." },
                { icon: FileText, color: '#2563EB', title: 'Defender-Grade Reporting', desc: 'MITRE D3FEND–aligned reports with verified containment evidence.' },
                { icon: Zap,      color: '#22C55E', title: 'Continuous Improvement',   desc: 'Post-incident lessons feed directly into detection rule hardening.' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: `${item.color}18`, border: `1px solid ${item.color}40` }}>
                      <Icon size={18} style={{ color: item.color }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Animated network/correlation visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[480px] rounded-2xl border border-border-DEFAULT bg-bg-primary overflow-hidden"
          >
            {/* Pulsing grid background */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3B82F6" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Animated correlation paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M 80 120 Q 200 60 320 180 T 520 220"
                stroke="#3B82F6" strokeWidth="1.5" fill="transparent" strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
              />
              <motion.path
                d="M 60 300 Q 180 380 300 260 T 520 180"
                stroke="#10B981" strokeWidth="1.5" fill="transparent" strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              />
              <motion.path
                d="M 150 420 Q 280 340 400 380 T 540 260"
                stroke="#8B5CF6" strokeWidth="1.5" fill="transparent" strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.35 }}
                transition={{ duration: 3, ease: 'easeInOut', delay: 1, repeat: Infinity, repeatType: 'reverse' }}
              />
            </svg>

            {/* Pulsing nodes */}
            {[
              { x: '15%', y: '22%', label: 'Endpoint',   color: '#3B82F6' },
              { x: '55%', y: '40%', label: 'SIEM',        color: '#10B981' },
              { x: '75%', y: '18%', label: 'Identity',    color: '#8B5CF6' },
              { x: '30%', y: '70%', label: 'Network',     color: '#F59E0B' },
              { x: '65%', y: '72%', label: 'Cloud',       color: '#22C55E' },
            ].map((node, i) => (
              <div key={node.label} className="absolute flex flex-col items-center gap-1" style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}>
                <motion.div
                  className="relative"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                >
                  <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center backdrop-blur-sm"
                       style={{ background: `${node.color}18`, borderColor: `${node.color}60` }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: node.color }} />
                  </div>
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border"
                    style={{ borderColor: node.color }}
                    animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  />
                </motion.div>
                <span className="text-[10px] font-semibold text-text-muted">{node.label}</span>
              </div>
            ))}

            {/* Center label */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass rounded-xl p-4 text-center border border-brand-electricBlue/20">
                <div className="text-sm font-bold text-white mb-1">Multi-Plane Signal Correlation</div>
                <div className="text-xs text-text-muted">Identity + Network + Endpoint fused in real-time</div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══ 6. CTA ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 md:px-12 text-center overflow-hidden">
        <div className="absolute inset-0 bg-primary-gradient opacity-5 pointer-events-none" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-defenderBlue/10 border border-brand-defenderBlue/30 mb-8">
              <Shield size={12} className="text-brand-electricBlue" />
              <span className="text-xs font-semibold text-brand-electricBlue uppercase tracking-widest">Defender Intelligence Platform</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Analyze your<br />
              <span className="text-transparent bg-clip-text bg-primary-gradient">defense posture.</span>
            </h2>
            <p className="text-lg text-text-secondary mb-12 leading-relaxed max-w-xl mx-auto">
              Input your telemetry, IOCs, and active controls. Get a full MITRE D3FEND defense-chain walkthrough with containment scoring — instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/app')} className="btn-primary px-10 py-4 text-lg font-bold shadow-card-glow hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Initialize Defense Platform <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/app/docs')} className="btn-ghost px-10 py-4 text-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Read the Docs <BookOpen size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
