export default function ErrorBanner({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="feedback-banner feedback-banner--error" role="alert" aria-live="assertive">
      {message}
    </div>
  );
}
