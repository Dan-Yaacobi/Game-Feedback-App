import FormError from './FormError';

export default function TextInput({
  id,
  label,
  value,
  name,
  onChange,
  error,
  type = 'text',
  placeholder,
  maxLength,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`ui-input ${error ? 'has-error' : ''}`}
      />
      <FormError error={error} />
    </div>
  );
}
