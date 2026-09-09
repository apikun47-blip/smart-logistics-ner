import React, { useState } from 'react';
import { useAuth, formatApiErrorDetail } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  Compass, X, Mail, Lock, User, KeyRound, ArrowLeft, Loader2,
  ShieldCheck, Route, Radar, Eye, EyeOff, Sparkles
} from 'lucide-react';

const FEATURES = [
  { icon: Radar, title: 'Predictive Risk Radar', desc: 'Landslide, flood & terrain risk forecasting across 8 NE states' },
  { icon: Route, title: 'AI Route Optimization', desc: 'Cargo-aware scoring across fastest, safest & balanced corridors' },
  { icon: ShieldCheck, title: 'Adaptive Rerouting', desc: 'Live incident intelligence with instant recommendation shifts' }
];

const Field = ({ icon: Icon, testId, ...props }) => (
  <div className="relative group">
    <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
    <input
      data-testid={testId}
      {...props}
      className="w-full bg-[#0A101F]/80 border border-slate-700/70 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
    />
  </div>
);

export default function AuthPage() {
  const { authView, setAuthView, login, register, forgotPassword, resetPassword } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [issuedToken, setIssuedToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const view = authView || 'login';
  const switchView = (v) => { setAuthView(v); setError(''); };
  const close = () => setAuthView(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (view === 'login') {
        const u = await login(email, password);
        toast.success(`Welcome back, ${u.name || 'operator'}!`);
        close();
      } else if (view === 'register') {
        const u = await register(name, email, password);
        toast.success(`Account created — welcome aboard, ${u.name}!`);
        close();
      } else if (view === 'forgot') {
        const res = await forgotPassword(email);
        if (res.reset_token) {
          setIssuedToken(res.reset_token);
          setResetToken(res.reset_token);
          toast.success('Reset token issued');
          switchView('reset');
        } else {
          toast.info(res.message);
        }
      } else if (view === 'reset') {
        const res = await resetPassword(resetToken, password);
        toast.success(res.message);
        setPassword('');
        switchView('login');
      }
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: ['Welcome Back', 'Sign in to your logistics command account'],
    register: ['Create Account', 'Join the NE India logistics intelligence network'],
    forgot: ['Forgot Password', 'Enter your account email to get a reset token'],
    reset: ['Reset Password', 'Enter your reset token and a new password']
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#060A14] overflow-y-auto" data-testid="auth-page">
      {/* Animated background */}
      <div className="absolute inset-0 auth-grid-bg pointer-events-none" />
      <div className="auth-orb bg-emerald-600/60 w-[420px] h-[420px] -top-32 -left-32" />
      <div className="auth-orb bg-teal-500/40 w-[360px] h-[360px] bottom-0 right-0" style={{ animationDelay: '-6s' }} />
      <div className="auth-orb bg-cyan-600/30 w-[280px] h-[280px] top-1/3 left-1/2" style={{ animationDelay: '-10s' }} />

      <button
        data-testid="auth-close-btn"
        onClick={close}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700/70 hover:rotate-90 transition-all duration-300"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
          {/* Left brand panel */}
          <div className="hidden lg:block auth-panel-enter">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50 glow-emerald">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <div className="font-bold text-xl text-white font-['Outfit']">AI Logistics Command</div>
                <p className="text-xs text-slate-400 font-mono tracking-wider">
                  PREDICT <span className="text-emerald-400">→</span> OPTIMIZE <span className="text-emerald-400">→</span> ADAPT
                </p>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4 font-['Outfit']">
              Smart Freight Intelligence for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                North Eastern India
              </span>
            </h1>
            <p className="text-slate-400 text-sm mb-10 max-w-md">
              Terrain-aware routing, monsoon risk prediction and adaptive incident rerouting — engineered for the toughest corridors in the country.
            </p>
            <div className="space-y-4">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="flex items-start space-x-4 p-4 rounded-2xl glass-card hover:border-emerald-500/30 transition-all duration-300 auth-panel-enter"
                  style={{ animationDelay: `${0.12 * (i + 1)}s` }}
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{f.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auth card */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50 auth-card-enter relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">Secure Access</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-['Outfit']">{titles[view][0]}</h2>
            <p className="text-xs text-slate-400 mt-1 mb-7">{titles[view][1]}</p>

            {(view === 'login' || view === 'register') && (
              <div className="flex bg-[#0A101F]/80 border border-slate-800 rounded-xl p-1 mb-6">
                {['login', 'register'].map((v) => (
                  <button
                    key={v}
                    data-testid={`auth-tab-${v}`}
                    onClick={() => switchView(v)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      view === v
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {v === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" key={view}>
              {view === 'register' && (
                <Field icon={User} testId="auth-name-input" type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
              )}
              {view !== 'reset' && (
                <Field icon={Mail} testId="auth-email-input" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              )}
              {view === 'reset' && (
                <>
                  {issuedToken && (
                    <div className="text-[11px] text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 break-all" data-testid="auth-issued-token">
                      Prototype mode — your reset token was auto-filled below.
                    </div>
                  )}
                  <Field icon={KeyRound} testId="auth-token-input" type="text" placeholder="Reset token" value={resetToken} onChange={(e) => setResetToken(e.target.value)} required />
                </>
              )}
              {view !== 'forgot' && (
                <div className="relative">
                  <Field
                    icon={Lock}
                    testId="auth-password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={view === 'reset' ? 'New password (min 6 chars)' : 'Password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    data-testid="auth-toggle-password"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {error && (
                <div data-testid="auth-error" className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3.5 py-2.5">
                  {error}
                </div>
              )}

              <button
                type="submit"
                data-testid="auth-submit-btn"
                disabled={loading}
                className="w-full btn-glow bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-xl shadow-lg shadow-emerald-900/40 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {view === 'login' && 'Sign In to Command Center'}
                  {view === 'register' && 'Create My Account'}
                  {view === 'forgot' && 'Get Reset Token'}
                  {view === 'reset' && 'Set New Password'}
                </span>
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-xs">
              {view === 'login' && (
                <button data-testid="auth-forgot-link" onClick={() => switchView('forgot')} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Forgot password?
                </button>
              )}
              {(view === 'forgot' || view === 'reset') && (
                <button data-testid="auth-back-to-login" onClick={() => switchView('login')} className="flex items-center space-x-1 text-slate-400 hover:text-emerald-400 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to sign in</span>
                </button>
              )}
              <button data-testid="auth-continue-guest" onClick={close} className="text-slate-500 hover:text-slate-300 transition-colors ml-auto">
                Continue as guest →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
