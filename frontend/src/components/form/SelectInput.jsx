import FormError from './FormError';

export default function SelectInput({ id, label, value, name, onChange, options, error }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-select ${error ? 'has-error' : ''}`}
      >
        <option value="">Select a report type</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FormError error={error} />
    </div>
  );
}
