import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, User, Calendar, Upload, X as XIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  onSubmit: (data: InquiryFormData) => void;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  message: string;
  inspirationImages?: File[];
}

export function InquiryModal({ isOpen, onClose, productName, onSubmit }: InquiryModalProps) {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    message: '',
    inspirationImages: []
  });

  const [errors, setErrors] = useState<Partial<InquiryFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: Partial<InquiryFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g., 555-123-4567)';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        message: '',
        inspirationImages: []
      });
      setErrors({});
      setImagePreviews([]);
      onClose();
    }, 800);
  };

  const handleChange = (field: keyof InquiryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = files.slice(0, 2 - (formData.inspirationImages?.length || 0));
      setFormData(prev => ({ 
        ...prev, 
        inspirationImages: [...(prev.inspirationImages || []), ...newImages] 
      }));

      newImages.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      inspirationImages: prev.inspirationImages?.filter((_, i) => i !== index) 
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0"
            style={{ 
              zIndex: 10001,
              background: 'rgba(0, 0, 0, 0.75)'
            }}
            onClick={onClose}
            aria-label="Close modal"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 10002 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl rounded-2xl overflow-hidden"
              style={{
                background: '#FFFFFF',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4)',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="relative"
                style={{
                  background: 'linear-gradient(135deg, #C44569 0%, #A03355 100%)',
                  color: 'white',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.15)',
                  padding: '24px 32px 32px 32px'
                }}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="absolute rounded-xl transition-all"
                  style={{ 
                    top: '20px',
                    right: '24px',
                    width: '48px', 
                    height: '48px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    zIndex: 20
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="Close"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {/* Content Container */}
                <div style={{ paddingRight: '60px' }}>
                  {/* Icon and Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '40px', lineHeight: 1 }}>🎂</span>
                    <h3
                      style={{
                        fontFamily: 'Playfair Display',
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        margin: 0,
                        lineHeight: 1.1,
                        textShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}
                    >
                      Cake Inquiry
                    </h3>
                  </div>
                  
                  {/* Product Name Chip */}
                  <div
                    style={{
                      display: 'inline-block',
                      background: 'rgba(255, 255, 255, 0.2)',
                      padding: '10px 20px',
                      borderRadius: '20px',
                      marginBottom: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1rem',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        margin: 0,
                        lineHeight: 1.3
                      }}
                    >
                      {productName}
                    </p>
                  </div>
                  
                  {/* Instructions */}
                  <p
                    style={{
                      fontSize: '0.95rem',
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontStyle: 'italic',
                      lineHeight: 1.5,
                      margin: 0
                    }}
                  >
                    Please fill out all required fields (*) to submit your inquiry
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 overflow-y-auto" style={{ background: '#FFFFFF', paddingTop: '32px', paddingBottom: '20px', flex: 1 }}>
                {/* Two-Column Grid for Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="inquiry-name"
                      className="block mb-1.5"
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#2B2B2B',
                        fontFamily: 'Poppins'
                      }}
                    >
                      Name *
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        size={16}
                        color="#999"
                      />
                      <Input
                        id="inquiry-name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="pl-10 h-11 rounded-lg text-sm"
                        style={{
                          background: '#F8F8F8',
                          border: errors.name ? '2px solid #C44569' : '1px solid #E0E0E0',
                          color: '#2B2B2B',
                          fontSize: '14px'
                        }}
                        aria-invalid={!!errors.name}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs" style={{ color: '#C44569' }}>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="inquiry-email"
                      className="block mb-1.5"
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#2B2B2B',
                        fontFamily: 'Poppins'
                      }}
                    >
                      Email *
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        size={16}
                        color="#999"
                      />
                      <Input
                        id="inquiry-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="pl-10 h-11 rounded-lg text-sm"
                        style={{
                          background: '#F8F8F8',
                          border: errors.email ? '2px solid #C44569' : '1px solid #E0E0E0',
                          color: '#2B2B2B',
                          fontSize: '14px'
                        }}
                        aria-invalid={!!errors.email}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs" style={{ color: '#C44569' }}>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label
                      htmlFor="inquiry-phone"
                      className="block mb-1.5"
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#2B2B2B',
                        fontFamily: 'Poppins'
                      }}
                    >
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        size={16}
                        color="#999"
                      />
                      <Input
                        id="inquiry-phone"
                        type="tel"
                        placeholder="555-123-4567"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="pl-10 h-11 rounded-lg text-sm"
                        style={{
                          background: '#F8F8F8',
                          border: errors.phone ? '2px solid #C44569' : '1px solid #E0E0E0',
                          color: '#2B2B2B',
                          fontSize: '14px'
                        }}
                        aria-invalid={!!errors.phone}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs" style={{ color: '#C44569' }}>
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Event Date Field */}
                  <div>
                    <label
                      htmlFor="inquiry-date"
                      className="block mb-1.5"
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#2B2B2B',
                        fontFamily: 'Poppins'
                      }}
                    >
                      Event Date *
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        size={16}
                        color="#999"
                      />
                      <Input
                        id="inquiry-date"
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => handleChange('eventDate', e.target.value)}
                        className="pl-10 h-11 rounded-lg text-sm"
                        style={{
                          background: '#F8F8F8',
                          border: errors.eventDate ? '2px solid #C44569' : '1px solid #E0E0E0',
                          color: '#2B2B2B',
                          fontSize: '14px'
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        aria-invalid={!!errors.eventDate}
                      />
                    </div>
                    {errors.eventDate && (
                      <p className="mt-1 text-xs" style={{ color: '#C44569' }}>
                        {errors.eventDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Full-Width Message Field */}
                <div className="mb-3">
                  <label
                    htmlFor="inquiry-message"
                    className="block mb-1.5"
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#2B2B2B',
                      fontFamily: 'Poppins'
                    }}
                  >
                    Additional Details (Optional)
                  </label>
                  <textarea
                    id="inquiry-message"
                    placeholder="Tell us about your event or special requests..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg resize-none text-sm"
                    style={{
                      fontFamily: 'Open Sans',
                      fontSize: '14px',
                      background: '#F8F8F8',
                      border: '1px solid #E0E0E0',
                      color: '#2B2B2B'
                    }}
                  />
                </div>

                {/* Compact Inspiration Images */}
                <div className="mb-3">
                  <label
                    className="block mb-1.5"
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#2B2B2B',
                      fontFamily: 'Poppins'
                    }}
                  >
                    Inspiration Images (Optional, up to 2)
                  </label>
                  
                  <div className="flex gap-2 items-center">
                    {/* Upload Button - Compact */}
                    {(formData.inspirationImages?.length || 0) < 2 && (
                      <label
                        htmlFor="inquiry-images"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all"
                        style={{
                          borderColor: '#E0E0E0',
                          background: '#F8F8F8',
                          fontSize: '13px',
                          fontFamily: 'Poppins',
                          color: '#5A3825'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#C44569';
                          e.currentTarget.style.background = 'rgba(196, 69, 105, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E0E0E0';
                          e.currentTarget.style.background = '#F8F8F8';
                        }}
                      >
                        <Upload size={14} color="#C44569" />
                        <span>Add Image</span>
                        <input
                          id="inquiry-images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}

                    {/* Image Previews - Inline */}
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden"
                        style={{
                          width: '60px',
                          height: '60px',
                          border: '2px solid #E0E0E0',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Inspiration ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: 'rgba(196, 69, 105, 0.95)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <XIcon size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid #E0E0E0' }}>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onClose();
                    }}
                    className="flex-1 h-11 rounded-lg"
                    style={{
                      background: '#F8F8F8',
                      border: '1px solid #E0E0E0',
                      color: '#5A3825',
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-11 rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, #C44569 0%, #A03355 100%)',
                      color: 'white',
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '14px',
                      border: 'none',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : '✓ Submit Inquiry'}
                  </Button>
                </div>

                <p
                  className="mt-3 text-center text-xs"
                  style={{ color: '#999', fontFamily: 'Open Sans' }}
                >
                  💬 We'll respond within 24 hours
                </p>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
