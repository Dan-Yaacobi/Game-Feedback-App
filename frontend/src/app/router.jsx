import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function LandingPage() {
  return (
    <section>
      <h2 className="page-title">Welcome</h2>
      <p>Frontend foundation is ready.</p>
    </section>
  );
}

function ReportPage() {
  return (
    <section>
      <h2 className="page-title">Report Submission</h2>
      <p>Report submission page coming soon.</p>
    </section>
  );
}

function AdminPage() {
  return (
    <section>
      <h2 className="page-title">Admin Dashboard</h2>
      <p>Admin dashboard page coming soon.</p>
    </section>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
