import { useState, useEffect } from 'react';
import { CILStore, CILBus, CILNavigator } from '../integrations/cil';
import type { CILSession } from '../types/cil';

/**
 * ETD hook to consume CIL intelligence from both EME and ETH.
 * Reads incoming session from URL ?cil= param or active session.
 */
export function useCILSession() {
  const [session, setSession] = useState<CILSession | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const urlSessionId = CILNavigator.getSessionIdFromURL();

    if (urlSessionId) {
      const found = CILStore.get(urlSessionId);
      if (found) {
        setSession(found);
        setSessionId(urlSessionId);
        CILStore.setActive(urlSessionId);
        console.info(`[CIL] ETD loaded session: ${urlSessionId}`);
      }
    } else {
      const active = CILStore.getActive();
      if (active) {
        setSession(active);
        setSessionId(active.sessionId);
      }
    }

    // Live-update when ETH publishes new threat intelligence
    const unsubscribe = CILBus.on((event) => {
      if (event.type === 'ETH_PUBLISHED' || event.type === 'EME_PUBLISHED') {
        const updated = CILStore.get(event.sessionId);
        if (updated) { setSession(updated); setSessionId(event.sessionId); }
      }
      if (event.type === 'SESSION_CLEARED') { setSession(null); setSessionId(null); }
    });

    return unsubscribe;
  }, []);

  return {
    session,
    sessionId,
    isFromCIL: !!session,
    hasEMEData: (session?.metadata?.eme?.published) ?? false,
    hasETHData: (session?.metadata?.eth?.published) ?? false,
    exposures: session?.exposures ?? [],
    attackPaths: session?.attackPaths ?? [],
    threats: session?.threats ?? [],
    mitreTechniques: session?.mitreTechniques ?? [],
    asset: session?.asset ?? null,
    risk: session?.risk ?? null,
  };
}
