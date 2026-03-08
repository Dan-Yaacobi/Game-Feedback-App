import { NavLink } from 'react-router-dom';

export default function HomeNavBar() {
  return (
    <nav aria-label="Main navigation" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
      <NavLink className="ui-button ui-button-secondary" to="/report">
        Submit Report
      </NavLink>
      <NavLink className="ui-button ui-button-secondary" to="/admin">
        Admin
      </NavLink>
    </nav>
  );
}
