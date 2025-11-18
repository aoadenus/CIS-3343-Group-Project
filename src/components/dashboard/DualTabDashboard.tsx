import React, { useState } from 'react';
import { ChefHat, ShoppingCart } from 'lucide-react';

interface DualTabDashboardProps {
  tab1Title: string;
  tab1Icon?: React.ReactNode;
  tab1Content: React.ReactNode;
  tab2Title: string;
  tab2Icon?: React.ReactNode;
  tab2Content: React.ReactNode;
  defaultTab?: 'tab1' | 'tab2';
  role: 'baker' | 'decorator';
}

export function DualTabDashboard({
  tab1Title,
  tab1Icon,
  tab1Content,
  tab2Title,
  tab2Icon,
  tab2Content,
  defaultTab = 'tab1',
  role
}: DualTabDashboardProps) {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>(defaultTab);

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#F9FAFB' }}>
      {/* Tab Navigation */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '2px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          gap: '8px',
          padding: '0 24px'
        }}>
          {/* Tab 1 */}
          <button
            onClick={() => setActiveTab('tab1')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'tab1' ? '3px solid #C44569' : '3px solid transparent',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '15px',
              fontWeight: activeTab === 'tab1' ? 700 : 500,
              color: activeTab === 'tab1' ? '#C44569' : '#6B7280',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'tab1') {
                e.currentTarget.style.color = '#2B2B2B';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'tab1') {
                e.currentTarget.style.color = '#6B7280';
              }
            }}
          >
            {tab1Icon || <ChefHat size={20} />}
            {tab1Title}
          </button>

          {/* Tab 2 */}
          <button
            onClick={() => setActiveTab('tab2')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'tab2' ? '3px solid #C44569' : '3px solid transparent',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '15px',
              fontWeight: activeTab === 'tab2' ? 700 : 500,
              color: activeTab === 'tab2' ? '#C44569' : '#6B7280',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'tab2') {
                e.currentTarget.style.color = '#2B2B2B';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'tab2') {
                e.currentTarget.style.color = '#6B7280';
              }
            }}
          >
            {tab2Icon || <ShoppingCart size={20} />}
            {tab2Title}
            <span style={{
              padding: '2px 8px',
              background: activeTab === 'tab2' ? 'rgba(196, 69, 105, 0.1)' : '#F3F4F6',
              color: activeTab === 'tab2' ? '#C44569' : '#6B7280',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Cross-Training
            </span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
        animation: 'fadeIn 0.3s ease-in-out'
      }}>
        {activeTab === 'tab1' ? tab1Content : tab2Content}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
