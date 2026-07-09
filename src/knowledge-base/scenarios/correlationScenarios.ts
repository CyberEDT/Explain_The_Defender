import type { CorrelationScenario, SecurityEvent, CorrelationResult } from '../../types';

export const correlationScenarios: CorrelationScenario[] = [
  {
    id: 'SCENARIO-CRED-ABUSE-01',
    name: 'Credential Abuse (Password Spray / Brute Force)',
    category: 'Authentication',
    baseSeverity: 'critical',
    basePriority: 'P1',
    match: (events: SecurityEvent[]): CorrelationResult => {
      // Look for multiple 4625s followed by a 4624 from the same IP or for the same user.
      const failedLogons = events.filter(e => e.eventId === 'WEL-4625');
      const successfulLogons = events.filter(e => e.eventId === 'WEL-4624');

      if (failedLogons.length >= 5 && successfulLogons.length > 0) {
        // Check temporal ordering: A success happening after failures.
        // For simplicity in this mock engine, we just check existence in the stream.
        const targetUsers = Array.from(new Set(failedLogons.map(e => e.user)));
        const sourceIps = Array.from(new Set(failedLogons.map(e => e.sourceIp).filter(Boolean)));
        
        const successUser = successfulLogons[0].user;
        const successIp = successfulLogons[0].sourceIp;

        const isSpray = targetUsers.length > 1;

        return {
          matched: true,
          confidence: 95,
          confidenceScore: 'Very High',
          involvedEvents: [...failedLogons, ...successfulLogons],
          narrative: `Repeated authentication failures (${failedLogons.length} attempts) originating from ${sourceIps.join(', ') || 'an unknown source'} targeting ${isSpray ? 'multiple accounts' : 'a single account'} were followed by a successful logon for the \`${successUser}\` account. This strongly indicates successful credential abuse. Immediate containment of the source IP and review of the compromised account is required.`,
        };
      }

      return { matched: false, confidence: 0, confidenceScore: 'Low', involvedEvents: [], narrative: '' };
    }
  },
  {
    id: 'SCENARIO-PERSISTENCE-01',
    name: 'Persistence via Suspicious Service Creation',
    category: 'PersistenceActivity',
    baseSeverity: 'high',
    basePriority: 'P2',
    match: (events: SecurityEvent[]): CorrelationResult => {
      // Look for a successful logon (4624) -> process create (4688) -> service install (7045)
      const logons = events.filter(e => e.eventId === 'WEL-4624');
      const processes = events.filter(e => e.eventId === 'WEL-4688');
      const services = events.filter(e => e.eventId === 'WEL-7045');

      if (logons.length > 0 && processes.length > 0 && services.length > 0) {
        const user = logons[logons.length - 1].user;
        const host = services[0].hostname;
        const serviceName = services[0].raw['ServiceName'] || 'an unknown service';

        return {
          matched: true,
          confidence: 85,
          confidenceScore: 'High',
          involvedEvents: [...logons, ...processes, ...services],
          narrative: `A sequence of successful authentication by \`${user}\` was immediately followed by process execution and the installation of a new background service (\`${serviceName}\`) on \`${host}\`. This behavioral chain strongly indicates persistence establishment, potentially via a remote execution tool like PsExec or an unauthorized administrative script.`,
        };
      }

      return { matched: false, confidence: 0, confidenceScore: 'Low', involvedEvents: [], narrative: '' };
    }
  },
  {
    id: 'SCENARIO-LATERAL-01',
    name: 'Lateral Movement via Rogue Account',
    category: 'LateralMovement',
    baseSeverity: 'high',
    basePriority: 'P2',
    match: (events: SecurityEvent[]): CorrelationResult => {
      // Look for Account Creation (4720) -> Group Add (4728) -> Network Logon (4624 Type 3)
      const accountCreates = events.filter(e => e.eventId === 'WEL-4720');
      const groupAdds = events.filter(e => e.eventId === 'WEL-4728');
      const logons = events.filter(e => e.eventId === 'WEL-4624' && String(e.raw['LogonType']) === '3');

      if (accountCreates.length > 0 && groupAdds.length > 0 && logons.length > 0) {
        const creator = accountCreates[0].user;
        const target = accountCreates[0].raw['TargetUserName'] || 'a new account';

        return {
          matched: true,
          confidence: 90,
          confidenceScore: 'Very High',
          involvedEvents: [...accountCreates, ...groupAdds, ...logons],
          narrative: `User \`${creator}\` created a new account (\`${target}\`) and immediately added it to a privileged group. Shortly after, the newly created account was used to authenticate over the network. This chain is highly indicative of an attacker establishing a rogue administrative account and using it for lateral movement.`,
        };
      }

      return { matched: false, confidence: 0, confidenceScore: 'Low', involvedEvents: [], narrative: '' };
    }
  }
];
