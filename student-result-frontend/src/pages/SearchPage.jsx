import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchResult } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8, 'REPORT']

export default function SearchPage() {
  const navigate = useNavigate()

  const [rollNumber, setRollNumber] = useState('')
  const [semester, setSemester]     = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  const validate = () => {
    if (!rollNumber.trim()) {
      setError('Please enter a valid roll number.')
      return false
    }
    if (!semester) {
      setError('Please select a semester.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)
    try {
      const selectedSemester =
  semester === 'REPORT' ? 'REPORT' : Number(semester)

const data = await fetchResult(
  rollNumber.trim().toUpperCase(),
  selectedSemester
)

      if (!data || !data.rollNumber) {
        setError('Student not found. Please verify the roll number and semester.')
        return
      }

      navigate('/result', { state: { result: data } })
    } catch (err) {
      const msg = err.message || ''
      if (
        msg.toLowerCase().includes('404') ||
        msg.toLowerCase().includes('not found') ||
        msg.toLowerCase().includes('no result')
      ) {
        setError('Student not found. Please verify the roll number and semester.')
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-portal-gradient flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
    {/* Admin Login Button */}
<div className="absolute top-6 right-6 z-20">
  <button
    onClick={() => navigate('/admin')}
    className="
      glass-card
      px-5 py-2.5
      rounded-2xl
      flex items-center gap-2
      text-white/85
      hover:text-white
      transition-all duration-300
      hover:scale-105
      border border-white/10
    "
  >
    <svg
      className="w-4 h-4 text-gold-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zm0 2c-2.761 0-5 2.015-5 4.5V20h10v-2.5c0-2.485-2.239-4.5-5-4.5z"
      />
    </svg>

    <span className="text-sm font-body font-semibold tracking-wide">
      Admin Login
    </span>
  </button>
</div>
      {/* ── Decorative background orbs ── */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-10 blur-3xl"
           style={{ background: 'radial-gradient(circle, #e8b318 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full opacity-10 blur-3xl"
           style={{ background: 'radial-gradient(circle, #3a57ad 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 blur-3xl"
           style={{ background: 'radial-gradient(circle, #1e2f6e 0%, transparent 60%)' }} />

      {/* ── Main card ── */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">

        {/* University crest / logo placeholder */}
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
            CSE-B Student Result Portal
          </h1>
          <div className="gold-divider w-24 mt-3" />
        </div>

        {/* Glass search card */}
        <div className="glass-card rounded-3xl p-8">

          <h2 className="font-display text-lg font-semibold text-white/90 mb-1">
            Result Lookup
          </h2>
          <p className="text-xs font-body text-white/40 mb-6 leading-relaxed">
            Enter your roll number and select the semester to retrieve your academic result.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Roll Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/50 tracking-widest uppercase">
                Roll Number
              </label>
              <input
                type="text"
                className="portal-input font-mono tracking-wider"
                placeholder="e.g. 22Q71A05XX"
                value={rollNumber}
                onChange={(e) => {
                  setRollNumber(e.target.value)
                  setError('')
                }}
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Semester */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/50 tracking-widest uppercase">
                Semester
              </label>
              <select
                className="portal-input appearance-none cursor-pointer"
                value={semester}
                onChange={(e) => {
                  setSemester(e.target.value)
                  setError('')
                }}
                disabled={loading}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff60' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
              >
                <option value="" disabled style={{ background: '#0d1535' }}>
                  Select semester
                </option>
                {SEMESTERS.map((sem) => (
  <option key={sem} value={sem} style={{ background: '#0d1535' }}>
    {sem === 'REPORT' ? 'Report' : `Semester ${sem}`}
  </option>
))}
              </select>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 animate-fade-in">
                <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-sm text-red-300 font-body leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-3 mt-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" label="" />
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                  Fetch Result
                </>
              )}
            </button>

          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/20 text-xs font-body mt-6 tracking-wide">
          Copyright © Mukesh. All rights reserved.
        </p>
      </div>
    </div>
  )
}
