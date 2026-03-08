import React from 'react';

import AppRouter from './router';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Game Feedback System // Retro Ops Console</h1>
      </header>

      <main className="app-content" role="main">
        <AppRouter />
      </main>
    </div>
  );
}
