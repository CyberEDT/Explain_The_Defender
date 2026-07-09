import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

export default function LandingLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="h-20 glass border-b border-border-subtle flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden transition-all group-hover:scale-105">
              <img src="/logo.png" alt="ETD Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm font-bold text-text-primary tracking-wide">ETD</div>
              <div className="text-[10px] text-brand-securityGreen tracking-widest uppercase">Explain The Defender</div>
            </div>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8">
            {['Defense Chain', 'Investigations', 'Incidents', 'Reports', 'Knowledge', 'Docs'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-text-secondary hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app')} className="btn-primary flex items-center gap-2">
            Initialize Defense <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-12 text-center text-sm text-text-muted bg-bg-secondary">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/logo.png" alt="ETD Logo" className="w-5 h-5 object-contain" />
          <span className="font-bold text-white tracking-wide">ETD Platform</span>
        </div>
        <p className="opacity-60">A technical deep-dive into defender methodologies. Built for the modern SOC.</p>
        <p className="opacity-40 mt-8">&copy; {new Date().getFullYear()} Explain The Defender. All rights reserved.</p>
      </footer>
    </div>
  );
}
