import { ReactNode, CSSProperties } from 'react';

/**
 * Typography Components
 * Consistent text styling with proper spacing and line heights
 * 
 * Design Tokens:
 * - H1-H6: Automatic spacing (32px top, 24px bottom for H1)
 * - Body: 1.6 line-height, max-width 700px
 * - Headings: 1.3 line-height
 * - Responsive font sizes using clamp()
 */

interface TypographyProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  centered?: boolean;
}

export function H1({ children, className = '', style = {}, centered = false }: TypographyProps) {
  return (
    <h1
      className={className}
      style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 'clamp(32px, 5vw, 48px)',
        fontWeight: 700,
        color: '#2B2B2B',
        marginTop: '32px',
        marginBottom: '24px',
        lineHeight: 1.3,
        textAlign: centered ? 'center' : 'left',
        ...style
      }}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = '', style = {}, centered = false }: TypographyProps) {
  return (
    <h2
      className={className}
      style={{
        fontFamily: 'Poppins, sans-serif',
        fontSize: 'clamp(24px, 4vw, 36px)',
        fontWeight: 600,
        color: '#2B2B2B',
        marginTop: '28px',
        marginBottom: '20px',
        lineHeight: 1.3,
        textAlign: centered ? 'center' : 'left',
        ...style
      }}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className = '', style = {}, centered = false }: TypographyProps) {
  return (
    <h3
      className={className}
      style={{
        fontFamily: 'Poppins, sans-serif',
        fontSize: 'clamp(20px, 3vw, 28px)',
        fontWeight: 600,
        color: '#2B2B2B',
        marginTop: '24px',
        marginBottom: '16px',
        lineHeight: 1.3,
        textAlign: centered ? 'center' : 'left',
        ...style
      }}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className = '', style = {}, centered = false }: TypographyProps) {
  return (
    <h4
      className={className}
      style={{
        fontFamily: 'Poppins, sans-serif',
        fontSize: 'clamp(18px, 2.5vw, 24px)',
        fontWeight: 600,
        color: '#2B2B2B',
        marginTop: '20px',
        marginBottom: '12px',
        lineHeight: 1.4,
        textAlign: centered ? 'center' : 'left',
        ...style
      }}
    >
      {children}
    </h4>
  );
}

export function Body({ children, className = '', style = {}, centered = false }: TypographyProps) {
  return (
    <p
      className={className}
      style={{
        fontFamily: 'Open Sans, sans-serif',
        fontSize: 'clamp(16px, 2vw, 18px)',
        color: '#5A3825',
        lineHeight: 1.6,
        marginBottom: '16px',
        maxWidth: '700px',
        margin: centered ? '0 auto 16px' : '0 0 16px',
        textAlign: centered ? 'center' : 'left',
        ...style
      }}
    >
      {children}
    </p>
  );
}

export function BodyLarge({ children, className = '', style = {}, centered = false }: TypographyProps) {
  return (
    <p
      className={className}
      style={{
        fontFamily: 'Open Sans, sans-serif',
        fontSize: 'clamp(18px, 2.5vw, 22px)',
        color: '#5A3825',
        lineHeight: 1.6,
        marginBottom: '20px',
        maxWidth: '700px',
        margin: centered ? '0 auto 20px' : '0 0 20px',
        textAlign: centered ? 'center' : 'left',
        ...style
      }}
    >
      {children}
    </p>
  );
}

export function BodySmall({ children, className = '', style = {}, centered = false }: TypographyProps) {
  return (
    <p
      className={className}
      style={{
        fontFamily: 'Open Sans, sans-serif',
        fontSize: 'clamp(14px, 1.5vw, 16px)',
        color: '#5A3825',
        lineHeight: 1.6,
        marginBottom: '12px',
        maxWidth: '700px',
        margin: centered ? '0 auto 12px' : '0 0 12px',
        textAlign: centered ? 'center' : 'left',
        ...style
      }}
    >
      {children}
    </p>
  );
}

export function Tagline({ children, className = '', style = {}, centered = false }: TypographyProps) {
  return (
    <p
      className={className}
      style={{
        fontFamily: 'Lucida Handwriting, cursive',
        fontSize: 'clamp(18px, 2.5vw, 24px)',
        fontStyle: 'italic',
        color: '#C44569',
        marginBottom: '16px',
        textAlign: centered ? 'center' : 'left',
        ...style
      }}
    >
      {children}
    </p>
  );
}

interface ListProps {
  children: ReactNode;
  ordered?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function List({ children, ordered = false, className = '', style = {} }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul';
  
  return (
    <Tag
      className={className}
      style={{
        fontFamily: 'Open Sans, sans-serif',
        fontSize: 'clamp(16px, 2vw, 18px)',
        color: '#5A3825',
        lineHeight: 1.6,
        maxWidth: '700px',
        marginBottom: '16px',
        paddingLeft: '24px',
        ...style
      }}
    >
      {children}
    </Tag>
  );
}

export function ListItem({ children, className = '', style = {} }: TypographyProps) {
  return (
    <li
      className={className}
      style={{
        marginBottom: '8px',
        ...style
      }}
    >
      {children}
    </li>
  );
}

/**
 * Responsive Text Component
 * Automatically adjusts for mobile screens
 */

interface ResponsiveTextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  className?: string;
  style?: CSSProperties;
  centered?: boolean;
}

export function ResponsiveText({
  children,
  as = 'p',
  className = '',
  style = {},
  centered = false
}: ResponsiveTextProps) {
  const Tag = as;
  
  const baseStyles: Record<string, CSSProperties> = {
    h1: {
      fontFamily: 'Playfair Display, serif',
      fontSize: 'clamp(28px, 6vw, 48px)',
      fontWeight: 700,
      lineHeight: 1.3
    },
    h2: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 'clamp(24px, 5vw, 36px)',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 'clamp(20px, 4vw, 28px)',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 'clamp(18px, 3vw, 24px)',
      fontWeight: 600,
      lineHeight: 1.4
    },
    p: {
      fontFamily: 'Open Sans, sans-serif',
      fontSize: 'clamp(16px, 2vw, 18px)',
      lineHeight: 1.6
    }
  };

  return (
    <Tag
      className={className}
      style={{
        ...baseStyles[as],
        textAlign: centered ? 'center' : 'left',
        color: as === 'p' ? '#5A3825' : '#2B2B2B',
        ...style
      }}
    >
      {children}
    </Tag>
  );
}
