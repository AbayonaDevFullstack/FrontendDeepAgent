import React from 'react';
import styles from './Logo.module.scss';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 }
  };

  const { width, height } = dimensions[size];

  return (
    <div className={`${styles.logo} ${styles[size]} ${className}`}>
      {variant === 'full' ? (
        <div className={styles.fullLogo}>
          <div className={styles.iconContainer}>
            <svg
              width={width}
              height={height}
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.logoIcon}
            >
              {/* Brain/Neural Network Icon */}
              <circle cx="32" cy="32" r="28" className={styles.outerCircle} />
              <circle cx="32" cy="32" r="20" className={styles.innerCircle} />
              
              {/* Neural connections */}
              <g className={styles.connections}>
                <line x1="20" y1="20" x2="44" y2="44" />
                <line x1="44" y1="20" x2="20" y2="44" />
                <line x1="32" y1="12" x2="32" y2="52" />
                <line x1="12" y1="32" x2="52" y2="32" />
                <circle cx="20" cy="20" r="2" />
                <circle cx="44" cy="20" r="2" />
                <circle cx="20" cy="44" r="2" />
                <circle cx="44" cy="44" r="2" />
                <circle cx="32" cy="12" r="2" />
                <circle cx="32" cy="52" r="2" />
                <circle cx="12" cy="32" r="2" />
                <circle cx="52" cy="32" r="2" />
              </g>
            </svg>
          </div>
          <span className={styles.logoText}>Deep Agents</span>
        </div>
      ) : (
        <svg
          width={width}
          height={height}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.logoIcon}
        >
          {/* Brain/Neural Network Icon */}
          <circle cx="32" cy="32" r="28" className={styles.outerCircle} />
          <circle cx="32" cy="32" r="20" className={styles.innerCircle} />
          
          {/* Neural connections */}
          <g className={styles.connections}>
            <line x1="20" y1="20" x2="44" y2="44" />
            <line x1="44" y1="20" x2="20" y2="44" />
            <line x1="32" y1="12" x2="32" y2="52" />
            <line x1="12" y1="32" x2="52" y2="32" />
            <circle cx="20" cy="20" r="2" />
            <circle cx="44" cy="20" r="2" />
            <circle cx="20" cy="44" r="2" />
            <circle cx="44" cy="44" r="2" />
            <circle cx="32" cy="12" r="2" />
            <circle cx="32" cy="52" r="2" />
            <circle cx="12" cy="32" r="2" />
            <circle cx="52" cy="32" r="2" />
          </g>
        </svg>
      )}
    </div>
  );
};