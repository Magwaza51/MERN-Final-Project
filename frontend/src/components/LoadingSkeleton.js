import React from 'react';
import './LoadingSkeleton.css';

export const CardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-subtitle"></div>
    </div>
    <div className="skeleton-content">
      <div className="skeleton skeleton-line"></div>
      <div className="skeleton skeleton-line"></div>
      <div className="skeleton skeleton-line short"></div>
    </div>
  </div>
);

export const MetricCardSkeleton = () => (
  <div className="skeleton-metric-card">
    <div className="skeleton skeleton-icon"></div>
    <div className="skeleton skeleton-value"></div>
    <div className="skeleton skeleton-label"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      <div className="skeleton skeleton-th"></div>
      <div className="skeleton skeleton-th"></div>
      <div className="skeleton skeleton-th"></div>
    </div>
    {[...Array(rows)].map((_, index) => (
      <div key={index} className="skeleton-table-row">
        <div className="skeleton skeleton-td"></div>
        <div className="skeleton skeleton-td"></div>
        <div className="skeleton skeleton-td"></div>
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="skeleton-chart">
    <div className="skeleton skeleton-chart-title"></div>
    <div className="skeleton-chart-content">
      {[...Array(5)].map((_, index) => (
        <div 
          key={index} 
          className="skeleton-bar"
          style={{ height: `${Math.random() * 60 + 40}%` }}
        ></div>
      ))}
    </div>
    <div className="skeleton skeleton-chart-legend"></div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="dashboard-skeleton">
    <CardSkeleton />
    <div className="skeleton-metrics-grid">
      <MetricCardSkeleton />
      <MetricCardSkeleton />
      <MetricCardSkeleton />
      <MetricCardSkeleton />
    </div>
    <ChartSkeleton />
    <TableSkeleton rows={3} />
  </div>
);

export default {
  CardSkeleton,
  MetricCardSkeleton,
  TableSkeleton,
  ChartSkeleton,
  DashboardSkeleton
};
