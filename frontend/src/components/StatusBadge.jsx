const STATUS_LABELS = {
  open: 'Open',
  investigating: 'Investigating',
  closed: 'Closed',
};

const STATUS_CLASSES = {
  open: 'status-badge--open',
  investigating: 'status-badge--investigating',
  closed: 'status-badge--closed',
};

export default function StatusBadge({ status }) {
  const normalizedStatus = (status || '').toLowerCase();
  const badgeClass = STATUS_CLASSES[normalizedStatus] || 'status-badge--unknown';
  const label = STATUS_LABELS[normalizedStatus] || 'Unknown';

  return <span className={`status-badge ${badgeClass}`}>{label}</span>;
}
