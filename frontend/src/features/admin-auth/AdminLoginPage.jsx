import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import apiClient from '../../services/apiClient';
import useAdminAuth from './useAdminAuth';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setAuthenticated } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiClient.post('/admin/login', { password });
      const isAuthenticated = response?.data?.authenticated === true;

      if (!isAuthenticated) {
        setError('Incorrect password. Please try again.');
        return;
      }

      setAuthenticated();
      navigate('/admin', { replace: true });
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="ui-panel" style={{ maxWidth: '420px', margin: '0 auto' }}>
      <header className="ui-panel-header">
        <h2 className="page-title ui-panel-title">Admin Login</h2>
      </header>
      <div className="ui-panel-body">
        <form onSubmit={handleSubmit} className="report-submit-form">
          <div className="form-field">
            <label className="form-label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              className="ui-input"
              type="password"
              value={password}
              minLength={4}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="ui-button ui-button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </section>
  );
}
