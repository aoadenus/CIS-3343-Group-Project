import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StandardButton } from '../components/StandardButton';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * 404 Not Found Page
 * Maintains brand consistency with playful copy
 */

export default function NotFound() {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F8EBD7',
    padding: '24px'
  };

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    maxWidth: '600px'
  };

  const emojiStyle: React.CSSProperties = {
    fontSize: '120px',
    marginBottom: '24px',
    lineHeight: 1
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: 'clamp(32px, 6vw, 48px)',
    fontWeight: 700,
    color: '#2B2B2B',
    marginBottom: '16px'
  };

  const subheadingStyle: React.CSSProperties = {
    fontFamily: 'Lucida Handwriting, cursive',
    fontSize: 'clamp(18px, 4vw, 24px)',
    color: '#C44569',
    marginBottom: '24px'
  };

  const descriptionStyle: React.CSSProperties = {
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '18px',
    color: '#5A3825',
    lineHeight: 1.6,
    marginBottom: '40px'
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* Cake Emoji */}
        <div style={emojiStyle} role="img" aria-label="Cake slice">
          🍰
        </div>

        {/* Error Code */}
        <h1 style={headingStyle}>404</h1>

        {/* Playful Message */}
        <h2 style={subheadingStyle}>
          This page got eaten!
        </h2>

        {/* Description */}
        <p style={descriptionStyle}>
          We looked everywhere, but this page seems to have disappeared. 
          Maybe it was too delicious? Let's get you back to something sweet.
        </p>

        {/* CTAs */}
        <div style={buttonGroupStyle}>
          <StandardButton
            variant="primary"
            size="lg"
            icon={<Home size={20} />}
            onClick={() => navigate('/')}
          >
            Back to Home
          </StandardButton>

          <StandardButton
            variant="secondary"
            size="lg"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </StandardButton>
        </div>

        {/* Decorative Elements */}
        <div style={{
          marginTop: '64px',
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          opacity: 0.6
        }}>
          <span style={{ fontSize: '32px' }} role="img" aria-label="Cupcake">🧁</span>
          <span style={{ fontSize: '32px' }} role="img" aria-label="Cookie">🍪</span>
          <span style={{ fontSize: '32px' }} role="img" aria-label="Donut">🍩</span>
        </div>
      </div>
    </div>
  );
}
