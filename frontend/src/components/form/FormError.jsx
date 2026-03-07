export default function FormError({ error }) {
  if (!error) {
    return null;
  }

  return (
    <p className="form-error" role="alert">
      {error}
    </p>
  );
}
