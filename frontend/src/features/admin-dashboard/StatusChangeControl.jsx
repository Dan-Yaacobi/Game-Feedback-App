import { useMemo, useState } from 'react';

import { updateReportStatus } from '../../services/reportsApi';

const STATUS_TRANSITIONS = {
  open: ['investigating'],
  investigating: ['closed'],
  closed: [],
};

function formatStatus(status) {
  if (!status) {
    return 'Unknown';
  }

  return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function StatusChangeControl({ reportId, status, onStatusUpdated }) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const normalizedStatus = (status || '').toLowerCase();
  const availableTransitions = useMemo(
    () => STATUS_TRANSITIONS[normalizedStatus] || [],
    [normalizedStatus]
  );

  const handleStatusChange = async (event) => {
    const nextStatus = event.target.value;

    if (!nextStatus || !availableTransitions.includes(nextStatus)) {
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await updateReportStatus(reportId, nextStatus);
      await onStatusUpdated(nextStatus);
    } catch {
      setError('Could not update status. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="status-change-control">
      <label className="status-change-control__label" htmlFor="status-change-select">
        Status
      </label>
      <select
        id="status-change-select"
        className="ui-select"
        value=""
        onChange={handleStatusChange}
        disabled={isSaving || availableTransitions.length === 0}
      >
        <option value="">{isSaving ? 'Updating...' : `Move from ${formatStatus(normalizedStatus)} to...`}</option>
        {availableTransitions.map((nextStatus) => (
          <option key={nextStatus} value={nextStatus}>
            {formatStatus(nextStatus)}
          </option>
        ))}
      </select>
      {availableTransitions.length === 0 && (
        <p className="status-change-control__hint">No further transitions available.</p>
      )}
      {error && <p className="status-change-control__error">{error}</p>}
    </div>
  );
}
