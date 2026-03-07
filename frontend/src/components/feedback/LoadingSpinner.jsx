export default function LoadingSpinner({ size = 'md' }) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`} role="status" aria-live="polite" aria-label="Loading">
      <span className="loading-spinner__circle" aria-hidden="true" />
    </div>
  );
}
