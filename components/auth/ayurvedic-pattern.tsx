export function AyurvedicPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ayurvedic-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="1" fill="hsl(var(--color-ayurvedic-green))" opacity="0.3" />
            <circle cx="25" cy="25" r="1" fill="hsl(var(--color-ayurvedic-teal))" opacity="0.2" />
            <circle cx="75" cy="75" r="1" fill="hsl(var(--color-ayurvedic-gold))" opacity="0.2" />
            <path
              d="M 50 30 Q 60 40 50 50 Q 40 40 50 30"
              stroke="hsl(var(--color-ayurvedic-green))"
              strokeWidth="0.5"
              fill="none"
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ayurvedic-pattern)" />
      </svg>
    </div>
  )
}
