import { useNavigate } from 'react-router-dom';

import GameButton from '../../components/ui/GameButton';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="home-page ui-panel ui-panel-animate">
      <header className="ui-panel-header">
        <h2 className="page-title ui-panel-title">Welcome</h2>
        <p>Choose where to go in the Retro Ops Console.</p>
      </header>

      <div className="ui-panel-body home-page__actions">
        <GameButton className="ui-button-primary" onClick={() => navigate('/report')}>
          Submit a Report
        </GameButton>
        <GameButton className="ui-button-secondary" onClick={() => navigate('/admin/login')}>
          Admin Login
        </GameButton>
        <GameButton className="ui-button-secondary" onClick={() => navigate('/admin')}>
          Open Dashboard
        </GameButton>
      </div>
    </section>
  );
}
