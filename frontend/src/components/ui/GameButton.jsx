import React from 'react';

export default function GameButton({ className = '', type = 'button', ...props }) {
  const combinedClassName = ['ui-button', className].filter(Boolean).join(' ');

  return <button type={type} className={combinedClassName} {...props} />;
}
