import { NavLink, Routes, Route } from 'react-router-dom';
import { BookMarked, Shield, Code, Search, FileText, GitBranch, Clock } from 'lucide-react';

const docSections = [
  { to: '/docs/defense-model', label: 'Defense Chain Methodology', icon: GitBranch },
  { to: '/docs/detection-rules', label: 'Detection Rules', icon: Code },
  { to: '/docs/investigation-rules', label: 'Investigation Methodology', icon: Search },
  { to: '/docs/knowledge-base', label: 'Knowledge Base', icon: BookMarked },
  { to: '/docs/changelog', label: 'Changelog', icon: Clock },
];

function DefenseModelDoc() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-text-primary">Defense Chain™ Methodology</h2>
      <p className="text-sm text-text-secondary leading-relaxed">
        The Defense Chain™ is ETD's proprietary incident response framework, designed as an <strong>Action-Centric, Defender-Focused</strong> pipeline. Unlike NIST (which is policy-based) or MITRE ATT&CK (which is attacker-centric), Defense Chain™ provides a granular, vendor-agnostic workflow that bridges strategic policy with atomic defender actions.
      </p>
      <div className="space-y-4">
        {['DETECT', 'TRIAGE', 'INVESTIGATE', 'CONTAIN', 'ERADICATE', 'RECOVER', 'IMPROVE'].map((stage, i) => (
          <div key={stage} className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-detect/10 border border-detect/30 flex items-center justify-center text-[10px] font-bold text-detect flex-shrink-0">{i+1}</div>
            <div>
              <div className="text-sm font-bold text-text-primary">{stage}</div>
              <div className="text-xs text-text-muted mt-1">Stage {i+1} of the Defense Chain™ pipeline.</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetectionRulesDoc() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-text-primary">Detection Rules</h2>
      <p className="text-sm text-text-secondary">ETD uses a Sigma-compatible detection rule schema. All rules are mapped to the Defense Chain™ and MITRE ATT&CK framework.</p>
      <div className="code-block text-xs leading-relaxed">
        {`title: Password Spray Detection
id: etd-001
status: stable
description: Detects low-volume authentication failures across multiple accounts
detection:
  selection:
    EventID: 4625
  timeframe: 5m
  condition: selection | count(TargetUserName) by IpAddress > 5
falsepositives:
  - Misconfigured service accounts
level: high
tags:
  - attack.credential_access
  - attack.t1110.003
  - defense_chain.triage`}
      </div>
    </div>
  );
}

function InvestigationRulesDoc() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-text-primary">Investigation Methodology</h2>
      <p className="text-sm text-text-secondary leading-relaxed">ETD's Investigation Engine follows a standardized 6-step methodology designed by DFIR professionals:</p>
      <ol className="space-y-3">
        {[
          ['Context Collection', 'Enrich the alert with asset criticality, user role, and historical context.'],
          ['Evidence Collection', 'Gather related logs within the event time window.'],
          ['Hypothesis Generation', 'Formulate potential scenarios (e.g., brute force vs. user error).'],
          ['Analyst Validation', 'Use the Analyst Question Engine to confirm or disprove hypotheses.'],
          ['Root Cause Analysis', 'Identify the initial access vector and full attack path.'],
          ['Conclusion', 'Document findings and recommend containment actions.'],
        ].map(([title, desc], i) => (
          <li key={title} className="flex gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-detect font-bold w-5 flex-shrink-0">{i+1}.</span>
            <div>
              <div className="text-sm font-semibold text-text-primary">{title}</div>
              <div className="text-xs text-text-muted mt-1">{desc}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function KnowledgeBaseDoc() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-text-primary">Defender Knowledge Base</h2>
      <p className="text-sm text-text-secondary">The ETD Knowledge Base contains defender intelligence for Windows Event Logs, Sysmon, and future integrations. All entries use a Universal Taxonomy to remain vendor-agnostic.</p>
      <div className="grid grid-cols-2 gap-3">
        {['Windows Event Logs', 'MITRE ATT&CK Mappings', 'Investigation Guides', 'Response Playbooks', 'Detection Rules', 'Event Chaining Logic'].map(item => (
          <div key={item} className="p-3 rounded-lg text-xs font-medium text-text-secondary" style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.15)' }}>
            ▹ {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangelogDoc() {
  const changes = [
    { version: 'v1.0.0', date: 'Jan 2024', desc: 'Initial ETD Platform release. Defense Chain™, Windows Event KB, Investigation Engine, Playbook Engine.' },
    { version: 'v0.9.0', date: 'Dec 2023', desc: 'Beta release. Core knowledge base with 6 Windows Event definitions.' },
    { version: 'v0.8.0', date: 'Nov 2023', desc: 'Alpha. Defense Chain™ framework design and architecture.' },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-text-primary">Changelog</h2>
      {changes.map(c => (
        <div key={c.version} className="p-4 rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-detect">{c.version}</span>
            <span className="text-xs text-text-muted">{c.date}</span>
          </div>
          <p className="text-sm text-text-secondary">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default function DocsHub() {
  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <div className="section-title mb-1">Documentation Hub</div>
        <h1 className="text-xl font-bold text-text-primary">ETD Platform Documentation</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="xl:col-span-1">
          <div className="etd-card">
            <div className="section-title mb-3">Contents</div>
            <nav className="space-y-1">
              {docSections.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs transition-all ${isActive ? 'nav-active' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'}`
                  }>
                  <Icon size={13} className="flex-shrink-0" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="xl:col-span-3 etd-card">
          <Routes>
            <Route index element={<DefenseModelDoc />} />
            <Route path="defense-model" element={<DefenseModelDoc />} />
            <Route path="detection-rules" element={<DetectionRulesDoc />} />
            <Route path="investigation-rules" element={<InvestigationRulesDoc />} />
            <Route path="knowledge-base" element={<KnowledgeBaseDoc />} />
            <Route path="changelog" element={<ChangelogDoc />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
