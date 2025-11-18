import { useState } from "react";
import { motion } from "motion/react";
import {
  Lock,
  User as UserIcon,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { useToast } from "../../components/ToastContext";
import DevOriginBanner from '../../components/DevOriginBanner';
import { supabase } from "../../lib/supabaseClient";

const demoAccounts = [
  { role: "Owner", email: "emily@emilybakescakes.com", password: "test" },
  { role: "Manager", email: "james@emilybakescakes.com", password: "test" },
  { role: "Accountant", email: "dan@emilybakescakes.com", password: "test" },
  { role: "Sales", email: "sarah@emilybakescakes.com", password: "test" },
  { role: "Baker", email: "mike@emilybakescakes.com", password: "test" },
  { role: "Decorator", email: "lisa@emilybakescakes.com", password: "test" },
] as const;

interface LoginProps {
  onBackToPublic: () => void;
}

export default function Login({ onBackToPublic }: LoginProps) {
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCard, setShowDemoCard] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      showToast(
        "error",
        "Please enter both username and password",
        "Validation Error",
      );
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: username.trim().toLowerCase(),
        password,
      });

      if (error) {
        throw new Error(error.message || JSON.stringify(error));
      }
      showToast("success", "Welcome back!", "Login Successful");
    } catch (error) {
      console.error("Login error:", error);

      // Detect common network/CORS failures and provide actionable instruction
      const rawMessage = error instanceof Error ? error.message : String(error);
      if (/failed to fetch|networkerror|network error|Failed to fetch/i.test(rawMessage)) {
        // Provide the current origin so the developer can add it to Supabase allowed origins
        const origin = window.location.origin;
        showToast(
          "error",
          `Network request failed. If you're accessing the dev server from another machine, add this origin to your Supabase project's allowed origins and redirect URLs: ${origin}`,
          "Network Error",
        );
      } else {
        const message = rawMessage || "Network error. Please try again.";
        showToast("error", message, "Login Failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (email: string, pass: string) => {
    setUsername(email);
    setPassword(pass);
    showToast("info", `Filled credentials for ${email}`, "Demo Account Selected");
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-6"
      style={{ padding: "24px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]">
        <motion.div
          className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #C44569 0%, transparent 70%)",
          }}
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

      <motion.button
        onClick={onBackToPublic}
        className="absolute flex items-center gap-2"
        style={{
          top: '32px',
          left: '32px',
          background: 'rgba(196, 69, 105, 0.15)',
          border: '2px solid rgba(196, 69, 105, 0.4)',
          borderRadius: 10,
          padding: '12px 20px',
          color: '#FFFFFF',
          fontFamily: 'Poppins, sans-serif',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)',
          transition: 'all 200ms ease',
          zIndex: 100
        }}
        whileHover={{ 
          background: 'rgba(196, 69, 105, 0.25)',
          borderColor: 'rgba(196, 69, 105, 0.6)',
          boxShadow: '0 6px 16px rgba(196, 69, 105, 0.4)',
          scale: 1.02
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <ArrowLeft size={18} strokeWidth={2.5} />
        <span>Back to Site</span>
      </motion.button>

      <motion.div
        className="relative z-10 w-full max-w-2xl space-y-4 overflow-y-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Dev helper: show origin + copy button for easy Supabase config */}
        <DevOriginBanner />
        {/* Demo Credentials */}
        <Card
          style={{
            background: "#F8EBD7",
            border: "2px solid rgba(196, 69, 105, 0.3)",
            padding: "20px 24px",
            boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setShowDemoCard((prev) => !prev)}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "rgba(196, 69, 105, 0.15)" }}
              >
                <Info size={20} color="#C44569" />
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#2B2B2B" }}>
                  Demo Accounts
                </p>
                <p className="text-sm" style={{ color: "#6B4F4F" }}>
                  Click any role to autofill the login form
                </p>
              </div>
            </div>
            {showDemoCard ? (
              <ChevronUp color="#C44569" />
            ) : (
              <ChevronDown color="#C44569" />
            )}
          </button>

          {showDemoCard && (
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleSelectDemo(account.email, account.password)}
                  className="rounded-xl border-2 px-4 py-3 text-left transition-all"
                  style={{
                    borderColor: "rgba(196, 69, 105, 0.4)",
                    background: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#C44569]">
                    {account.role}
                  </p>
                  <p className="text-sm font-medium text-[#2B2B2B]">{account.email}</p>
                  <p className="text-xs text-[#6B4F4F]">Password: {account.password}</p>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Login Card */}
        <Card
          className="glass-card"
          style={{ padding: "32px 40px", borderColor: "rgba(196, 69, 105, 0.2)" }}
        >
          <div className="text-center" style={{ marginBottom: '24px' }}>
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
              style={{
                fontFamily: 'Playfair Display',
                fontSize: 'clamp(28px, 5vw, 36px)',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}
            >
              Staff Portal
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Sign in to access the admin dashboard
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
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
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-14 rounded-xl"
                    style={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border-medium)",
                      color: "var(--text-primary)",
                      fontFamily: "Open Sans",
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C44569]"
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  >
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm" style={{ marginTop: '12px' }}>
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
              style={{ height: '56px', fontSize: '16px', marginTop: '20px' }}
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

      </motion.div>
    </div>
  );
}
