import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User as UserIcon } from 'lucide-react';
import CredentialsToggle from '../../components/CredentialsToggle';
import BackToSiteDropdown from '../../components/BackToSiteDropdown';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { useToast } from '../../components/ToastContext';

interface LoginProps {
  onLogin: () => void;
  onBackToPublic: () => void;
  onLogout?: () => void;
}

export default function Login({ onLogin, onBackToPublic, onLogout }: LoginProps) {
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      showToast('error', 'Please enter both username and password', 'Validation Error');
      return;
    }

    setIsLoading(true);

    try {
      localStorage.removeItem('token');

      const response = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast('error', data.error || 'Invalid email or password', 'Login Failed');
        setIsLoading(false);
        return;
      }

      if (!data.token || !data.user || !data.user.role) {
        showToast('error', 'Invalid response from server', 'Login Failed');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      showToast('success', `Welcome back, ${data.user.name}!`, 'Login Successful');
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
      showToast('error', 'Network error. Please check your connection and try again.', 'Connection Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C44569 0%, transparent 70%)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Back to Site dropdown (logout) */}
      <div className="absolute top-8 right-8">
        <BackToSiteDropdown
          onLogout={() => {
            onLogout?.();
            showToast('info', 'You have been logged out', 'Logged Out');
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Left: Login Card */}
        <Card className="glass-card p-8 md:p-10">
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
              style={{ marginBottom: '20px', background: 'rgba(196, 69, 105, 0.1)' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <Lock size={28} color="#C44569" />
            </motion.div>

            <h2
              className="mb-2"
              style={{
                fontFamily: 'Playfair Display',
                fontSize: 'clamp(28px, 5vw, 36px)',
                color: 'var(--text-primary)'
              }}
            >
              Staff Portal
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label
                htmlFor="username"
                className="block mb-2"
                style={{
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)'
                }}
              >
                Username
              </label>
              <div className="relative">
                <UserIcon
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  size={18}
                  color="var(--text-tertiary)"
                />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 h-14 rounded-xl"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Open Sans'
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2"
                style={{
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)'
                }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  size={18}
                  color="var(--text-tertiary)"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 rounded-xl"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Open Sans'
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[#C44569]"
                />
                <span style={{ color: 'var(--text-secondary)' }}>Remember me</span>
              </label>
              <button
                type="button"
                style={{ color: '#C44569', fontWeight: 500 }}
                onClick={() => showToast('info', 'Contact admin for password reset')}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
              style={{ height: '56px', fontSize: '16px' }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Lock size={20} />
                </motion.div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>

        {/* Right: Demo Credentials Toggle (collapsed by default) */}
        <div className="flex items-start">
          <CredentialsToggle />
        </div>

      </motion.div>
    </div>
  );
}
