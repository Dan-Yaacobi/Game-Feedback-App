import FormError from './FormError';

export default function TextArea({
  id,
  label,
  value,
  name,
  onChange,
  error,
  placeholder,
  rows = 6,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`form-textarea ${error ? 'has-error' : ''}`}
      />
      <FormError error={error} />
    </div>
  );
}
