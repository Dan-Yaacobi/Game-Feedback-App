import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EmptyState from '../../components/feedback/EmptyState';
import ErrorBanner from '../../components/feedback/ErrorBanner';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import apiClient from '../../services/apiClient';
import { getReports } from '../../services/reportsApi';
import { mapHttpError } from '../../utils/httpErrorMapper';
import useAdminAuth from '../admin-auth/useAdminAuth';
import '../../styles/admin-dashboard.css';
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
  const navigate = useNavigate();
  const { clearAuthentication } = useAdminAuth();
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

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

  const handleLogout = () => {
    clearAuthentication();
    navigate('/admin/login', { replace: true });
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsPasswordSubmitting(true);

    try {
      await apiClient.post('/admin/change-password', {
        currentPassword,
        newPassword,
      });

      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      setPasswordError('Could not change password. Check your current password and try again.');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <section className="admin-dashboard ui-panel">
      <header className="admin-dashboard__header ui-panel-header">
        <div className="admin-dashboard__header-row">
          <div>
            <h2 className="page-title ui-panel-title">Admin Dashboard</h2>
            <p className="admin-dashboard__subtitle">Review incoming player reports and track their status.</p>
          </div>
          <button type="button" className="ui-button ui-button-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="ui-panel-body">
        <ReportFilters filters={filters} onFilterChange={handleFilterChange} />

        {isLoading && <LoadingSpinner />}
        {!isLoading && <ErrorBanner message={error} />}
        {!isLoading && !error && reports.length === 0 && <EmptyState message="No reports found." />}
        {!isLoading && !error && reports.length > 0 && <ReportTable reports={reports} onStatusChangeSuccess={fetchReports} />}

        <footer className="admin-dashboard__pagination" aria-label="Pagination controls">
          <button className="ui-button ui-button-secondary" type="button" onClick={handlePrevious} disabled={page === 1 || isLoading}>
            Previous
          </button>
          <span>
            Page {page}
            {totalPages ? ` of ${totalPages}` : ''}
          </span>
          <button className="ui-button ui-button-secondary" type="button" onClick={handleNext} disabled={!hasNextPage || isLoading}>
            Next
          </button>
        </footer>

        <section className="admin-settings" aria-labelledby="admin-settings-title">
          <h3 id="admin-settings-title">Admin Settings</h3>
          <form className="admin-settings__form" onSubmit={handleChangePassword}>
            <div className="form-field">
              <label className="form-label" htmlFor="current-password">
                Current password
              </label>
              <input
                id="current-password"
                className="ui-input"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                minLength={4}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="new-password">
                New password
              </label>
              <input
                id="new-password"
                className="ui-input"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={6}
                required
              />
            </div>

            {passwordError && <p className="form-error">{passwordError}</p>}
            {passwordSuccess && <p className="admin-settings__success">{passwordSuccess}</p>}

            <button className="ui-button ui-button-primary" type="submit" disabled={isPasswordSubmitting}>
              {isPasswordSubmitting ? 'Updating...' : 'Change password'}
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}
