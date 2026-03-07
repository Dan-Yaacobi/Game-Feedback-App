import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

function HomePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', margin: '2rem' }}>
      <h1>Game Feedback App</h1>
      <p>Frontend loaded successfully.</p>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
]);
