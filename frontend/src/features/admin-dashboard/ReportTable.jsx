import StatusBadge from '../../components/StatusBadge';

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString();
}

function formatReportType(type) {
  if (!type) {
    return '—';
  }

  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function resolvePlayer(report) {
  return report.player_name || report.player_email || report.player?.name || report.player?.email || '—';
}

function renderTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return '—';
  }

  return tags.join(', ');
}

export default function ReportTable({ reports }) {
  if (reports.length === 0) {
    return <p className="report-table__empty">No reports found for the selected filters.</p>;
  }

  return (
    <div className="report-table__wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th scope="col">Created At</th>
            <th scope="col">Title</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col">Player</th>
            <th scope="col">Tags</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id || `${report.title}-${report.created_at}`}>
              <td>{formatDate(report.created_at)}</td>
              <td>{report.title || '—'}</td>
              <td>{formatReportType(report.report_type)}</td>
              <td>
                <StatusBadge status={report.status} />
              </td>
              <td>{resolvePlayer(report)}</td>
              <td>{renderTags(report.tags)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
