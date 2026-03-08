import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import React from "react"
import AdminDashboardPage from '../features/admin-dashboard/AdminDashboardPage';
import ReportSubmitPage from '../features/report-submit/ReportSubmitPage';

function LandingPage() {
  return (
    <section>
      <h2 className="page-title">Welcome</h2>
      <p>Frontend foundation is ready.</p>
    </section>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/report" element={<ReportSubmitPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
