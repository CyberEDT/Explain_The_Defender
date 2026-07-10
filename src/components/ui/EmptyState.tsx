import React from 'react';
import { SearchX, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: 'search' | 'alert';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon = 'search' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-surface-light rounded-xl bg-surface-dark/30 my-8">
      <div className="bg-surface-light p-4 rounded-full mb-4">
        {icon === 'search' ? (
          <SearchX className="w-8 h-8 text-text-secondary" />
        ) : (
          <AlertCircle className="w-8 h-8 text-text-secondary" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-text-secondary max-w-md">{message}</p>
    </div>
  );
};
