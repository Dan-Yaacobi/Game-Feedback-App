import { useCallback, useEffect, useMemo, useState } from 'react';

import EmptyState from '../../components/feedback/EmptyState';
import ErrorBanner from '../../components/feedback/ErrorBanner';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import { getReports } from '../../services/reportsApi';
import { mapHttpError } from '../../utils/httpErrorMapper';
import '../../styles/admin-dashboard.css';
import GameButton from '../../components/ui/GameButton';
import ReportFilters from './ReportFilters';
import ReportTable from './ReportTable';

const DEFAULT_LIMIT = 20;
const INITIAL_FILTERS = {
  status: '',
  report_type: '',
};

function normalizeResponse(data) {
  const reports = data?.reports || data?.items || [];
  const totalPages = data?.pagination?.total_pages || data?.total_pages || null;

  return {
    reports: Array.isArray(reports) ? reports : [],
    totalPages: typeof totalPages === 'number' && totalPages > 0 ? totalPages : null,
  };
}

export default function AdminDashboardPage() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const queryParams = useMemo(
    () => ({
      page,
      limit: DEFAULT_LIMIT,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.report_type ? { report_type: filters.report_type } : {}),
    }),
    [filters.report_type, filters.status, page]
  );

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getReports(queryParams);
      const normalizedData = normalizeResponse(response.data);
      setReports(normalizedData.reports);
      setTotalPages(normalizedData.totalPages);
    } catch (fetchError) {
      setError(mapHttpError(fetchError));
      setReports([]);
      setTotalPages(null);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFilterChange = (name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
    setPage(1);
  };

  const handlePrevious = () => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  const hasNextPage = totalPages ? page < totalPages : reports.length === DEFAULT_LIMIT;

  const handleNext = () => {
    if (!hasNextPage) {
      return;
    }

    setPage((currentPage) => currentPage + 1);
  };

  return (
    <section className="admin-dashboard ui-panel ui-panel-animate">
      <header className="admin-dashboard__header ui-panel-header">
        <h2 className="page-title ui-panel-title">Admin Dashboard</h2>
        <p className="admin-dashboard__subtitle">Review incoming player reports and track their status.</p>
      </header>

      <div className="ui-panel-body">
        <ReportFilters filters={filters} onFilterChange={handleFilterChange} />

        {isLoading && <LoadingSpinner />}
        {!isLoading && <ErrorBanner message={error} />}
        {!isLoading && !error && reports.length === 0 && <EmptyState message="No reports found." />}
        {!isLoading && !error && reports.length > 0 && <ReportTable reports={reports} onStatusChangeSuccess={fetchReports} />}

        <footer className="admin-dashboard__pagination" aria-label="Pagination controls">
          <GameButton className="ui-button-secondary" type="button" onClick={handlePrevious} disabled={page === 1 || isLoading}>
            Previous
          </GameButton>
          <span>
            Page {page}
            {totalPages ? ` of ${totalPages}` : ''}
          </span>
          <GameButton className="ui-button-secondary" type="button" onClick={handleNext} disabled={!hasNextPage || isLoading}>
            Next
          </GameButton>
        </footer>
      </div>
    </section>
  );
}
