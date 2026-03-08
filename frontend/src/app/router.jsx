import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdminDashboardPage from '../features/admin-dashboard/AdminDashboardPage';
import AdminLoginPage from '../features/admin-auth/AdminLoginPage';
import { STORAGE_KEY } from '../features/admin-auth/useAdminAuth';
import ReportSubmitPage from '../features/report-submit/ReportSubmitPage';

function LandingPage() {
  return (
    <section>
      <h2 className="page-title">Welcome</h2>
      <p>Frontend foundation is ready.</p>
    </section>
  );
}

function AdminRouteGuard({ children }) {
  const isAuthenticated = localStorage.getItem(STORAGE_KEY) === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/report" element={<ReportSubmitPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminRouteGuard>
              <AdminDashboardPage />
            </AdminRouteGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
