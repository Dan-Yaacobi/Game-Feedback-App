import UploadIcon from '../icons/UploadIcon';
import FormError from './FormError';

export default function FileInput({ id, label, onChange, error, accept, helperText, inputRef }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        onChange={onChange}
        accept={accept}
        className={`ui-input ${error ? 'has-error' : ''}`}
      />
      {helperText ? (
        <p className="form-helper">
          <UploadIcon aria-hidden="true" /> {helperText}
        </p>
      ) : null}
      <FormError error={error} />
    </div>
  );
}
