import React from 'react';
import { PackageSearch } from 'lucide-react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <PackageSearch size={36} strokeWidth={1.0} style={{ color: 'var(--border)' }} aria-hidden="true" />
    <p
      className="font-bold uppercase tracking-widest text-sm"
      style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--faint)' }}
    >
      {title}
    </p>
    {description && (
      <p className="mono-tag max-w-xs">{description}</p>
    )}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default EmptyState;
