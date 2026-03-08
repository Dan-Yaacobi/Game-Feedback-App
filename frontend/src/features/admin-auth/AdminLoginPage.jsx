import { useState } from 'react';

import TextInput from '../../components/form/TextInput';
import GameButton from '../../components/ui/GameButton';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="admin-login-page ui-panel ui-panel-animate">
      <header className="ui-panel-header">
        <h2 className="page-title ui-panel-title">Admin Login</h2>
        <p>Authenticate to access moderation tools.</p>
      </header>

      <div className="ui-panel-body">
        <form className="admin-login-page__form" onSubmit={handleSubmit}>
          <TextInput
            id="admin-email"
            label="Email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="admin@example.com"
          />

          <TextInput
            id="admin-password"
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <div className="admin-login-page__actions">
            <GameButton type="submit" className="ui-button-primary">
              Sign In
            </GameButton>
          </div>
        </form>
      </div>
    </section>
  );
}
