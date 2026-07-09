import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { RiskScoreDetails } from '../../../types';

interface RiskRadarProps {
  riskDetails: RiskScoreDetails;
}

export function RiskRadar({ riskDetails }: RiskRadarProps) {
  // Map risk details to chart data
  // The multipliers in riskDetails range up to 2.0 or 1.5, we should normalize them to 10 for visual balance
  
  const data = [
    { subject: 'Event Criticality', value: riskDetails.factors.eventCriticality },
    { subject: 'Asset Value', value: riskDetails.factors.assetCriticality * 5 }, // scale for visualization
    { subject: 'User Privilege', value: riskDetails.factors.userPrivilege * 5 }, // scale for visualization
    { subject: 'Confidence', value: riskDetails.factors.confidence / 10 },
    { subject: 'Exposure', value: riskDetails.factors.exposure * 5 },
  ];

  return (
    <div className="w-full h-full bg-[#111111] border border-border-DEFAULT rounded-xl p-5 shadow-card flex flex-col">
      <div className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider flex justify-between">
        <span>Risk Multiplier Analysis</span>
        <span className="text-brand-electricBlue">Score: {riskDetails.score}/100</span>
      </div>
      <div className="flex-grow w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(163, 163, 163, 0.2)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#A3A3A3', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ background: '#000000', border: '1px solid #D4AF37', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#FBBF24' }}
              formatter={(val: any) => [Number(val).toFixed(1), 'Weight']}
            />
            <Radar
              name="Risk Factors"
              dataKey="value"
              stroke="#D4AF37"
              strokeWidth={2}
              fill="#FBBF24"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
