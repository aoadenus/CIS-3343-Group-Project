import React, { useState } from 'react';
import { KeyRound, ChevronDown, Copy, Check } from 'lucide-react';

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
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const toggle = () => setIsOpen((v) => !v);

  const copyToClipboard = async (text: string, type: 'email' | 'password', email?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'email' && email) {
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
      } else if (type === 'password') {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      }
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
          cursor: 'pointer',
          transition: 'all 150ms ease'
        }}
        aria-expanded={isOpen}
        aria-controls="demo-credentials-panel"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(196, 69, 105, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(196, 69, 105, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(196, 69, 105, 0.05)';
          e.currentTarget.style.borderColor = 'rgba(196, 69, 105, 0.15)';
        }}
      >
        <div className="flex items-center gap-3">
          <KeyRound size={16} color="#C44569" />
          <span style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>
            {isOpen ? 'Hide Demo Credentials' : 'Show Demo Credentials'}
          </span>
        </div>

        <ChevronDown 
          size={16} 
          color="#5A3825"
          style={{ 
            transition: 'transform 300ms ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }} 
        />
      </button>

      {isOpen && (
        <div
          id="demo-credentials-panel"
          className="mt-3"
          style={{
            background: 'rgba(196, 69, 105, 0.08)',
            border: '2px solid rgba(196, 69, 105, 0.2)',
            borderRadius: 12,
            padding: 20,
            backdropFilter: 'blur(10px)',
            animation: 'expandIn 300ms ease-out'
          }}
        >
          <div className="space-y-3">
            {demoAccounts.map((acct) => (
              <div key={acct.email} className="flex items-center gap-2">
                <div style={{ width: 110, textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 700, color: '#2B2B2B' }}>
                    {acct.role}
                  </span>
                </div>

                <div
                  onClick={(e) => {
                    const range = document.createRange();
                    range.selectNodeContents(e.currentTarget);
                    const sel = window.getSelection();
                    sel?.removeAllRanges();
                    sel?.addRange(range);
                  }}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.2)',
                    padding: '6px 10px',
                    borderRadius: 6,
                    fontFamily: 'Courier New, monospace',
                    fontSize: 15,
                    color: '#E9E9E9',
                    border: 'none',
                    cursor: 'text',
                    userSelect: 'all',
                    transition: 'background 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                  }}
                >
                  {acct.email}
                </div>

                <button
                  onClick={() => copyToClipboard(acct.email, 'email', acct.email)}
                  style={{
                    background: copiedEmail === acct.email ? 'rgba(34, 197, 94, 0.2)' : 'rgba(196, 69, 105, 0.2)',
                    border: '1px solid ' + (copiedEmail === acct.email ? 'rgba(34, 197, 94, 0.4)' : 'rgba(196, 69, 105, 0.4)'),
                    borderRadius: 6,
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 200ms ease'
                  }}
                  title="Copy email"
                >
                  {copiedEmail === acct.email ? (
                    <Check size={16} color="#22c55e" />
                  ) : (
                    <Copy size={16} color="#C44569" />
                  )}
                </button>
              </div>
            ))}

            <div style={{ borderTop: '1px solid rgba(196,69,105,0.3)', marginTop: 16, paddingTop: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 600, color: '#2B2B2B' }}>
                  All Passwords
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  onClick={(e) => {
                    const range = document.createRange();
                    range.selectNodeContents(e.currentTarget);
                    const sel = window.getSelection();
                    sel?.removeAllRanges();
                    sel?.addRange(range);
                  }}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.3)',
                    color: '#C44569',
                    fontFamily: 'Courier New, monospace',
                    fontSize: 17,
                    fontWeight: 700,
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'text',
                    userSelect: 'all',
                    textAlign: 'center',
                    letterSpacing: '1px',
                    display: 'inline-block'
                  }}
                >
                  {demoAccounts[0].password}
                </div>

                <button
                  onClick={() => copyToClipboard(demoAccounts[0].password, 'password')}
                  style={{
                    background: copiedPassword ? 'rgba(34, 197, 94, 0.2)' : 'rgba(196, 69, 105, 0.2)',
                    border: '1px solid ' + (copiedPassword ? 'rgba(34, 197, 94, 0.4)' : 'rgba(196, 69, 105, 0.4)'),
                    borderRadius: 8,
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 200ms ease'
                  }}
                  title="Copy password"
                >
                  {copiedPassword ? (
                    <Check size={18} color="#22c55e" />
                  ) : (
                    <Copy size={18} color="#C44569" />
                  )}
                </button>
              </div>

              <p style={{ marginTop: 12, textAlign: 'center', fontFamily: 'Open Sans', fontSize: 12, fontStyle: 'italic', color: 'rgba(43,43,43,0.5)' }}>
                Click credentials to select and copy
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
