import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { User, Bell, Clock, CreditCard, Palette, Loader2 } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { ToastDemo } from '../components/ToastDemo';

export function Settings() {
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    showToast('success', 'Profile updated successfully! Your changes have been saved.');
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#C44569' }}>Settings</h1>
        <p className="tagline mt-2" style={{ fontFamily: 'Lucida Handwriting', fontSize: '16px', color: '#C44569', opacity: 0.9 }}>
          Customize your bakery experience
        </p>
      </div>

      {/* Toast Notification Demo */}
      <ToastDemo />

      {/* User Profile Settings */}
      <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="flex items-center gap-3 mb-6">
          <User size={24} color="#C44569" />
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#2B2B2B' }}>User Profile</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>Full Name</Label>
            <Input 
              defaultValue="Emily Baker" 
              className="rounded-lg bg-white" 
              style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.2)', color: '#5A3825' }} 
            />
          </div>
          <div>
            <Label className="mb-2 block" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>Email Address</Label>
            <Input 
              type="email" 
              defaultValue="emily@bakery.com" 
              className="rounded-lg bg-white" 
              style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.2)', color: '#5A3825' }} 
            />
          </div>
          <div>
            <Label className="mb-2 block" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>Phone Number</Label>
            <Input 
              type="tel" 
              defaultValue="(555) 123-4567" 
              className="rounded-lg bg-white" 
              style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.2)', color: '#5A3825' }} 
            />
          </div>
          <div>
            <Label className="mb-2 block" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>Bakery Name</Label>
            <Input 
              defaultValue="Emily Bakes Cakes" 
              className="rounded-lg bg-white" 
              style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.2)', color: '#5A3825' }} 
            />
          </div>
        </div>

        <Button 
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="mt-6 text-white hover:shadow-bakery-hover transition-all"
          style={{ 
            borderRadius: '8px', 
            fontFamily: 'Poppins', 
            fontWeight: 600,
            backgroundColor: '#C44569',
            height: '44px',
            minWidth: '44px'
          }}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="flex items-center gap-3 mb-6">
          <Bell size={24} color="#C44569" />
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#2B2B2B' }}>Notification Preferences</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#2B2B2B', fontWeight: 500 }}>Email Notifications</p>
              <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '4px' }}>Receive order updates via email</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator style={{ backgroundColor: 'rgba(90, 56, 37, 0.1)' }} />

          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#2B2B2B', fontWeight: 500 }}>SMS Alerts</p>
              <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '4px' }}>Get text messages for urgent updates</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator style={{ backgroundColor: 'rgba(90, 56, 37, 0.1)' }} />

          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#2B2B2B', fontWeight: 500 }}>Marketing Emails</p>
              <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '4px' }}>Receive tips and promotional content</p>
            </div>
            <Switch />
          </div>

          <Separator style={{ backgroundColor: 'rgba(90, 56, 37, 0.1)' }} />

          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#2B2B2B', fontWeight: 500 }}>Desktop Notifications</p>
              <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '4px' }}>Show notifications in browser</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Business Hours */}
      <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="flex items-center gap-3 mb-6">
          <Clock size={24} color="#C44569" />
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#2B2B2B' }}>Business Hours</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>Opening Time</Label>
            <Select defaultValue="9am">
              <SelectTrigger className="rounded-lg bg-white" style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.2)' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7am">7:00 AM</SelectItem>
                <SelectItem value="8am">8:00 AM</SelectItem>
                <SelectItem value="9am">9:00 AM</SelectItem>
                <SelectItem value="10am">10:00 AM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>Closing Time</Label>
            <Select defaultValue="6pm">
              <SelectTrigger className="rounded-lg bg-white" style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.2)' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4pm">4:00 PM</SelectItem>
                <SelectItem value="5pm">5:00 PM</SelectItem>
                <SelectItem value="6pm">6:00 PM</SelectItem>
                <SelectItem value="7pm">7:00 PM</SelectItem>
                <SelectItem value="8pm">8:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <Label className="mb-2 block" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>Order Lead Time (Days)</Label>
          <Input 
            type="number" 
            defaultValue="3" 
            min="1" 
            className="rounded-lg bg-white" 
            style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.2)', color: '#5A3825', maxWidth: '200px' }} 
          />
          <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '8px' }}>
            Minimum days required before order pickup
          </p>
        </div>
      </Card>

      {/* Payment & Billing */}
      <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="flex items-center gap-3 mb-6">
          <CreditCard size={24} color="#C44569" />
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#2B2B2B' }}>Payment & Billing</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>Payment Methods Accepted</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {['Cash', 'Credit Card', 'Debit Card', 'Venmo', 'PayPal', 'Zelle'].map((method) => (
                <div key={method} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8EBD7]">
                  <Switch defaultChecked={method === 'Cash' || method === 'Credit Card'} />
                  <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>{method}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Label className="mb-2 block" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>Default Deposit Percentage</Label>
            <Input 
              type="number" 
              defaultValue="50" 
              min="0" 
              max="100" 
              className="rounded-lg bg-white" 
              style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.2)', color: '#5A3825', maxWidth: '200px' }} 
            />
            <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '8px' }}>
              Percentage required as deposit for custom orders
            </p>
          </div>
        </div>
      </Card>

      {/* Theme Preferences */}
      <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="flex items-center gap-3 mb-6">
          <Palette size={24} color="#C44569" />
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#2B2B2B' }}>Theme Preferences</h3>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="mb-3 block" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>Color Theme</Label>
            <div className="flex gap-3">
              <div 
                className="w-16 h-16 rounded-lg cursor-pointer border-4 transition-all"
                style={{ 
                  background: 'linear-gradient(135deg, #C44569 0%, #5A3825 100%)',
                  borderColor: '#C44569'
                }}
                onClick={() => showToast('info', 'Vanilla Raspberry theme (current)')}
              />
              <div 
                className="w-16 h-16 rounded-lg cursor-pointer border-2 transition-all hover:border-[#C44569]"
                style={{ 
                  background: 'linear-gradient(135deg, #8B4789 0%, #4A4A4A 100%)',
                  borderColor: 'rgba(90, 56, 37, 0.2)'
                }}
                onClick={() => showToast('info', 'Theme locked in current version')}
              />
              <div 
                className="w-16 h-16 rounded-lg cursor-pointer border-2 transition-all hover:border-[#C44569]"
                style={{ 
                  background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                  borderColor: 'rgba(90, 56, 37, 0.2)'
                }}
                onClick={() => showToast('info', 'Theme locked in current version')}
              />
            </div>
            <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '12px' }}>
              Currently using: <span style={{ fontWeight: 600, color: '#C44569' }}>Vanilla Raspberry</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
