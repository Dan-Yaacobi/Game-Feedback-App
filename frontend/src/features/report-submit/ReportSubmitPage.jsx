import { useRef, useState } from 'react';

import BalanceIcon from '../../components/icons/BalanceIcon';
import BugIcon from '../../components/icons/BugIcon';
import SuggestionIcon from '../../components/icons/SuggestionIcon';
import FileInput from '../../components/form/FileInput';
import SelectInput from '../../components/form/SelectInput';
import TextArea from '../../components/form/TextArea';
import TextInput from '../../components/form/TextInput';
import ErrorBanner from '../../components/feedback/ErrorBanner';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import SuccessMessage from '../../components/feedback/SuccessMessage';
import { createReport } from '../../services/reportsApi';
import { mapHttpError } from '../../utils/httpErrorMapper';
import {
  ALLOWED_SCREENSHOT_TYPES,
  validateReportSubmit,
} from './reportSubmit.schema';
import '../../styles/report-submit.css';

const initialFormState = {
  title: '',
  description: '',
  report_type: '',
  player_name: '',
  player_email: '',
  tags: '',
};

const reportTypeOptions = [
  { value: 'bug', label: 'Bug' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'balance_issue', label: 'Balance Issue' },
];

export default function ReportSubmitPage() {
  const [formValues, setFormValues] = useState(initialFormState);
  const [screenshot, setScreenshot] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError('');
    setSuccessMessage('');
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setScreenshot(selectedFile);
    setErrors((prev) => ({ ...prev, screenshot: undefined }));
    setSubmitError('');
    setSuccessMessage('');
  };

  const clearForm = () => {
    setFormValues(initialFormState);
    setScreenshot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateReportSubmit(formValues, screenshot);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
      return;
    }

    setErrors({});
    setSubmitError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', formValues.title.trim());
      formData.append('description', formValues.description.trim());
      formData.append('report_type', formValues.report_type);

      if (formValues.player_name.trim()) {
        formData.append('player_name', formValues.player_name.trim());
      }

      if (formValues.player_email.trim()) {
        formData.append('player_email', formValues.player_email.trim());
      }

      if (formValues.tags.trim()) {
        formData.append('tags', formValues.tags.trim());
      }

      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      await createReport(formData);
      clearForm();
      setSuccessMessage('Thank you for your feedback. Your report has been submitted.');
    } catch (error) {
      setSubmitError(mapHttpError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="report-submit-page ui-panel">
      <header className="ui-panel-header">
        <h2 className="page-title ui-panel-title">Submit Report</h2>
        <p className="report-submit-intro">Share bugs, suggestions, and gameplay concerns with our team.</p>
      </header>

      <div className="ui-panel-body">
        <div className="report-submit-types" aria-hidden="true">
          <span className="report-type-chip"><BugIcon /> Bug</span>
          <span className="report-type-chip"><SuggestionIcon /> Suggestion</span>
          <span className="report-type-chip"><BalanceIcon /> Balance</span>
        </div>

        <form className="report-submit-form" onSubmit={handleSubmit} noValidate>
          <TextInput
            id="title"
            label="Title"
            value={formValues.title}
            onChange={handleInputChange}
            error={errors.title}
            name="title"
            placeholder="Brief summary of your report"
            maxLength={150}
          />

          <TextArea
            id="description"
            label="Description"
            value={formValues.description}
            onChange={handleInputChange}
            error={errors.description}
            name="description"
            placeholder="What happened? Include steps to reproduce if relevant."
          />

          <SelectInput
            id="report_type"
            label="Report Type"
            value={formValues.report_type}
            onChange={handleInputChange}
            error={errors.report_type}
            options={reportTypeOptions}
            name="report_type"
          />

          <TextInput
            id="player_name"
            label="Player Name (optional)"
            value={formValues.player_name}
            onChange={handleInputChange}
            error={errors.player_name}
            name="player_name"
            placeholder="Your in-game name"
            maxLength={100}
          />

          <TextInput
            id="player_email"
            label="Player Email (optional)"
            value={formValues.player_email}
            onChange={handleInputChange}
            error={errors.player_email}
            name="player_email"
            type="email"
            placeholder="you@example.com"
          />

          <TextInput
            id="tags"
            label="Tags (optional)"
            value={formValues.tags}
            onChange={handleInputChange}
            error={errors.tags}
            name="tags"
            placeholder="ui, crash, matchmaking"
          />

          <FileInput
            id="screenshot"
            label="Screenshot (optional)"
            onChange={handleFileChange}
            error={errors.screenshot}
            inputRef={fileInputRef}
            accept={ALLOWED_SCREENSHOT_TYPES.join(',')}
            helperText="Accepted formats: PNG, JPEG, WEBP"
          />

          <button type="submit" className="ui-button ui-button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>

        {isSubmitting ? <LoadingSpinner /> : null}
        <ErrorBanner message={submitError} />
        <SuccessMessage message={successMessage} />
      </div>
    </section>
  );
}
