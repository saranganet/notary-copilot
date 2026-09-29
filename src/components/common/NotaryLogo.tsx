import React from 'react';

interface NotaryLogoProps {
  size?: number;
  className?: string;
  showShadow?: boolean;
}

export const NotaryLogo: React.FC<NotaryLogoProps> = ({
  size = 44,
  className = '',
  showShadow = true,
}) => {
  return (
    <div
      className={`notary-logo-wrapper ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        boxShadow: showShadow ? '0 3px 8px -1px rgba(185, 28, 28, 0.35)' : 'none',
        background: '#B91C1C',
      }}
    >
      <img
        src="/notary-logo.svg"
        alt="Notary Public Logo"
        width={size}
        height={size}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
