export default function LoadingSpinner({ size = 'md', label = 'Fetching result…' }) {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Outer ring */}
      <div className="relative flex items-center justify-center">
        <span
          className={`${sizeMap[size]} rounded-full border-white/10 border-t-gold-400 animate-spin`}
        />
        {/* Inner pulse dot */}
        <span className="absolute w-2 h-2 rounded-full bg-gold-400/60 animate-pulse" />
      </div>

      {label && (
        <p className="text-xs font-body text-white/40 tracking-widest uppercase">
          {label}
        </p>
      )}
    </div>
  )
}
