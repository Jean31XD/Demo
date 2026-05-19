import React from 'react';
import type { StatsCardData } from '@/types';

const StatsCard: React.FC<StatsCardData> = ({ label, value, delta, deltaPositive, icon }) => (
  <div
    className="relative flex flex-col gap-3 p-5 overflow-hidden transition-shadow duration-200 hover:shadow-md"
    style={{
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}
  >
    {/* Red left accent */}
    <div
      className="absolute left-0 top-0 bottom-0 w-0.5"
      style={{ background: 'var(--red)' }}
    />

    <div className="flex items-start justify-between gap-2">
      <span className="section-label">{label}</span>
      <span
        className="flex items-center justify-center w-7 h-7 font-black text-xs flex-shrink-0"
        style={{
          background: 'var(--red-pale)',
          color: 'var(--red)',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '0.75rem',
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
    </div>

    <div className="flex items-end justify-between gap-2">
      <span className="metric-value">{value}</span>
      {delta && (
        <span
          className="text-xs font-medium mb-0.5 flex items-center gap-1"
          style={{
            color: deltaPositive ? 'var(--ok)' : 'var(--warn)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span>{deltaPositive ? '↑' : '↓'}</span>
          {delta}
        </span>
      )}
    </div>
  </div>
);

export default StatsCard;
