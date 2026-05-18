import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

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
      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35">
        {label}
      </span>
      <span className="text-sm font-body font-medium text-white/85">{value ?? '—'}</span>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card flex flex-col gap-2 animate-slide-up">
      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35">
        {label}
      </span>
      <span
        className="font-display text-3xl font-bold"
        style={{ color: accent }}
      >
        {value ?? '—'}
      </span>
    </div>
  )
}

export default function ResultPage() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  // If navigated directly without data, go back to search
  useEffect(() => {
    if (!state?.result) {
      navigate('/', { replace: true })
    }
  }, [state, navigate])

  if (!state?.result) return null

  const result = state.result
  const {
  studentName,
  rollNumber,
  branch,
  regulation,
  semester,
  sgpa,
  cgpa,
  totalBacklogs,
  semesterReports,
  overallStatus,
  subjects,
} = result

  const isPass = overallStatus?.toUpperCase() === 'PASS'
  const safeSemesterReports = semesterReports || []
  const safeSubjects = subjects || []
  const isReport = safeSemesterReports.length > 0
  

  return (
    <div className="min-h-screen bg-portal-gradient px-4 py-10">

      {/* ── Background decoration ── */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-8 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, #e8b318 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, #3a57ad 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto print-area">

        {/* ── Top action bar (hidden on print) ── */}
        <div className="flex items-center justify-between mb-8 no-print animate-fade-in">
          <button
            onClick={() => navigate('/')}
            className="btn-ghost flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </button>

          <button
            onClick={() => window.print()}
            className="btn-gold flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Result
          </button>
        </div>

        {/* ── Portal header (visible on print too) ── */}
        <div className="text-center mb-8 animate-slide-up">
          <p className="text-gold-400 text-xs font-body tracking-[0.35em] uppercase mb-1">
            Academic Records
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            CSE-B Student Result Portal
          </h1>
          <div className="gold-divider w-32 mx-auto mt-3" />
          <p className="text-white/30 text-xs font-body mt-3 tracking-wide">
  {isReport
    ? 'Consolidated Academic Report'
    : `Semester ${semester} — Official Academic Transcript`}
</p>
        </div>

        {/* ── Student information card ── */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-5 animate-slide-up delay-100">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-1">
                Student Name
              </p>
              <h2 className="font-display text-xl md:text-2xl font-semibold text-white leading-tight">
                {studentName}
              </h2>
            </div>
            <StatusBadge status={overallStatus} />
          </div>

          <div className="gold-divider mb-6" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <InfoRow label="Roll Number"  value={rollNumber}  />
            <InfoRow label="Branch"       value={branch}      />
            <InfoRow label="Regulation"   value={regulation}  />
            <InfoRow
  label="Semester"
  value={isReport ? 'All Semesters' : `Semester ${semester}`}
/>
          </div>
        </div>

        {/* ── Performance cards ── */}
        <div className="grid grid-cols-3 gap-4 mb-5">
<div className="animate-slide-up delay-200">
  <StatCard
    label={isReport ? "CGPA" : "SGPA"}
    value={
      isReport
        ? cgpa?.toFixed(2)
        : sgpa?.toFixed(2)
    }
    accent="#e8b318"
  />
</div>
          <div className="animate-slide-up delay-300">
  <StatCard
  label="BACKLOGS"
  value={
    isReport
      ? totalBacklogs
      : safeSubjects?.find(
          subject => subject.subjectName?.toLowerCase() === "backlogs"
        )?.grade || 0
  }
  accent="#f5d98a"
/>
</div>
          <div className="stat-card flex flex-col gap-2 animate-slide-up delay-400">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35">
              Status
            </span>
            <div className="mt-1">
              <span
                className={`inline-block font-display text-2xl font-bold ${
                  isPass ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {overallStatus}
              </span>
            </div>
          </div>
        </div>

        {/* ── Subject results table ── */}
        <div className="glass-card rounded-3xl overflow-hidden animate-slide-up delay-500">

          {/* Table header */}
          <div className="px-6 md:px-8 py-5 border-b border-white/8">
            <h3 className="font-display text-lg font-semibold text-white">
              {isReport ? "Semester-wise Report" : "Subject-wise Results"}
            </h3>
            <p className="text-xs text-white/35 font-body mt-0.5">
              {isReport
                ? `${safeSemesterReports.length} semesters`
                : `${safeSubjects.length - 1} subjects · Semester ${semester}`}
            </p>
          </div>

          {!isReport && safeSubjects.length === 0 ? (
            <div className="px-8 py-12 text-center text-white/30 text-sm font-body">
              No subject data available for this semester.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full result-table">
                <thead>
  <tr>
    {isReport ? (
      <>
        <th>Semester</th>
        <th className="text-center">SGPA</th>
        <th className="text-center">Backlogs</th>
        <th className="text-center">Status</th>
      </>
    ) : (
      <>
        <th>Subject Code</th>
        <th>Subject Name</th>
        <th className="text-center">Grade</th>
        <th className="text-center">Status</th>
      </>
    )}
  </tr>
</thead>
                <tbody>
  {isReport ? (
    safeSemesterReports.map((sem, idx) => (
      <tr key={idx}>
        <td className="font-body text-white/80">
          Semester {sem.semester}
        </td>

        <td className="text-center">
          <span className="inline-block w-12 h-8 rounded-lg bg-white/8 border border-white/12 text-center leading-8 font-display font-semibold text-sm text-gold-300">
            {sem.sgpa?.toFixed(2)}
          </span>
        </td>

        <td className="text-center">
          <span className="inline-block w-8 h-8 rounded-lg bg-white/8 border border-white/12 text-center leading-8 font-display font-semibold text-sm text-gold-300">
            {sem.backlogs}
          </span>
        </td>

        <td className="text-center">
          <StatusBadge status={sem.backlogs === 0 ? "PASS" : "FAIL"} />
        </td>
      </tr>
    ))
  ) : (
    subjects
      .filter(subject => subject.subjectName?.toLowerCase() !== "backlogs")
      .map((subject, idx) => (
        <tr key={`${subject.subjectCode}-${idx}`} className="transition-colors duration-150">
          <td>
            <span className="font-mono text-xs text-gold-400/80 tracking-wider">
              {subject.subjectCode}
            </span>
          </td>
          <td className="font-body text-white/80">
            {subject.subjectName}
          </td>
          <td className="text-center">
            <span className="inline-block w-8 h-8 rounded-lg bg-white/8 border border-white/12 text-center leading-8 font-display font-semibold text-sm text-gold-300">
              {subject.grade}
            </span>
          </td>
          <td className="text-center">
            <StatusBadge status={subject.resultStatus} />
          </td>
        </tr>
      ))
  )}
</tbody>
              </table>
            </div>
          )}

          {/* Table footer */}
          <div className="px-6 md:px-8 py-4 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[10px] text-white/25 font-body tracking-wide">
              This is a computer-generated result. No signature required.
            </p>
            <p className="text-[10px] text-white/25 font-body tracking-wide">
              Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* ── Bottom action bar (no print) ── */}
        <div className="flex items-center justify-center gap-4 mt-8 no-print">
          <button
            onClick={() => navigate('/')}
            className="btn-ghost flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </button>
          <button
            onClick={() => window.print()}
            className="btn-gold flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Result
          </button>
        </div>

      </div>
    </div>
  )
}
