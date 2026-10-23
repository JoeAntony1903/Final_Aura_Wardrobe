import React from 'react';

interface StarCalendarIconProps {
  className?: string;
  size?: number;
  variant?: 'star' | 'party' | 'work' | 'gala' | 'casual';
  color?: string;
  style?: React.CSSProperties;
}

export const StarCalendarIcon: React.FC<StarCalendarIconProps> = ({
  className = 'w-6 h-6',
  size = 24,
  variant = 'star',
  color,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color: color || undefined, ...style }}
    >
      {/* Outer rounded calendar outline */}
      <rect
        x="48"
        y="80"
        width="416"
        height="384"
        rx="56"
        stroke="currentColor"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top Header Divider Line */}
      <line
        x1="48"
        y1="170"
        x2="464"
        y2="170"
        stroke="currentColor"
        strokeWidth="32"
        strokeLinecap="round"
      />
      {/* Left Binder Loop */}
      <line
        x1="140"
        y1="40"
        x2="140"
        y2="120"
        stroke="currentColor"
        strokeWidth="32"
        strokeLinecap="round"
      />
      {/* Right Binder Loop */}
      <line
        x1="372"
        y1="40"
        x2="372"
        y2="120"
        stroke="currentColor"
        strokeWidth="32"
        strokeLinecap="round"
      />

      {/* Center Icon Symbol */}
      {variant === 'star' && (
        <path
          d="M256 215L285 274L350 283.5L303 329.5L314 394L256 363.5L198 394L209 329.5L162 283.5L227 274L256 215Z"
          stroke="currentColor"
          strokeWidth="30"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {variant === 'work' && (
        <rect
          x="190"
          y="250"
          width="132"
          height="110"
          rx="18"
          stroke="currentColor"
          strokeWidth="28"
          strokeLinejoin="round"
        />
      )}

      {variant === 'gala' && (
        <polygon
          points="256,230 330,300 256,380 182,300"
          stroke="currentColor"
          strokeWidth="28"
          strokeLinejoin="round"
        />
      )}

      {variant === 'party' && (
        <circle
          cx="256"
          cy="310"
          r="60"
          stroke="currentColor"
          strokeWidth="28"
        />
      )}

      {variant === 'casual' && (
        <path
          d="M210 320C210 290 302 290 302 320"
          stroke="currentColor"
          strokeWidth="30"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};
