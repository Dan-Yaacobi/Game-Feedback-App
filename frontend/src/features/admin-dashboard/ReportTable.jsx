import { useState } from 'react';

import StatusBadge from '../../components/StatusBadge';
import { getReportById } from '../../services/reportsApi';
import ReportDetailDrawer from './ReportDetailDrawer';

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

export default function ReportTable({ reports, onStatusChangeSuccess }) {
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const openDrawerForReport = async (reportId) => {
    setSelectedReportId(reportId);
    setIsDrawerOpen(true);
    setIsLoadingDetail(true);

    try {
      const response = await getReportById(reportId);
      setSelectedReport(response.data?.report || response.data || null);
    } catch {
      setSelectedReport(null);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedReportId(null);
    setSelectedReport(null);
    setIsLoadingDetail(false);
  };

  const handleStatusUpdated = async (nextStatus) => {
    setSelectedReport((currentReport) =>
      currentReport ? { ...currentReport, status: nextStatus, updated_at: new Date().toISOString() } : currentReport
    );

    await onStatusChangeSuccess();
  };

  if (reports.length === 0) {
    return <p className="report-table__empty">No reports found for the selected filters.</p>;
  }

  return (
    <>
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
              <tr
                key={report.id || `${report.title}-${report.created_at}`}
                className="report-table__row"
                onClick={() => openDrawerForReport(report.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openDrawerForReport(report.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Open details for report ${report.title || report.id}`}
              >
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

      <ReportDetailDrawer
        report={selectedReportId && selectedReport ? selectedReport : null}
        isOpen={isDrawerOpen}
        isLoading={isLoadingDetail}
        onClose={closeDrawer}
        onStatusUpdated={handleStatusUpdated}
      />
    </>
  );
}
