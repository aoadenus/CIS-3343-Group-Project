import React from 'react';
import { Button } from './ui/button';
import { getSupabaseConfigSummary } from '../lib/supabaseClient';

export const DevOriginBanner: React.FC = () => {
  const cfg = getSupabaseConfigSummary();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'unknown';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(origin);
      // best-effort visual feedback: small alert
      // in dev this is fine; production never shows this component
      // eslint-disable-next-line no-alert
      alert(`Copied origin: ${origin}`);
    } catch (e) {
      // fallback
      // eslint-disable-next-line no-alert
      alert(`Origin: ${origin}`);
    }
  };

  return (
    <div style={{ background: '#FFF7ED', padding: 10, border: '1px solid #FCD34D', borderRadius: 6, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 13, color: '#92400E' }}>
          Dev origin: <strong>{origin}</strong>
          <div style={{ fontSize: 12, color: '#92400E', marginTop: 4 }}>
            Supabase URL: {cfg.url ? cfg.url.replace(/^https?:\/\//, '') : 'not-set'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={copy} size="sm">Copy origin</Button>
        </div>
      </div>
    </div>
  );
};

export default DevOriginBanner;
