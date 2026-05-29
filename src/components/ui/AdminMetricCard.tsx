interface AdminMetricCardProps {
  label: string;
  value: string | number;
  accent?: string;
}

export function AdminMetricCard({ label, value, accent = '#9dff57' }: AdminMetricCardProps) {
  return (
    <div className="lr-metric-card">
      <div className="lr-metric-label">{label}</div>
      <div className="lr-metric-value" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}
