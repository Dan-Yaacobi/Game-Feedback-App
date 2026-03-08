const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'Investigating', value: 'investigating' },
  { label: 'Closed', value: 'closed' },
];

const TYPE_OPTIONS = [
  { label: 'All types', value: '' },
  { label: 'Bug', value: 'bug' },
  { label: 'Suggestion', value: 'suggestion' },
  { label: 'Balance issue', value: 'balance_issue' },
];

export default function ReportFilters({ filters, onFilterChange }) {
  return (
    <section className="report-filters" aria-label="Report filters">
      <label className="report-filters__field form-field" htmlFor="filter-status">
        <span className="form-label">Status</span>
        <select
          id="filter-status"
          className="ui-select"
          name="status"
          value={filters.status}
          onChange={(event) => onFilterChange('status', event.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="report-filters__field form-field" htmlFor="filter-report-type">
        <span className="form-label">Report type</span>
        <select
          id="filter-report-type"
          className="ui-select"
          name="report_type"
          value={filters.report_type}
          onChange={(event) => onFilterChange('report_type', event.target.value)}
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
