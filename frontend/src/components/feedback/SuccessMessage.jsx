export default function SuccessMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="feedback-banner feedback-banner--success" role="status" aria-live="polite">
      {message}
    </div>
  );
}
