// ============================================================
// CIL — Inlined for ETD (TypeScript)
// ============================================================

const CIL_KEY_PREFIX = 'cyberedt:cil:';
const CIL_ACTIVE_KEY = 'cyberedt:cil:active';

import type { CILSession } from '../../types/cil';

export const CILStore = {
  get(sessionId: string): CILSession | null {
    try {
      const raw = localStorage.getItem(`${CIL_KEY_PREFIX}${sessionId}`);
      return raw ? JSON.parse(raw) as CILSession : null;
    } catch { return null; }
  },
  getActive(): CILSession | null {
    const id = localStorage.getItem(CIL_ACTIVE_KEY);
    return id ? this.get(id) : null;
  },
  patch(sessionId: string, updates: Partial<CILSession>): void {
    const existing = this.get(sessionId);
    if (!existing) return;
    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    try { localStorage.setItem(`${CIL_KEY_PREFIX}${sessionId}`, JSON.stringify(merged)); }
    catch (e) { console.error('[CIL] Patch failed:', e); }
  },
  setActive(sessionId: string): void {
    localStorage.setItem(CIL_ACTIVE_KEY, sessionId);
  },
};

let _channel: BroadcastChannel | null = null;
try { if (typeof BroadcastChannel !== 'undefined') _channel = new BroadcastChannel('cyberedt-cil'); } catch {}
export const CILBus = {
  emit(event: { type: string; sessionId?: string }): void { _channel?.postMessage(event); },
  on(handler: (event: any) => void): () => void {
    if (!_channel) return () => {};
    const fn = (e: MessageEvent) => handler(e.data);
    _channel.addEventListener('message', fn);
    return () => _channel?.removeEventListener('message', fn);
  },
};

const TOOL_URLS = {
  eme: import.meta.env.VITE_EME_URL || 'https://explainmyexposure.cyberedt.com',
  eth: import.meta.env.VITE_ETH_URL || 'https://explainthehacker.cyberedt.com',
};
export const CILNavigator = {
  openInEME: (sessionId: string) => window.open(`${TOOL_URLS.eme}?cil=${sessionId}`, '_blank', 'noopener,noreferrer'),
  openInETH: (sessionId: string) => window.open(`${TOOL_URLS.eth}/lab?cil=${sessionId}`, '_blank', 'noopener,noreferrer'),
  getSessionIdFromURL: (): string | null => new URLSearchParams(window.location.search).get('cil'),
};
