import { windowsEventKB } from '../../../knowledge-base/event-intel/windowsEvents';
import { KnowledgeEngine } from '../../../core/KnowledgeEngine';
import { useState, useMemo } from 'react';
import { Search, Shield, CheckSquare } from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';
import { EmptyState } from '../../ui/EmptyState';
import type { DetectionObject } from '../../../types';
import { DEFENSE_CHAIN_STAGES } from '../../../data/defenseChain';

const categories = ['All', ...Array.from(new Set(windowsEventKB.map(e => e.telemetrySource)))];

export default function TacticsExplorer() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<DetectionObject | null>(null);
  
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    return windowsEventKB.filter(e => {
      const matchCat = category === 'All' || e.telemetrySource === category;
      const matchSearch = debouncedSearch === '' || 
        e.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
        e.signatureId.includes(debouncedSearch);
      return matchCat && matchSearch;
    });
  }, [category, debouncedSearch]);

  const sevColor: Record<string, string> = { informational: '#64748b', low: '#22d3ee', medium: '#fbbf24', high: '#fb923c', critical: '#f87171' };

  // Get related investigations if an event is selected
  const investigations = selected ? KnowledgeEngine.getInvestigationsForDetection(selected.id) : [];

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div>
        <div className="section-title mb-1">Tactics Explorer</div>
        <h1 className="text-xl font-bold text-text-primary">Defender Tactics Intelligence</h1>
        <p className="text-sm text-text-secondary mt-1">Browse the ETD Knowledge Base. Click any event to view full defender intelligence.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            id="tactics-search" 
            type="text" 
            maxLength={100}
            aria-label="Search security events"
            placeholder="Search events..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-black/20 border border-border-subtle text-text-secondary placeholder-text-muted focus:outline-none focus:border-border-bright" 
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} id={`cat-${cat}`} onClick={() => setCategory(cat)}
              className={`text-xs px-3 py-2 rounded-lg transition-all ${category === cat ? 'btn-primary' : 'btn-ghost'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Event List */}
        <div className="xl:col-span-1 space-y-2">
          {filtered.length === 0 ? (
            <EmptyState 
              title="No events found" 
              message={`We couldn't find any security events matching "${debouncedSearch}".`} 
              icon="search"
            />
          ) : (
            filtered.map(evt => (
            <div key={evt.id}
              onClick={() => setSelected(evt)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${selected?.id === evt.id ? 'glass-bright' : 'hover:bg-white/[0.03]'}`}
              style={{ border: `1px solid ${selected?.id === evt.id ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold" style={{ color: sevColor[evt.baseSeverity] }}>
                  Event {evt.signatureId}
                </span>
                <span className={`badge-${evt.baseSeverity === 'informational' ? 'info' : evt.baseSeverity}`}>
                  {evt.baseSeverity.toUpperCase()}
                </span>
              </div>
              <div className="text-sm font-medium text-text-primary">{evt.name}</div>
              <div className="text-xs text-text-muted mt-1">{evt.telemetrySource}</div>
            </div>
          )))}
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-2">
          {selected ? (
            <div className="space-y-4">
              {/* Event Header */}
              <div className="etd-card">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${sevColor[selected.baseSeverity]}15`, border: `1px solid ${sevColor[selected.baseSeverity]}30` }}>
                    <Shield size={18} style={{ color: sevColor[selected.baseSeverity] }} />
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold text-text-muted">Event {selected.signatureId}</div>
                    <h2 className="text-lg font-bold text-text-primary">{selected.name}</h2>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border-subtle">
                  <div className="text-xs text-text-secondary leading-relaxed">
                    <span className="font-bold text-text-muted">Defender Interest: </span>{selected.defenderInterest}
                  </div>
                </div>
              </div>

              {/* Investigation Intelligence */}
              <div className="etd-card">
                <div className="section-title mb-3">Investigation Intelligence</div>
                <div className="space-y-4">
                  {investigations.map(inv => (
                    <div key={inv.id} className="p-3 bg-[#111111] border border-border-DEFAULT rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <CheckSquare size={14} className="text-investigate mt-0.5 flex-shrink-0" />
                        <div className="text-sm font-medium text-text-primary">{inv.question}</div>
                      </div>
                      <div className="ml-6 space-y-2 text-xs">
                        {inv.hint && <div className="text-text-muted italic">Hint: {inv.hint}</div>}
                        <div className="text-text-secondary"><span className="text-text-muted font-bold">Evidence:</span> {inv.evidenceSources.join(', ')}</div>
                        <div className="text-text-secondary"><span className="text-text-muted font-bold">False Positive:</span> {inv.falsePositiveGuidance}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MITRE Mappings */}
              <div className="etd-card">
                <div className="section-title mb-3">MITRE ATT&CK</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selected.mitreMappings.map(m => (
                    <div key={m.techniqueId} className="p-3 rounded-lg"
                      style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                      <div className="text-[10px] font-bold text-eradicate">{m.tacticId} · {m.tacticName}</div>
                      <div className="text-xs text-text-secondary mt-1">{m.techniqueId} — {m.techniqueName}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Defense Chain Mapping */}
              <div className="etd-card">
                <div className="section-title mb-3">Defense Chain™ Mapping</div>
                <div className="space-y-2">
                  {DEFENSE_CHAIN_STAGES.map(s => (
                    <div key={s.stage} className="flex gap-3 text-xs py-2 border-b border-border-subtle last:border-0">
                      <span className="font-bold w-24 flex-shrink-0" style={{ color: s.color }}>{s.label}</span>
                      <span className="text-text-muted">{(selected.defenseChainMapping as Record<string, string>)[s.stage]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="etd-card h-full flex items-center justify-center text-center py-20">
              <div>
                <Shield size={40} className="text-text-muted mx-auto mb-3" />
                <div className="text-text-muted text-sm">Select an event to view defender intelligence</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
