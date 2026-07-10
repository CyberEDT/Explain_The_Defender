import React from 'react';
import { useCILSession } from '../../hooks/useCILSession';
import { CILNavigator } from '../../integrations/cil';
import { Share2, ExternalLink, Shield, Target, Eye } from 'lucide-react';

/**
 * CILBanner — Displays when an active CyberEDT Intelligence Session
 * is present. Allows the user to navigate to other tools in the ecosystem
 * while preserving full intelligence context.
 */
export const CILBanner: React.FC = () => {
  const { isFromCIL, sessionId, hasEMEData, hasETHData, asset, risk } = useCILSession();

  if (!isFromCIL || !sessionId) return null;

  return (
    <div className="relative mx-6 mt-4 etd-card p-4 overflow-hidden border-border-DEFAULT shadow-glass">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-deepCyberBlue via-brand-electricBlue to-brand-electricBlue/20" />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Session Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-electricBlue animate-pulse-slow shadow-card-glow" />
            <span className="text-xs font-bold text-brand-electricBlue tracking-widest uppercase">CYBEREDT CIL SESSION</span>
          </div>

          {/* Tool Status Chips */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${hasEMEData ? 'badge-low' : 'bg-brand-securitySlate/50 text-text-muted border border-border-subtle'}`}>
              <Eye size={10} />
              EME {hasEMEData ? '✓' : '—'}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${hasETHData ? 'badge-high' : 'bg-brand-securitySlate/50 text-text-muted border border-border-subtle'}`}>
              <Target size={10} />
              ETH {hasETHData ? '✓' : '—'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 badge-info">
              <Shield size={10} />
              ETD ✓
            </span>
          </div>

          {/* Asset info */}
          {asset?.ip && (
            <span className="text-xs text-text-muted font-mono bg-bg-secondary px-2 py-1 rounded-md border border-border-subtle flex items-center gap-2">
              {asset.hostname || asset.ip}
              {risk?.riskLevel && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${risk.riskLevel === 'critical' ? 'badge-critical' : 'badge-medium'}`}>
                  {risk.riskLevel}
                </span>
              )}
            </span>
          )}
        </div>

        {/* Right: Navigation Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => CILNavigator.openInEME(sessionId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 bg-brand-emeraldGreen/10 text-brand-emeraldGreen border border-brand-emeraldGreen/30 hover:bg-brand-emeraldGreen/20"
            title="View exposure data in EME"
          >
            <Eye size={14} />
            View Exposure
          </button>
          <button
            onClick={() => CILNavigator.openInETH(sessionId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 bg-brand-eradicate/10 text-brand-eradicate border border-brand-eradicate/30 hover:bg-brand-eradicate/20"
            title="View attack simulation in ETH"
          >
            <Target size={14} />
            Attack Simulation
          </button>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-electricBlue/10 text-brand-electricBlue border border-brand-electricBlue/30 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]"
            title={`Session: ${sessionId}`}
          >
            <Share2 size={12} />
            <span className="font-mono">{sessionId.slice(-8)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
