import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// ─── Small reusable components matching ResultPage ─────────────────────────

function LoadingSpinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function StatusBadge({ status }) {
  const isPass = status?.toUpperCase() === 'PASS'
  return (
    <span className={isPass ? 'badge-pass' : 'badge-fail'}>
      <span className={`w-1.5 h-1.5 rounded-full ${isPass ? 'bg-green-400' : 'bg-red-400'}`} />
      {status}
    </span>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35">{label}</span>
      <span className="text-sm font-body font-medium text-white/85">{value ?? '—'}</span>
    </div>
  )
}

// Editable stat card — wraps the ResultPage StatCard in an inline input
function EditableStatCard({ label, value, accent, onChange, type = 'text', disabled }) {
  return (
    <div className="stat-card flex flex-col gap-2 animate-slide-up">
      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="font-display text-2xl font-bold bg-transparent border-b focus:outline-none w-full"
        style={{
          color: accent,
          borderColor: `${accent}40`,
          caretColor: accent,
        }}
      />
    </div>
  )
}

// Toast notification
function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl animate-fade-in ${
        type === 'success'
          ? 'bg-green-500/20 border border-green-500/30 text-green-300'
          : 'bg-red-500/15 border border-red-500/25 text-red-300'
      }`}
      style={{ backdropFilter: 'blur(16px)' }}
    >
      {type === 'success' ? (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      )}
      <span className="text-sm font-body font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/40 hover:text-white/70 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate()

  // Search state
  const [rollNumber, setRollNumber] = useState('')
  const [semester, setSemester]     = useState('')
  const [fetching, setFetching]     = useState(false)
  const [updating, setUpdating]     = useState(false)
  const [fetchError, setFetchError] = useState('')

  // Result state
  const [result, setResult]           = useState(null)
  const [originalResult, setOriginal] = useState(null)

  // Toast
  const [toast, setToast] = useState(null) // { message, type }
  const toastTimer = useRef(null)

  const showToast = (message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, type })
    toastTimer.current = setTimeout(() => setToast(null), 4000)
  }

  // ── Fetch result ──────────────────────────────────────────────────────────
  const fetchResult = async () => {
    if (!rollNumber.trim()) { setFetchError('Please enter a roll number.'); return }
    if (!semester) { setFetchError('Please select a semester.'); return }

    setFetchError('')
    setFetching(true)
    setResult(null)
    try {
      const response = await axios.get(
  `https://student-result-portal-7dqc.onrender.com/api/admin/result?rollNumber=${rollNumber.trim().toUpperCase()}&semester=${semester}`
)
      setResult(response.data)
      setOriginal(JSON.parse(JSON.stringify(response.data))) // deep clone for reset
    } catch {
      setFetchError('Student result not found. Verify the roll number and semester.')
    } finally {
      setFetching(false)
    }
  }

  // ── Subject field change ───────────────────────────────────────────────────
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...result.subjects]
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value }
    setResult({ ...result, subjects: updatedSubjects })
  }

  // ── Update result ─────────────────────────────────────────────────────────
  const updateResult = async () => {
    setUpdating(true)
    try {
      await axios.put('http://localhost:8080/api/admin/result', {
        rollNumber:    result.rollNumber,
        semester:      result.semester,
        sgpa:          result.sgpa,
        cgpa:          result.cgpa,
        overallStatus: result.overallStatus,
        subjects:      result.subjects,
      })
      setOriginal(JSON.parse(JSON.stringify(result)))
      showToast('Result updated successfully', 'success')
    } catch {
      showToast('Update failed. Please try again.', 'error')
    } finally {
      setUpdating(false)
    }
  }

  // ── Reset changes ─────────────────────────────────────────────────────────
  const resetChanges = () => {
    if (originalResult) {
      setResult(JSON.parse(JSON.stringify(originalResult)))
      showToast('Changes reset to last saved state', 'success')
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    navigate('/admin')
  }

  const isBusy = fetching || updating

  return (
    <div className="min-h-screen bg-portal-gradient px-4 py-10 relative overflow-hidden">

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Decorative orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-8 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, #e8b318 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, #3a57ad 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* ── Portal header ─────────────────────────────────────────────────── */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mb-3">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <path d="M32 4L4 18V22H60V18L32 4Z" fill="#e8b318" opacity="0.9"/>
                <rect x="10" y="22" width="6" height="28" rx="1" fill="#e8b318" opacity="0.7"/>
                <rect x="29" y="22" width="6" height="28" rx="1" fill="#e8b318" opacity="0.7"/>
                <rect x="48" y="22" width="6" height="28" rx="1" fill="#e8b318" opacity="0.7"/>
                <rect x="6" y="50" width="52" height="4" rx="1" fill="#e8b318" opacity="0.9"/>
                <rect x="4" y="54" width="56" height="3" rx="1" fill="#e8b318"/>
                <circle cx="32" cy="14" r="4" fill="#f5d98a"/>
              </svg>
            </div>
          </div>
          <p className="text-gold-400 text-xs font-body tracking-[0.35em] uppercase mb-1">
            Academic Records
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            Admin Result Management
          </h1>
          <div className="gold-divider w-32 mx-auto mt-3" />
          <p className="text-white/30 text-xs font-body mt-3 tracking-wide">
            Academic Records Administration Portal
          </p>
        </div>

        {/* ── Search panel ──────────────────────────────────────────────────── */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-6 animate-slide-up delay-100">

          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                 style={{ background: 'rgba(232,179,24,0.15)', border: '1px solid rgba(232,179,24,0.25)' }}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#e8b318" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-white/90 leading-none">Lookup Student Result</h2>
              <p className="text-[11px] text-white/35 font-body mt-0.5">Enter roll number and semester to load editable data</p>
            </div>
          </div>

          <div className="gold-divider mb-5" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Roll Number */}
            <div className="sm:col-span-1 space-y-1.5">
              <label className="block text-xs font-semibold text-white/50 tracking-widest uppercase">
                Roll Number
              </label>
              <input
                type="text"
                className="portal-input font-mono tracking-wider"
                placeholder="e.g. 22Q71A05XX"
                value={rollNumber}
                onChange={(e) => { setRollNumber(e.target.value); setFetchError('') }}
                disabled={isBusy}
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
                onChange={(e) => { setSemester(e.target.value); setFetchError('') }}
                disabled={isBusy}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff60' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                }}
              >
                <option value="" disabled style={{ background: '#0d1535' }}>Select semester</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem} style={{ background: '#0d1535' }}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Fetch button */}
            <div className="flex items-end">
              <button
                onClick={fetchResult}
                disabled={isBusy}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                {fetching ? (
                  <><LoadingSpinner /> Fetching…</>
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
            </div>
          </div>

          {/* Fetch error */}
          {fetchError && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 mt-4 animate-fade-in">
              <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-sm text-red-300 font-body leading-relaxed">{fetchError}</p>
            </div>
          )}
        </div>

        {/* ── Empty state ───────────────────────────────────────────────────── */}
        {!result && !fetching && (
          <div className="glass-card rounded-3xl p-12 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                 style={{ background: 'rgba(232,179,24,0.08)', border: '1px solid rgba(232,179,24,0.15)' }}>
              <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-white/25 text-sm font-body">
              Enter a roll number and select a semester to load the student result for editing.
            </p>
          </div>
        )}

        {result && (
          <>
            {/* ── Student info card ──────────────────────────────────────── */}
            <div className="glass-card rounded-3xl p-6 md:p-8 mb-5 animate-slide-up">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-1">Student Name</p>
                  <h2 className="font-display text-xl md:text-2xl font-semibold text-white leading-tight">
                    {result.studentName}
                  </h2>
                </div>
                <StatusBadge status={result.overallStatus} />
              </div>

              <div className="gold-divider mb-6" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <InfoRow label="Roll Number" value={result.rollNumber} />
                <InfoRow label="Branch"      value={result.branch}      />
                <InfoRow label="Regulation"  value={result.regulation}  />
                <InfoRow label="Semester"    value={`Semester ${result.semester}`} />
              </div>
            </div>

            {/* ── Editable performance cards ──────────────────────────────── */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              <EditableStatCard
                label="SGPA"
                value={result.sgpa}
                accent="#e8b318"
                disabled={isBusy}
                onChange={(val) => setResult({ ...result, sgpa: val })}
              />
              <EditableStatCard
                label="CGPA"
                value={result.cgpa}
                accent="#f5d98a"
                disabled={isBusy}
                onChange={(val) => setResult({ ...result, cgpa: val })}
              />

              {/* Overall status selector */}
              <div className="stat-card flex flex-col gap-2 animate-slide-up">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35">Overall Status</span>
                <select
                  value={result.overallStatus ?? 'PASS'}
                  onChange={(e) => setResult({ ...result, overallStatus: e.target.value })}
                  disabled={isBusy}
                  className="font-display text-xl font-bold bg-transparent border-b focus:outline-none cursor-pointer appearance-none"
                  style={{
                    color: result.overallStatus?.toUpperCase() === 'PASS' ? '#4ade80' : '#f87171',
                    borderColor: result.overallStatus?.toUpperCase() === 'PASS' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)',
                  }}
                >
                  <option value="PASS" style={{ background: '#0d1535', color: '#4ade80' }}>PASS</option>
                  <option value="FAIL" style={{ background: '#0d1535', color: '#f87171' }}>FAIL</option>
                </select>
              </div>
            </div>

            {/* ── Subject edit table ──────────────────────────────────────── */}
            <div className="glass-card rounded-3xl overflow-hidden animate-slide-up mb-5">

              {/* Table header */}
              <div className="px-6 md:px-8 py-5 border-b border-white/8 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                     style={{ background: 'rgba(232,179,24,0.12)', border: '1px solid rgba(232,179,24,0.2)' }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#e8b318" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">Subject-wise Results</h3>
                  <p className="text-xs text-white/35 font-body mt-0.5">
                    {result.subjects?.length ?? 0} subjects · Semester {result.semester}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full result-table">
                  <thead>
                    <tr>
                      <th>Subject Code</th>
                      <th>Subject Name</th>
                      <th className="text-center">Grade</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjects?.map((subject, index) => (
                      <tr key={subject.id ?? index} className="transition-colors duration-150">

                        {/* Subject Code */}
                        <td>
                          <input
                            className="w-full bg-transparent font-mono text-xs text-gold-400/80 tracking-wider
                                       border-b border-transparent hover:border-white/15 focus:border-gold-400/50
                                       focus:outline-none py-0.5 transition-colors duration-150"
                            value={subject.subjectCode ?? ''}
                            onChange={(e) => handleSubjectChange(index, 'subjectCode', e.target.value)}
                            disabled={isBusy}
                          />
                        </td>

                        {/* Subject Name */}
                        <td>
                          <input
                            className="w-full bg-transparent font-body text-sm text-white/80
                                       border-b border-transparent hover:border-white/15 focus:border-gold-400/50
                                       focus:outline-none py-0.5 transition-colors duration-150"
                            value={subject.subjectName ?? ''}
                            onChange={(e) => handleSubjectChange(index, 'subjectName', e.target.value)}
                            disabled={isBusy}
                          />
                        </td>

                        {/* Grade */}
                        <td className="text-center">
                          <input
                            className="w-12 mx-auto text-center bg-white/8 border border-white/12 rounded-lg
                                       font-display font-semibold text-sm text-gold-300 h-8
                                       focus:outline-none focus:border-gold-400/50 transition-colors duration-150
                                       hover:border-white/25 block"
                            value={subject.grade ?? ''}
                            onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
                            disabled={isBusy}
                          />
                        </td>

                        {/* Result Status dropdown */}
                        <td className="text-center">
                          <select
                            className="mx-auto text-center appearance-none cursor-pointer rounded-lg
                                       font-body text-xs font-semibold px-3 h-7 focus:outline-none
                                       transition-colors duration-150 block"
                            value={subject.resultStatus ?? 'PASS'}
                            onChange={(e) => handleSubjectChange(index, 'resultStatus', e.target.value)}
                            disabled={isBusy}
                            style={{
                              background: subject.resultStatus?.toUpperCase() === 'PASS'
                                ? 'rgba(74,222,128,0.12)'
                                : 'rgba(248,113,113,0.12)',
                              border: subject.resultStatus?.toUpperCase() === 'PASS'
                                ? '1px solid rgba(74,222,128,0.3)'
                                : '1px solid rgba(248,113,113,0.3)',
                              color: subject.resultStatus?.toUpperCase() === 'PASS'
                                ? '#4ade80'
                                : '#f87171',
                            }}
                          >
                            <option value="PASS" style={{ background: '#0d1535', color: '#4ade80' }}>PASS</option>
                            <option value="FAIL" style={{ background: '#0d1535', color: '#f87171' }}>FAIL</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="px-6 md:px-8 py-4 border-t border-white/8 flex items-center justify-between">
                <p className="text-[10px] text-white/25 font-body tracking-wide">
                  All fields are editable — click any value to modify it.
                </p>
                <p className="text-[10px] text-white/25 font-body tracking-wide">
                  Admin Portal · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* ── Action bar ─────────────────────────────────────────────── */}
            <div className="glass-card rounded-3xl px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">

              {/* Logout — left side */}
              <button
                onClick={handleLogout}
                disabled={isBusy}
                className="btn-ghost flex items-center gap-2 text-red-400/70 hover:text-red-400 border-red-500/20 hover:border-red-500/40"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>

              {/* Reset + Update — right side */}
              <div className="flex items-center gap-3">
                <button
                  onClick={resetChanges}
                  disabled={isBusy}
                  className="btn-ghost flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Changes
                </button>

                <button
                  onClick={updateResult}
                  disabled={isBusy}
                  className="btn-gold flex items-center gap-2"
                >
                  {updating ? (
                    <><LoadingSpinner /> Saving…</>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                          d="M5 13l4 4L19 7" />
                      </svg>
                      Update Result
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        <p className="text-center text-white/20 text-xs font-body mt-8 tracking-wide">
          Copyright © Mukesh. All rights reserved.
        </p>
      </div>
    </div>
  )
}