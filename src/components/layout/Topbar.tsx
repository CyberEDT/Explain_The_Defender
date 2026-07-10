import { Search, Bell, AlertTriangle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    // Future integration point for global search
    if (debouncedSearch) {
      // console.log('Global search trigger:', debouncedSearch);
    }
  }, [debouncedSearch]);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <header className="h-14 flex-shrink-0 glass border-b border-border-subtle flex items-center px-6 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            id="global-search"
            type="text"
            maxLength={100}
            aria-label="Search events, incidents, rules"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, incidents, rules..."
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg bg-black/20 border border-border-subtle text-text-secondary placeholder-text-muted focus:outline-none focus:border-border-bright focus:text-text-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Time */}
        <div className="hidden md:flex items-center gap-2 text-text-muted">
          <Clock size={13} />
          <span className="font-mono text-xs">{timeStr}</span>
          <span className="text-xs opacity-50">{dateStr}</span>
        </div>

        {/* Alert indicator */}
        <div className="relative">
          <button id="notifications-btn" className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-eradicate animate-pulse-slow"></span>
          </button>
        </div>

        {/* Active incident pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-severity-critical/10 border border-severity-critical/20">
          <AlertTriangle size={13} className="text-severity-critical" />
          <span className="text-xs font-medium text-severity-critical">4 Active</span>
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-brand-electricBlue cursor-pointer bg-brand-electricBlue/10 border border-brand-electricBlue/20">
          SOC
        </div>
      </div>
    </header>
  );
}
