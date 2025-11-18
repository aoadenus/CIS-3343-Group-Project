import { useState } from 'react';
import { Search, X, Cake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getStatusColor, getBorderStripeStyle } from '../../utils/orderColors';

interface Order {
  id: number;
  customerName: string;
  eventDate: string;
  occasion: string;
  status: string;
  priority: string;
  totalCost: number;
  amountPaid: number;
}

interface PickupSearchSectionProps {
  orders: Order[];
  onOrderClick?: (orderId: number) => void;
}

export function PickupSearchSection({ orders, onOrderClick }: PickupSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    const results = orders.filter(order => 
      order.customerName.toLowerCase().includes(query) ||
      order.id.toString().includes(query) ||
      order.occasion.toLowerCase().includes(query)
    );
    setSearchResults(results);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };


  return (
    <div style={{
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto 24px',
      background: '#FFFFFF',
      border: '2px solid #C44569',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 16px rgba(196, 69, 105, 0.12)'
    }}>
      {/* Search Header */}
      <div style={{
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '24px',
          fontWeight: 700,
          color: '#2B2B2B',
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span role="img" aria-label="search" style={{ fontSize: '20px' }}>🔍</span>
          Quick Pickup Search
        </h3>
        <p style={{
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '14px',
          color: '#5A3825'
        }}>
          Find customer orders for today's pickups
        </p>
      </div>

      {/* Search Input */}
      <div style={{ 
        display: 'flex', 
        gap: '12px',
        marginBottom: isSearching ? '20px' : '0'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search 
            size={20} 
            color="#6B7280"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by last name (e.g., Chen)..."
            style={{
              width: '100%',
              height: '52px',
              paddingLeft: '48px',
              paddingRight: searchQuery ? '48px' : '16px',
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '15px',
              color: '#2B2B2B',
              background: '#FFFFFF',
              border: '2px solid #E5E7EB',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 200ms ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '2px solid #C44569';
              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(196, 69, 105, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '2px solid #E5E7EB';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Clear search"
            >
              <X size={18} color="#6B7280" />
            </button>
          )}
        </div>
        
        <button
          onClick={handleSearch}
          disabled={!searchQuery.trim()}
          style={{
            width: '120px',
            height: '52px',
            background: searchQuery.trim() 
              ? 'linear-gradient(135deg, #C44569 0%, #D4567A 100%)'
              : '#E5E7EB',
            color: searchQuery.trim() ? '#FFFFFF' : '#9CA3AF',
            border: 'none',
            borderRadius: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            cursor: searchQuery.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={(e) => {
            if (searchQuery.trim()) {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Search
        </button>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            {searchResults.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px',
                marginTop: '20px'
              }}>
                {searchResults.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'relative',
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 200ms ease'
                    }}
                    onClick={() => onOrderClick?.(order.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#C44569';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Priority Stripe */}
                    <div style={getBorderStripeStyle(order.status, order.priority)} />

                    {/* Order Info */}
                    <div style={{ marginLeft: '8px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#2B2B2B',
                          margin: 0
                        }}>
                          {order.customerName}
                        </h3>
                        <span style={{
                          fontFamily: 'Open Sans, sans-serif',
                          fontSize: '12px',
                          color: '#6B7280',
                          background: '#F3F4F6',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          #{order.id}
                        </span>
                      </div>

                      <p style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '13px',
                        color: '#6B7280',
                        margin: '0 0 8px 0'
                      }}>
                        {order.occasion}
                      </p>

                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: getStatusColor(order.status),
                          background: `${getStatusColor(order.status)}15`,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          textTransform: 'uppercase'
                        }}>
                          {order.status}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '8px',
                        borderTop: '1px solid #E5E7EB'
                      }}>
                        <span style={{
                          fontFamily: 'Open Sans, sans-serif',
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          Pickup: {new Date(order.eventDate).toLocaleDateString()}
                        </span>
                        <span style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#2B2B2B'
                        }}>
                          ${order.totalCost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                background: '#FAFBFC',
                border: '2px dashed #E5E7EB',
                borderRadius: '12px',
                marginTop: '20px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(196, 69, 105, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Search size={36} color="#C44569" />
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    padding: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <Cake size={20} color="#5A3825" />
                  </div>
                </div>

                <h3 style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#2B2B2B',
                  margin: '0 0 8px 0'
                }}>
                  No orders found for "{searchQuery}"
                </h3>
                <p style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: 0
                }}>
                  Try searching with a different name or order number
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
