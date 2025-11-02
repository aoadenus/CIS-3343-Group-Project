import { ReactNode, CSSProperties } from 'react';

/**
 * PageContainer Component
 * Ensures consistent spacing, alignment, and centering across all pages
 * 
 * Features:
 * - Consistent max-width and centering
 * - Responsive padding (24px desktop, 16px tablet, 12px mobile)
 * - Proper vertical spacing
 * - Grid alignment
 * - Bottom margin (64px minimum)
 */

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: string;
  padding?: boolean;
  bottomMargin?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'section' | 'main' | 'article';
  centered?: boolean;
}

export function PageContainer({
  children,
  maxWidth = '1440px',
  padding = true,
  bottomMargin = true,
  className = '',
  style = {},
  as: Component = 'div',
  centered = true
}: PageContainerProps) {
  return (
    <Component
      className={className}
      style={{
        width: '100%',
        maxWidth: maxWidth,
        margin: centered ? '0 auto' : '0',
        padding: padding ? 'clamp(12px, 3vw, 24px)' : '0',
        marginBottom: bottomMargin ? 'clamp(64px, 8vh, 96px)' : '0',
        ...style
      }}
    >
      {children}
    </Component>
  );
}

/**
 * SectionContainer Component
 * For individual sections within a page
 */

interface SectionContainerProps {
  children: ReactNode;
  spacing?: 'tight' | 'normal' | 'relaxed';
  centered?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function SectionContainer({
  children,
  spacing = 'normal',
  centered = true,
  className = '',
  style = {}
}: SectionContainerProps) {
  const spacingMap = {
    tight: 'clamp(32px, 4vh, 48px)',
    normal: 'clamp(48px, 6vh, 72px)',
    relaxed: 'clamp(72px, 10vh, 120px)'
  };

  return (
    <section
      className={className}
      style={{
        width: '100%',
        marginBottom: spacingMap[spacing],
        textAlign: centered ? 'center' : 'left',
        ...style
      }}
    >
      {children}
    </section>
  );
}

/**
 * ContentWrapper Component
 * For text content with optimal line width
 */

interface ContentWrapperProps {
  children: ReactNode;
  maxWidth?: string;
  centered?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ContentWrapper({
  children,
  maxWidth = '700px',
  centered = true,
  className = '',
  style = {}
}: ContentWrapperProps) {
  return (
    <div
      className={className}
      style={{
        maxWidth: maxWidth,
        margin: centered ? '0 auto' : '0',
        width: '100%',
        ...style
      }}
    >
      {children}
    </div>
  );
}

/**
 * HeadingContainer Component
 * Ensures proper spacing and alignment for headings
 */

interface HeadingContainerProps {
  children: ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  marginTop?: string;
  marginBottom?: string;
  centered?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function HeadingContainer({
  children,
  level,
  marginTop,
  marginBottom,
  centered = false,
  className = '',
  style = {}
}: HeadingContainerProps) {
  // Default spacing based on heading level
  const defaultSpacing = {
    1: { top: '32px', bottom: '24px' },
    2: { top: '28px', bottom: '20px' },
    3: { top: '24px', bottom: '16px' },
    4: { top: '20px', bottom: '12px' },
    5: { top: '16px', bottom: '12px' },
    6: { top: '16px', bottom: '12px' }
  };

  const spacing = defaultSpacing[level];
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={className}
      style={{
        marginTop: marginTop || spacing.top,
        marginBottom: marginBottom || spacing.bottom,
        textAlign: centered ? 'center' : 'left',
        lineHeight: level <= 2 ? '1.3' : '1.4',
        ...style
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * GridContainer Component
 * 12-column responsive grid system
 */

interface GridContainerProps {
  children: ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
  style?: CSSProperties;
}

export function GridContainer({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'clamp(16px, 3vw, 32px)',
  className = '',
  style = {}
}: GridContainerProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.mobile}, 1fr)`,
        gap: gap,
        width: '100%',
        ...style
      }}
    >
      {children}

      {/* Responsive breakpoints */}
      <style>{`
        @media (min-width: 768px) {
          .${className.split(' ')[0]} {
            grid-template-columns: repeat(${columns.tablet}, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .${className.split(' ')[0]} {
            grid-template-columns: repeat(${columns.desktop}, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * CardGrid Component
 * For consistent card layouts
 */

interface CardGridProps {
  children: ReactNode;
  minCardWidth?: string;
  gap?: string;
  className?: string;
  style?: CSSProperties;
}

export function CardGrid({
  children,
  minCardWidth = '300px',
  gap = 'clamp(16px, 3vw, 32px)',
  className = '',
  style = {}
}: CardGridProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minCardWidth}, 100%), 1fr))`,
        gap: gap,
        width: '100%',
        ...style
      }}
    >
      {children}
    </div>
  );
}

/**
 * StackContainer Component
 * Vertical stack with consistent spacing
 */

interface StackContainerProps {
  children: ReactNode;
  spacing?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
  style?: CSSProperties;
}

export function StackContainer({
  children,
  spacing = 'clamp(16px, 3vw, 24px)',
  align = 'stretch',
  className = '',
  style = {}
}: StackContainerProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing,
        alignItems: align,
        width: '100%',
        ...style
      }}
    >
      {children}
    </div>
  );
}
