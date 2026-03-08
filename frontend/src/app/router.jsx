import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdminDashboardPage from '../features/admin-dashboard/AdminDashboardPage';
import AdminLoginPage from '../features/admin-auth/AdminLoginPage';
import HomePage from '../features/home/HomePage';
import ReportSubmitPage from '../features/report-submit/ReportSubmitPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/report" element={<ReportSubmitPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
