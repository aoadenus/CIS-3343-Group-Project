import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../components/ToastContext';

const faqs = [
  {
    question: 'How far in advance should I order?',
    answer: 'We recommend ordering custom cakes at least 2-3 weeks in advance, especially for weddings and large events. However, we can accommodate rush orders when possible.'
  },
  {
    question: 'Do you offer delivery?',
    answer: 'Yes! We offer delivery within a 25-mile radius of our Houston location. Delivery fees vary based on distance and cake complexity.'
  },
  {
    question: 'Can I schedule a tasting?',
    answer: 'Absolutely! We offer complimentary tastings for wedding cake orders. For other custom orders, tastings can be scheduled for a small fee that\'s credited toward your final order.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, cash, Venmo, PayPal, and Zelle. A 50% deposit is required to confirm your order.'
  },
  {
    question: 'Do you accommodate dietary restrictions?',
    answer: 'Yes! We offer gluten-free, dairy-free, and vegan options. Please let us know your requirements when placing your order.'
  }
];

export function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      showToast('error', 'Please fill in all required fields (name, email, and message)');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      showToast('success', 'Message sent successfully! We\'ll get back to you within 24 hours.');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4">Get in Touch</h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            <strong style={{ color: '#C44569' }}>We do not accept online orders.</strong><br />
            Please call or visit us to place your custom cake order!
          </p>
        </motion.div>

        {/* Two-Column Layout: How Ordering Works + Contact Info Cards */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN: How Ordering Works */}
            <div
              className="glass-card p-6 md:p-7"
              style={{
                background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.08) 0%, rgba(196, 69, 105, 0.03) 100%)',
                border: '2px solid rgba(196, 69, 105, 0.2)'
              }}
            >
              <div className="mb-5">
                <h2 className="mb-2" style={{ color: '#C44569', fontSize: '26px' }}>How Ordering Works</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Our personalized ordering process
                </p>
              </div>
              
              {/* Vertical stack of workflow steps */}
              <div className="space-y-4">
                {/* Step 1: Call */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#C44569', boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)' }}
                  >
                    <Phone size={20} color="white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1" style={{ fontFamily: 'Poppins', fontSize: '15px', fontWeight: 600 }}>1. Call</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '6px' }}>
                      Reach us at
                    </p>
                    <a 
                      href="tel:713-555-2253"
                      style={{
                        color: '#C44569',
                        fontWeight: 700,
                        fontSize: '15px',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      (713) 555-CAKE
                    </a>
                  </div>
                </div>

                {/* Step 2: Discuss */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#8B3A5E', boxShadow: '0 4px 12px rgba(139, 58, 94, 0.3)' }}
                  >
                    <MessageCircle size={20} color="white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1" style={{ fontFamily: 'Poppins', fontSize: '15px', fontWeight: 600 }}>2. Discuss</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Share your vision, flavor preferences, and event details
                    </p>
                  </div>
                </div>

                {/* Step 3: Deposit */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#C44569', boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)' }}
                    role="img"
                    aria-label="Payment deposit step"
                  >
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>💳</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1" style={{ fontFamily: 'Poppins', fontSize: '15px', fontWeight: 600 }}>3. Deposit</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Secure your order with a 50% deposit
                    </p>
                  </div>
                </div>

                {/* Step 4: Build */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#8B3A5E', boxShadow: '0 4px 12px rgba(139, 58, 94, 0.3)' }}
                    role="img"
                    aria-label="Cake building step"
                  >
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>🎂</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1" style={{ fontFamily: 'Poppins', fontSize: '15px', fontWeight: 600 }}>4. Build</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Our bakers handcraft your custom cake
                    </p>
                  </div>
                </div>

                {/* Step 5: Pickup */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#C44569', boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)' }}
                    role="img"
                    aria-label="Pickup or delivery step"
                  >
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>📦</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1" style={{ fontFamily: 'Poppins', fontSize: '15px', fontWeight: 600 }}>5. Pickup</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Collect your masterpiece or arrange delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Contact Info Blocks (Stacked Vertically) */}
            <div className="space-y-5">
              {/* Phone Number Card */}
              <div
                className="glass-card p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.12) 0%, rgba(196, 69, 105, 0.06) 100%)',
                  border: '2px solid rgba(196, 69, 105, 0.3)'
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#C44569', boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)' }}
                  >
                    <Phone size={20} color="white" />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#C44569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                      Primary Ordering Method
                    </p>
                    <h5 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Call Us</h5>
                  </div>
                </div>
                <a 
                  href="tel:713-555-2253"
                  style={{
                    color: '#C44569',
                    fontWeight: 700,
                    fontSize: '24px',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '4px',
                    fontFamily: 'Poppins'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  (713) 555-CAKE
                </a>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>713-555-2253</p>
              </div>

              {/* Email Card */}
              <div
                className="glass-card p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.08) 0%, rgba(196, 69, 105, 0.03) 100%)',
                  border: '2px solid rgba(196, 69, 105, 0.2)'
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(196, 69, 105, 0.15)' }}
                  >
                    <Mail size={20} color="#C44569" />
                  </div>
                  <h5 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Email Us</h5>
                </div>
                <a 
                  href="mailto:info@emilybakescakes.com"
                  style={{
                    color: '#C44569',
                    fontWeight: 600,
                    fontSize: '16px',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  info@emilybakescakes.com
                </a>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Response within 24 hours</p>
              </div>

              {/* Address Card */}
              <div
                className="glass-card p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.08) 0%, rgba(196, 69, 105, 0.03) 100%)',
                  border: '2px solid rgba(196, 69, 105, 0.2)'
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(196, 69, 105, 0.15)' }}
                  >
                    <MapPin size={20} color="#C44569" />
                  </div>
                  <h5 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Visit Us</h5>
                </div>
                <a 
                  href="https://maps.google.com/?q=2847+Westheimer+Road+Houston+TX+77098"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#C44569',
                    fontWeight: 600,
                    fontSize: '15px',
                    textDecoration: 'none',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  2847 Westheimer Road<br />
                  Houston, TX 77098
                </a>
              </div>

              {/* Business Hours Card */}
              <div
                className="glass-card p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.08) 0%, rgba(196, 69, 105, 0.03) 100%)',
                  border: '2px solid rgba(196, 69, 105, 0.2)'
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(196, 69, 105, 0.15)' }}
                  >
                    <Clock size={20} color="#C44569" />
                  </div>
                  <h5 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Business Hours</h5>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  <p><strong style={{ color: 'var(--text-primary)' }}>Monday - Friday:</strong> 9 AM - 6 PM</p>
                  <p><strong style={{ color: 'var(--text-primary)' }}>Saturday:</strong> 10 AM - 4 PM</p>
                  <p><strong style={{ color: 'var(--text-primary)' }}>Sunday:</strong> Closed</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="surface-elevated p-8">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(196, 69, 105, 0.1)' }}
                >
                  <MessageCircle size={22} color="#C44569" />
                </div>
                <div>
                  <h3>Send Us a Message</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
                    For general questions only • <strong style={{ color: '#C44569' }}>Call to place orders</strong>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      Your Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="input-field h-12"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="input-field h-12"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(713) 555-CAKE"
                      className="input-field h-12"
                    />
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      Subject
                    </label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Custom cake inquiry"
                      className="input-field h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    Message *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your event and what you're looking for..."
                    rows={6}
                    className="input-field"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                  style={{ height: '56px' }}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Send size={20} />
                    </motion.div>
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Map & Additional Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Google Maps Embed */}
            <Card className="surface-elevated overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps?q=2847+Westheimer+Road+Houston+TX+77098&output=embed"
                width="100%"
                height="320"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Emily Bakes Cakes Location"
              />
            </Card>

            {/* Quick Info */}
            <Card className="surface-elevated p-6">
              <h4 className="mb-4">Before You Visit</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(196, 69, 105, 0.1)' }}
                  >
                    <Clock size={14} color="#C44569" />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Appointments Recommended</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Schedule a tasting or consultation for personalized service
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(196, 69, 105, 0.1)' }}
                  >
                    <MapPin size={14} color="#C44569" />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Free Parking Available</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Street parking and nearby garage
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(196, 69, 105, 0.1)' }}
                  >
                    <Phone size={14} color="#C44569" />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Call Ahead for Rush Orders</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      We'll do our best to accommodate urgent requests
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Quick answers to common questions</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="surface-elevated p-6">
                  <h5 className="mb-3" style={{ color: '#C44569' }}>{faq.question}</h5>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {faq.answer}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="glass-card p-12 text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-4">Ready to Order Your Cake?</h3>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Call us at (713) 555-CAKE or visit our shop to discuss your custom cake vision with our team.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="tel:713-555-2253"
              className="btn-primary"
              style={{ minWidth: '200px', height: '56px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            >
              📞 Call Us
            </a>
            <a 
              href="mailto:orders@emilybakes.com"
              className="btn-secondary"
              style={{ minWidth: '200px', height: '56px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            >
              📧 Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
