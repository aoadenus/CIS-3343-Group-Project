import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { useToast } from '../../components/ToastContext';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  onBackToPublic: () => void;
}

export function Login({ onLogin, onBackToPublic }: LoginProps) {
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      showToast('error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showToast('success', 'Welcome back, Emily!');
    onLogin(username, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
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

      {/* Back Button */}
      <motion.button
        onClick={onBackToPublic}
        className="absolute top-8 left-8 flex items-center gap-2 text-[var(--text-secondary)] hover:text-[#C44569] transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ArrowLeft size={20} />
        <span style={{ fontFamily: 'Poppins', fontSize: '14px' }}>Back to Site</span>
      </motion.button>

      {/* Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card className="glass-card p-8 md:p-12">
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(196, 69, 105, 0.1)' }}
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
                onClick={() => toast.info('Contact admin for password reset')}
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

          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] text-center">
            <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
              Demo credentials: any username/password
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
