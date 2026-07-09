// Defense Chain Chart (Funnel/Step Chart)
export type ChartDefenseChain = Array<{ stage: string; active: boolean; timeInStageMs: number }>;

// Risk Charts (Radar Chart)
export type ChartRiskRadar = Array<{ vector: string; score: number; fullMark: number }>;

// Timelines (Scatter Plot)
export type ChartTimeline = Array<{ timestamp: number; severityValue: number; eventName: string }>;

// MITRE Heatmaps (Grid)
export type ChartMitreHeatmap = Array<{ tactic: string; technique: string; hits: number }>;

// Correlation Graphs (Force Directed/Network - Not native Recharts, but data structured for it)
export type ChartCorrelationNetwork = {
  nodes: Array<{ id: string; type: 'event' | 'user' | 'ip'; label: string }>;
  links: Array<{ source: string; target: string; label: string }>;
};
