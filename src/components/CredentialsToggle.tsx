import React, { useState } from 'react';
import { KeyRound, ChevronDown } from 'lucide-react';

const demoAccounts = [
  { role: 'Owner', email: 'emily@emilybakes.com', password: 'DemoPass123!' },
  { role: 'Manager', email: 'manager@emilybakes.com', password: 'DemoPass123!' },
  { role: 'Sales', email: 'sales@emilybakes.com', password: 'DemoPass123!' },
  { role: 'Baker', email: 'baker@emilybakes.com', password: 'DemoPass123!' },
  { role: 'Decorator', email: 'decorator@emilybakes.com', password: 'DemoPass123!' },
  { role: 'Accountant', email: 'accountant@emilybakes.com', password: 'DemoPass123!' }
];

export default function CredentialsToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((v) => !v);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optionally, a toast could be shown if ToastContext is available
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between rounded-lg"
        style={{
          background: 'rgba(196, 69, 105, 0.05)',
          border: '1px solid rgba(196, 69, 105, 0.15)',
          padding: '12px 16px',
          borderRadius: 10,
          cursor: 'pointer'
        }}
        aria-expanded={isOpen}
        aria-controls="demo-credentials-panel"
      >
        <div className="flex items-center gap-3">
          <KeyRound size={16} color="#C44569" />
          <span style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>
            {isOpen ? 'Hide Demo Credentials' : 'Show Demo Credentials'}
          </span>
        </div>

        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="demo-credentials-panel"
          className="mt-3"
          style={{
            background: 'rgba(196, 69, 105, 0.15)',
            border: '2px solid rgba(196, 69, 105, 0.3)',
            borderRadius: 12,
            padding: 20,
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="space-y-3">
            {demoAccounts.map((acct) => (
              <div key={acct.email} className="flex items-center gap-4">
                <div style={{ width: 110, textAlign: 'right' }}>
                  <span style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
                    {acct.role}
                  </span>
                </div>

                <button
                  onClick={() => copyToClipboard(acct.email)}
                  className="flex-1 text-left"
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: '6px 10px',
                    borderRadius: 6,
                    fontFamily: 'Courier New, monospace',
                    fontSize: 15,
                    color: '#E9E9E9',
                    border: 'none',
                    cursor: 'text'
                  }}
                >
                  {acct.email}
                </button>
              </div>
            ))}

            <div style={{ borderTop: '1px solid rgba(196,69,105,0.3)', marginTop: 16, paddingTop: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>
                  All Passwords
                </span>
              </div>

              <button
                onClick={() => copyToClipboard(demoAccounts[0].password)}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  color: '#C44569',
                  fontFamily: 'Courier New, monospace',
                  fontSize: 17,
                  fontWeight: 700,
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'text'
                }}
              >
                {demoAccounts[0].password}
              </button>

              <p style={{ marginTop: 12, textAlign: 'center', fontFamily: 'Open Sans', fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>
                Click credentials to select and copy
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
