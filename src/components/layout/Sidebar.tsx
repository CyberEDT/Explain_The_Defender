import { NavLink } from 'react-router-dom';
import {
  Shield, LayoutDashboard, GitBranch, Crosshair,
  Search, BookOpen, Map, FileText, Activity, BookMarked, ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/app', label: 'Dashboard Home', icon: Shield, exact: true },
  { to: '/app/analysis', label: 'Analysis Dashboard', icon: LayoutDashboard },
  { to: '/app/defense-chain', label: 'Defense Chain™', icon: GitBranch },
  { to: '/app/tactics', label: 'Tactics Explorer', icon: Crosshair },
  { to: '/app/investigation', label: 'Investigation', icon: Search },
  { to: '/app/playbooks', label: 'Playbooks', icon: BookOpen },
  { to: '/app/mitre', label: 'MITRE ATT&CK', icon: Map },
  { to: '/app/report', label: 'Incident Reports', icon: FileText },
  { to: '/app/docs', label: 'Documentation', icon: BookMarked },
  { to: '/app/status', label: 'Platform Status', icon: Activity },
];

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col glass border-r border-border-subtle">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="ETD Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-sm font-bold text-text-primary tracking-wide">ETD</div>
            <div className="text-[10px] text-brand-securityGreen tracking-widest uppercase">Explain The Defender</div>
          </div>
        </div>
      </div>

      {/* Active Incidents Banner */}
      <div className="mx-3 mt-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-eradicate font-medium">Active Incidents</span>
          <span className="text-xs font-bold text-eradicate">4</span>
        </div>
        <div className="flex gap-1 mt-1.5">
          <span className="badge-critical">2 Critical</span>
          <span className="badge-high">2 High</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="section-title px-3 mb-3">Navigation</div>
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                isActive
                  ? 'nav-active font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-brand-defenderBlue/10'
              }`
            }
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-securityGreen animate-pulse-slow"></div>
          <span className="text-xs text-text-muted">Defense Chain™ Active</span>
        </div>
        <div className="text-[10px] text-text-muted mt-1 font-mono">v1.0.0 — ETD Platform</div>
      </div>
    </aside>
  );
}
