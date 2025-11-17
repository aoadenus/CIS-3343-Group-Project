import { useState } from 'react';
import { KeyRound, ChevronDown, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from './ToastContext';

export function CredentialsToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(label);
      showToast('success', `${label} copied to clipboard!`, 'Copied');
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      showToast('error', 'Failed to copy. Please select and copy manually.', 'Copy Failed');
    }
  };

  const credentials = [
    { role: 'Owner', email: 'emily@emilybakes.com' },
    { role: 'Manager', email: 'manager@emilybakes.com' },
    { role: 'Sales', email: 'sales@emilybakes.com' },
    { role: 'Baker', email: 'baker@emilybakes.com' },
    { role: 'Decorator', email: 'decorator@emilybakes.com' },
    { role: 'Accountant', email: 'accountant@emilybakes.com' }
  ];

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
        style={{
          height: '48px',
          background: isOpen ? 'rgba(196, 69, 105, 0.08)' : 'rgba(196, 69, 105, 0.05)',
          border: `1px solid ${isOpen ? 'rgba(196, 69, 105, 0.25)' : 'rgba(196, 69, 105, 0.15)'}`,
          borderRadius: '10px',
          padding: '12px 16px',
          cursor: 'pointer',
          transition: 'all 150ms ease'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(196, 69, 105, 0.08)';
            e.currentTarget.style.border = '1px solid rgba(196, 69, 105, 0.25)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(196, 69, 105, 0.05)';
            e.currentTarget.style.border = '1px solid rgba(196, 69, 105, 0.15)';
          }
        }}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Hide demo credentials" : "Show demo credentials"}
      >
        <div className="flex items-center gap-3">
          <KeyRound size={16} color="#C44569" />
          <span style={{
            fontFamily: 'Poppins',
            fontSize: '14px',
            fontWeight: 600,
            color: '#2B2B2B'
          }}>
            {isOpen ? 'Hide Demo Credentials' : 'Show Demo Credentials'}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <ChevronDown size={16} color="#5A3825" />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div 
              className="rounded-lg mt-3"
              style={{ 
                background: 'rgba(196, 69, 105, 0.08)',
                border: '2px solid rgba(196, 69, 105, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '20px'
              }}
            >
              <div className="space-y-3">
                {credentials.map((cred) => (
                  <div 
                    key={cred.role}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
                  >
                    <span style={{ 
                      color: '#2B2B2B',
                      fontSize: '15px', 
                      fontWeight: 700,
                      minWidth: '110px',
                      fontFamily: 'Poppins'
                    }}>
                      {cred.role}:
                    </span>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1
                    }}>
                      <code 
                        style={{ 
                          color: '#E9E9E9',
                          fontSize: '15px', 
                          fontFamily: 'Courier New, monospace',
                          background: 'rgba(0, 0, 0, 0.2)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          userSelect: 'all',
                          flex: 1
                        }}
                      >
                        {cred.email}
                      </code>
                      <button
                        onClick={() => handleCopy(cred.email, cred.role)}
                        style={{
                          background: copiedItem === cred.role ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 150ms ease'
                        }}
                        title={copiedItem === cred.role ? 'Copied!' : 'Copy to clipboard'}
                        aria-label={`Copy ${cred.role} email`}
                      >
                        {copiedItem === cred.role ? (
                          <Check size={14} color="#FFFFFF" />
                        ) : (
                          <Copy size={14} color="#E9E9E9" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div 
                className="mt-4 pt-4 border-t text-center"
                style={{ borderColor: 'rgba(196, 69, 105, 0.3)' }}
              >
                <p style={{ 
                  color: '#2B2B2B',
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontFamily: 'Poppins'
                }}>
                  All Passwords:
                </p>
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <code style={{ 
                    color: '#C44569', 
                    fontSize: '17px',
                    fontWeight: 700,
                    fontFamily: 'Courier New, monospace',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    userSelect: 'all',
                    letterSpacing: '1px'
                  }}>
                    DemoPass123!
                  </code>
                  <button
                    onClick={() => handleCopy('DemoPass123!', 'Password')}
                    style={{
                      background: copiedItem === 'Password' ? '#10B981' : 'rgba(196, 69, 105, 0.15)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 150ms ease'
                    }}
                    title={copiedItem === 'Password' ? 'Copied!' : 'Copy password'}
                    aria-label="Copy password to clipboard"
                  >
                    {copiedItem === 'Password' ? (
                      <Check size={16} color="#FFFFFF" />
                    ) : (
                      <Copy size={16} color="#C44569" />
                    )}
                  </button>
                </div>
              </div>

              <p 
                className="text-center mt-3" 
                style={{ 
                  color: 'rgba(43, 43, 43, 0.5)',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  fontFamily: 'Open Sans'
                }}
              >
                Click copy buttons or select text to copy credentials
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
