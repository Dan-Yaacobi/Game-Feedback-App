export default function EmptyState({ message = 'No reports found.' }) {
  return <div className="feedback-empty-state">{message}</div>;
}
