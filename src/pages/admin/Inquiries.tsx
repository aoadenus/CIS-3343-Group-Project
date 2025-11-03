import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Calendar, MessageSquare, Image as ImageIcon, Check, Clock } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useInquiries } from '../../contexts/InquiriesContext';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  message: string;
  productName: string;
  inspirationImages?: string[];
  status: 'pending' | 'reviewed' | 'contacted';
  submittedAt: string;
}

export function Inquiries() {
  const { inquiries, updateInquiryStatus } = useInquiries();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'contacted'>('all');

  const filteredInquiries = statusFilter === 'all' 
    ? inquiries 
    : inquiries.filter(i => i.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'reviewed': return '#3B82F6';
      case 'contacted': return '#10B981';
      default: return '#6B7280';
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#F8EBD7' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-shrink-0 mb-4"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(22px, 4vw, 32px)',
                fontWeight: 700,
                color: '#2B2B2B',
                marginBottom: '4px'
              }}
            >
              Cake Inquiries
            </h1>
            <p style={{ fontFamily: 'Open Sans, sans-serif', color: '#5A3825', fontSize: '14px' }}>
              Manage customer cake requests and inquiries
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2">
            {['all', 'pending', 'reviewed', 'contacted'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className="px-4 py-2 rounded-lg transition-all"
                style={{
                  background: statusFilter === status ? '#C44569' : 'white',
                  color: statusFilter === status ? 'white' : '#5A3825',
                  border: '1px solid #E5D5C8',
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'capitalize'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Inquiries Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredInquiries.map((inquiry, index) => (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="p-5 cursor-pointer transition-all hover:shadow-lg"
                style={{
                  background: 'white',
                  border: '1px solid #E5D5C8',
                  borderRadius: '16px'
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3
                      style={{
                        fontFamily: 'Poppins',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#2B2B2B',
                        marginBottom: '4px'
                      }}
                    >
                      {inquiry.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#5A3825' }}>
                      {inquiry.productName}
                    </p>
                  </div>
                  <Badge
                    style={{
                      background: getStatusColor(inquiry.status),
                      color: 'white',
                      fontFamily: 'Poppins',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '6px 12px',
                      textTransform: 'capitalize'
                    }}
                  >
                    {inquiry.status}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail size={16} color="#C44569" />
                    <span style={{ fontSize: '14px', color: '#5A3825' }}>{inquiry.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} color="#C44569" />
                    <span style={{ fontSize: '14px', color: '#5A3825' }}>{inquiry.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} color="#C44569" />
                    <span style={{ fontSize: '14px', color: '#5A3825' }}>
                      Event: {formatDate(inquiry.eventDate)}
                    </span>
                  </div>
                </div>

                {/* Message Preview */}
                {inquiry.message && (
                  <div className="mb-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare size={16} color="#C44569" className="flex-shrink-0 mt-0.5" />
                      <p
                        className="line-clamp-2"
                        style={{
                          fontSize: '14px',
                          color: '#5A3825',
                          lineHeight: 1.5
                        }}
                      >
                        {inquiry.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* Inspiration Images */}
                {inquiry.inspirationImages && inquiry.inspirationImages.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon size={16} color="#C44569" />
                      <span style={{ fontSize: '13px', color: '#5A3825', fontWeight: 600 }}>
                        {inquiry.inspirationImages.length} inspiration image(s)
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#E5D5C8' }}>
                  <div className="flex items-center gap-1">
                    <Clock size={14} color="#9CA3AF" />
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                      {formatDate(inquiry.submittedAt)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="px-3 py-1.5"
                      style={{
                        background: '#10B981',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 600,
                        height: 'auto',
                        borderRadius: '8px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateInquiryStatus(inquiry.id, 'contacted');
                      }}
                    >
                      <Check size={14} className="mr-1" />
                      Mark Contacted
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredInquiries.length === 0 && (
          <div className="text-center py-16">
            <Mail size={64} color="#C44569" className="mx-auto mb-4 opacity-30" />
            <p style={{ fontSize: '18px', color: '#5A3825', marginBottom: '8px', fontWeight: 600 }}>
              No inquiries found
            </p>
            <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
              {statusFilter === 'all' 
                ? 'No cake inquiries have been submitted yet.' 
                : `No ${statusFilter} inquiries at the moment.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
