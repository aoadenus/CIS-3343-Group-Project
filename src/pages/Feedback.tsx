import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Star, Send, MessageCircle } from 'lucide-react';
import { cn } from '../components/ui/utils';
import { useToast } from '../components/ToastContext';

export function Feedback() {
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I\'m Emily, your AI assistant. How can I help you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setMessages([...messages, { sender: 'user', text: inputMessage }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Thanks for your question! For order changes, please go to the Orders page and click the Edit button next to your order.' 
      }]);
    }, 1000);
    
    setInputMessage('');
  };

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      showToast('error', 'Please provide a rating before submitting feedback.');
      return;
    }
    showToast('success', 'Thank you for helping us improve our service!', 'Feedback Submitted');
    setRating(0);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#C44569' }}>Customer Feedback & Support</h1>
        <p className="tagline mt-2" style={{ fontFamily: 'Lucida Handwriting', fontSize: '16px', color: '#C44569', opacity: 0.9 }}>
          Your voice matters to us
        </p>
      </div>

      {/* Rate This Prototype */}
      <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <h3 className="mb-6" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#2B2B2B' }}>
          Rate This Dashboard
        </h3>

        {/* Star Rating */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={40}
                fill={(hoverRating || rating) >= star ? '#C44569' : 'none'}
                stroke={(hoverRating || rating) >= star ? '#C44569' : '#5A3825'}
                strokeWidth={2}
              />
            </button>
          ))}
        </div>

        <p className="mb-6" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>
          {rating === 0 && 'Please rate your experience'}
          {rating === 1 && 'We\'re sorry to hear that. We\'ll work to improve.'}
          {rating === 2 && 'Thanks for your feedback. What can we do better?'}
          {rating === 3 && 'Good! We appreciate your input.'}
          {rating === 4 && 'Great! We\'re glad you like it.'}
          {rating === 5 && 'Excellent! We\'re thrilled you love it!'}
        </p>

        {/* Feedback Form */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
              Tell us more about your experience
            </label>
            <Textarea
              placeholder="What do you like? What could be improved?"
              rows={4}
              className="rounded-lg bg-white"
              style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.2)', color: '#5A3825', fontFamily: 'Open Sans' }}
            />
          </div>

          <div>
            <label className="block mb-3" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
              What features are most important to you?
            </label>
            <div className="space-y-3">
              {[
                'Order management',
                'Customer tracking',
                'Revenue analytics',
                'Product customization',
                'Mobile accessibility',
                'Inventory management'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <Checkbox id={feature} className="border-[#5A3825]" />
                  <label 
                    htmlFor={feature} 
                    className="cursor-pointer"
                    style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}
                  >
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmitFeedback}
            className="w-full sm:w-auto text-white hover:shadow-bakery-hover transition-all mt-4"
            style={{ 
              borderRadius: '8px', 
              fontFamily: 'Poppins', 
              fontWeight: 600,
              backgroundColor: '#C44569',
              height: '44px',
              minWidth: '44px'
            }}
          >
            <Send size={18} className="mr-2" />
            Submit Feedback
          </Button>
        </div>
      </Card>

      {/* AI Chat Assistant */}
      <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle size={24} color="#C44569" />
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#2B2B2B' }}>
            AI Assistant Chat
          </h3>
        </div>

        {/* Chat Messages */}
        <div 
          className="mb-4 p-4 rounded-lg space-y-4 overflow-y-auto"
          style={{ 
            height: '400px',
            backgroundColor: '#F8EBD7',
            border: '1px solid rgba(90, 56, 37, 0.1)'
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className="max-w-[80%] p-4 rounded-xl"
                style={{
                  backgroundColor: message.sender === 'user' ? '#C44569' : '#FFFFFF',
                  color: message.sender === 'user' ? '#FFFFFF' : '#5A3825',
                  fontFamily: 'Open Sans',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  boxShadow: '0px 1px 4px rgba(90, 56, 37, 0.08)'
                }}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex gap-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your question here..."
            className="flex-1 rounded-lg bg-white"
            style={{ 
              borderRadius: '8px', 
              borderColor: 'rgba(90, 56, 37, 0.2)', 
              color: '#5A3825',
              fontFamily: 'Open Sans',
              height: '44px'
            }}
          />
          <Button
            onClick={handleSendMessage}
            className="text-white hover:shadow-bakery-hover transition-all"
            style={{ 
              borderRadius: '8px', 
              backgroundColor: '#C44569',
              height: '44px',
              width: '44px',
              minWidth: '44px',
              padding: '0'
            }}
          >
            <Send size={18} />
          </Button>
        </div>
      </Card>

      {/* Contact Support */}
      <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <h3 className="mb-4" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#2B2B2B' }}>
          Need More Help?
        </h3>
        <p className="mb-6" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', lineHeight: 1.6 }}>
          Our support team is here to help you get the most out of your bakery dashboard.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            style={{ 
              borderRadius: '8px', 
              borderColor: 'rgba(90, 56, 37, 0.2)',
              fontFamily: 'Open Sans'
            }}
            onClick={() => showToast('info', 'Opening documentation...')}
          >
            <div className="text-left">
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '15px', color: '#2B2B2B' }}>Documentation
                Documentation
              </p>
              <p style={{ fontSize: '13px', color: '#5A3825', opacity: 0.7 }}>
                Browse guides & tutorials
              </p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            style={{ 
              borderRadius: '8px', 
              borderColor: 'rgba(90, 56, 37, 0.2)',
              fontFamily: 'Open Sans'
            }}
            onClick={() => showToast('info', 'support@emilybakescakes.com')}
          >
            <div className="text-left">
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '15px', color: '#2B2B2B' }}>Email Support
                Email Support
              </p>
              <p style={{ fontSize: '13px', color: '#5A3825', opacity: 0.7 }}>
                Get help via email
              </p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            style={{ 
              borderRadius: '8px', 
              borderColor: 'rgba(90, 56, 37, 0.2)',
              fontFamily: 'Open Sans'
            }}
            onClick={() => showToast('info', 'Opening video tutorials...')}
          >
            <div className="text-left">
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '15px', color: '#2B2B2B' }}>Video Tutorials
                Video Tutorials
              </p>
              <p style={{ fontSize: '13px', color: '#5A3825', opacity: 0.7 }}>
                Watch how-to videos
              </p>
            </div>
          </Button>
        </div>
      </Card>
    </div>
  );
}
