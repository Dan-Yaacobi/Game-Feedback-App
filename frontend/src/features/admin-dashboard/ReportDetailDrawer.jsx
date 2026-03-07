import StatusBadge from '../../components/StatusBadge';
import StatusChangeControl from './StatusChangeControl';

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

  return type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function renderTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return '—';
  }

  return tags.join(', ');
}

export default function ReportDetailDrawer({ report, isOpen, isLoading, onClose, onStatusUpdated }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="report-detail-drawer" role="dialog" aria-modal="true" aria-label="Report details">
      <div className="report-detail-drawer__backdrop" onClick={onClose} />
      <aside className="report-detail-drawer__panel">
        <div className="report-detail-drawer__header">
          <h3>Report Details</h3>
          <button type="button" onClick={onClose} aria-label="Close report details">
            Close
          </button>
        </div>

        {isLoading && <p className="report-detail-drawer__state">Loading report details...</p>}

        {!isLoading && report && (
          <div className="report-detail-drawer__content">
            <dl className="report-detail-drawer__fields">
              <div>
                <dt>Title</dt>
                <dd>{report.title || '—'}</dd>
              </div>
              <div>
                <dt>Description</dt>
                <dd>{report.description || '—'}</dd>
              </div>
              <div>
                <dt>Report Type</dt>
                <dd>{formatReportType(report.report_type)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status={report.status} />
                </dd>
              </div>
              <div>
                <dt>Player Name</dt>
                <dd>{report.player_name || report.player?.name || '—'}</dd>
              </div>
              <div>
                <dt>Player Email</dt>
                <dd>{report.player_email || report.player?.email || '—'}</dd>
              </div>
              <div>
                <dt>Tags</dt>
                <dd>{renderTags(report.tags)}</dd>
              </div>
              <div>
                <dt>Created At</dt>
                <dd>{formatDate(report.created_at)}</dd>
              </div>
              <div>
                <dt>Updated At</dt>
                <dd>{formatDate(report.updated_at)}</dd>
              </div>
            </dl>

            {report.screenshot_url && (
              <div className="report-detail-drawer__screenshot">
                <h4>Screenshot</h4>
                <img src={report.screenshot_url} alt="Report screenshot" />
              </div>
            )}

            <StatusChangeControl
              reportId={report.id}
              status={report.status}
              onStatusUpdated={onStatusUpdated}
            />
          </div>
        )}
      </aside>
    </div>
  );
}
