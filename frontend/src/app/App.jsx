import React from 'react';

import AppRouter from './router';
import HomeNavBar from '../features/home/HomeNavBar';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Game Feedback System // Retro Ops Console</h1>
        <HomeNavBar />
      </header>

      <main className="app-content">
        <AppRouter />
      </main>
    </div>
  );
}
