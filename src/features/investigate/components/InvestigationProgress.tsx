import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface InvestigationProgressProps {
  totalQuestions: number;
  answeredQuestions: number;
}

export function InvestigationProgress({ totalQuestions, answeredQuestions }: InvestigationProgressProps) {
  const percentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  
  const data = [
    {
      name: 'Progress',
      value: percentage,
      fill: percentage === 100 ? '#34d399' : '#D4AF37', // Gold normally, Green when 100%
    }
  ];

  return (
    <div className="w-full h-full bg-[#111111] border border-border-DEFAULT rounded-xl p-5 shadow-card flex flex-col justify-between">
      <div className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
        Investigation Progress
      </div>
      <div className="flex-grow w-full min-h-[150px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" cy="50%" 
            innerRadius="70%" outerRadius="100%" 
            barSize={15} 
            data={data} 
            startAngle={90} endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: 'rgba(163, 163, 163, 0.15)' }}
              dataKey="value"
              cornerRadius={8}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-text-primary">{percentage}%</span>
          <span className="text-[10px] text-text-muted mt-1">{answeredQuestions} / {totalQuestions} Answered</span>
        </div>
      </div>
    </div>
  );
}
