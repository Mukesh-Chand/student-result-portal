import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post(
  'https://student-result-portal-7dqc.onrender.com/api/admin/login',
  { username, password }
)
      localStorage.setItem('adminLoggedIn', 'true')
      navigate('/admin/dashboard')
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-portal-gradient flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Decorative orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, #e8b318 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, #3a57ad 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, #1e2f6e 0%, transparent 60%)' }} />

      <div className="relative z-10 w-full max-w-md animate-slide-up">

        {/* Portal crest */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center mb-4 animate-pulse-gold">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
              <path d="M32 4L4 18V22H60V18L32 4Z" fill="#e8b318" opacity="0.9"/>
              <rect x="10" y="22" width="6" height="28" rx="1" fill="#e8b318" opacity="0.7"/>
              <rect x="29" y="22" width="6" height="28" rx="1" fill="#e8b318" opacity="0.7"/>
              <rect x="48" y="22" width="6" height="28" rx="1" fill="#e8b318" opacity="0.7"/>
              <rect x="6" y="50" width="52" height="4" rx="1" fill="#e8b318" opacity="0.9"/>
              <rect x="4" y="54" width="56" height="3" rx="1" fill="#e8b318"/>
              <circle cx="32" cy="14" r="4" fill="#f5d98a"/>
            </svg>
          </div>
          <p className="text-gold-400 text-xs font-body tracking-[0.35em] uppercase mb-1">
            Academic Records
          </p>
          <h1 className="font-display text-3xl font-bold text-white text-center leading-tight">
            Admin Portal
          </h1>
          <div className="gold-divider w-24 mt-3" />
          <p className="text-white/30 text-xs font-body mt-2 tracking-wide">
            Result Management System
          </p>
        </div>

        {/* Login card */}
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'rgba(232,179,24,0.15)', border: '1px solid rgba(232,179,24,0.25)' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#e8b318" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-white/90 leading-none">Administrator Login</h2>
              <p className="text-[11px] text-white/35 font-body mt-0.5">Secure access to result management</p>
            </div>
          </div>

          <div className="gold-divider mb-6" />

          <form onSubmit={handleLogin} noValidate className="space-y-5">

            {/* Error alert */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 animate-fade-in">
                <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-sm text-red-300 font-body leading-relaxed">{error}</p>
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/50 tracking-widest uppercase">
                Username
              </label>
              <input
                type="text"
                className="portal-input font-mono tracking-wider"
                placeholder="Enter username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                disabled={loading}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/50 tracking-widest uppercase">
                Password
              </label>
              <input
                type="password"
                className="portal-input font-mono tracking-wider"
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-3 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Authenticating…
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>

          </form>
        </div>

        <p className="text-center text-white/20 text-xs font-body mt-6 tracking-wide">
          Copyright © Mukesh. All rights reserved.
        </p>
      </div>
    </div>
  )
}