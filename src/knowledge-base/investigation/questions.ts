import { InvestigationObject } from '../../types';

export const investigationKB: InvestigationObject[] = [
  {
    id: 'INV-Q-001',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    question: 'Are the failed logons clustered within a short time window?',
    hint: 'Look for >10 failures within a 5 minute window, indicating automated brute force.',
    evidenceSources: ['Check Event ID 4625 timestamps in SIEM'],
    validationSteps: ['Group events by TargetUserName and sort by TimeGenerated'],
    falsePositiveGuidance: 'A user forgetting their password usually results in 3-5 failed attempts, not 20+.',
    isEscalationTrigger: false
  },
  {
    id: 'INV-Q-002',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    question: 'Is there a successful logon (4624) immediately following the failures?',
    hint: 'This is the primary indicator of a successful password guess or brute force.',
    evidenceSources: ['Check Event ID 4624 for the same TargetUserName and IpAddress'],
    validationSteps: ['Filter for Event ID 4624 where TimeGenerated is shortly after the last 4625'],
    falsePositiveGuidance: 'The user may have finally remembered their password. Check if subsequent behavior is anomalous.',
    isEscalationTrigger: true
  },
  {
    id: 'INV-Q-003',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    question: 'Are there multiple different usernames targeted from the same source IP?',
    hint: 'This indicates Password Spraying rather than a targeted brute force.',
    evidenceSources: ['Aggregate 4625 events by IpAddress and count distinct TargetUserNames'],
    validationSteps: ['Query: SecurityEvent | where EventID==4625 | summarize dcount(TargetUserName) by IpAddress'],
    falsePositiveGuidance: 'A shared NAT gateway or VPN exit node might show many users failing logons from the same IP.',
    isEscalationTrigger: true
  },
  {
    id: 'INV-Q-004',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    question: 'Is the parent process expected to launch this child process?',
    hint: 'e.g., winword.exe launching cmd.exe or powershell.exe is highly suspicious.',
    evidenceSources: ['Check Event ID 4688 ParentProcessName and NewProcessName'],
    validationSteps: ['Verify the software supply chain and expected behavior of the parent application'],
    falsePositiveGuidance: 'Some legacy or poorly written internal applications may launch scripts directly.',
    isEscalationTrigger: true
  },
  {
    id: 'INV-Q-005',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    question: 'Does the command line contain obfuscation or encoded payloads?',
    hint: 'Look for Base64 (-enc, -encodedCommand) or heavy string concatenation.',
    evidenceSources: ['Check Event ID 4688 CommandLine field'],
    validationSteps: ['Decode the Base64 payload and review the actual script being executed'],
    falsePositiveGuidance: 'Some management tools (like SCCM or Azure Arc) legitimately use encoded commands.',
    isEscalationTrigger: true
  },
  {
    id: 'INV-Q-006',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    question: 'Is the service executable signed by a trusted publisher?',
    hint: 'Adversaries often install unsigned or self-signed binaries as services for persistence.',
    evidenceSources: ['Check the digital signature of the ServiceName executable path'],
    validationSteps: ['Use Sysinternals Sigcheck or EDR telemetry to verify the signature'],
    falsePositiveGuidance: 'In-house custom software may not be signed properly.',
    isEscalationTrigger: true
  }
];
