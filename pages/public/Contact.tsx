import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../components/ToastContext';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['123 Magazine Street', 'New Orleans, LA 70130']
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['(555) 123-4567', 'Mon-Sat: 9 AM - 6 PM']
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['hello@emilybakescakes.com', 'Response within 24 hours']
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Monday - Friday: 9 AM - 6 PM', 'Saturday: 10 AM - 4 PM', 'Sunday: Closed']
  }
];

const faqs = [
  {
    question: 'How far in advance should I order?',
    answer: 'We recommend ordering custom cakes at least 2-3 weeks in advance, especially for weddings and large events. However, we can accommodate rush orders when possible.'
  },
  {
    question: 'Do you offer delivery?',
    answer: 'Yes! We offer delivery within a 25-mile radius of our New Orleans location. Delivery fees vary based on distance and cake complexity.'
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showToast('success', 'Message sent successfully! We\'ll get back to you within 24 hours.');
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
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
            Have questions? Want to place an order? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {contactInfo.map((info, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Card className="surface-elevated p-6 h-full text-center">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(196, 69, 105, 0.1)' }}
                >
                  <info.icon size={24} color="#C44569" />
                </div>
                <h5 className="mb-3">{info.title}</h5>
                {info.details.map((detail, j) => (
                  <p key={j} style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {detail}
                  </p>
                ))}
              </Card>
            </motion.div>
          ))}
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
                  <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>We'll respond within 24 hours</p>
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
                      placeholder="(555) 123-4567"
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
            {/* Map Placeholder */}
            <Card className="surface-elevated overflow-hidden">
              <div 
                className="w-full h-80 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.1) 0%, rgba(90, 56, 37, 0.05) 100%)'
                }}
              >
                <div className="text-center">
                  <MapPin size={64} color="rgba(196, 69, 105, 0.3)" className="mx-auto mb-4" />
                  <p style={{ color: 'var(--text-secondary)' }}>
                    123 Magazine Street<br />
                    New Orleans, LA 70130
                  </p>
                </div>
              </div>
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
          <h3 className="mb-4">Prefer to Order Online?</h3>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Use our custom cake builder to design your perfect cake in minutes.
          </p>
          <Button className="btn-primary" style={{ minWidth: '240px', height: '56px' }}>
            Start Building Your Cake
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
