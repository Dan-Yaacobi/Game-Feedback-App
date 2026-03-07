import AppRouter from './router';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Game Feedback System</h1>
      </header>

      <main className="app-content">
        <AppRouter />
      </main>
    </div>
  );
}
