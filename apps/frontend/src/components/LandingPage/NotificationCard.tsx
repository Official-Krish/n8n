interface NotificationCardProps {
  name: string
  message: string
  time: string
  icon: React.ReactNode
  /**
   * Tailwind color utility classes to tint the icon background.
   * Example: "from-blue-500 to-blue-600 shadow-blue-500/30"
   */
  accentClasses?: string
}

export default function NotificationCard({
  name,
  message,
  time,
  icon,
  accentClasses = "from-blue-500 to-blue-600 shadow-blue-500/30",
}: NotificationCardProps) {
  return (
    <div className="flex items-center justify-center p-1 mt-1">
      <div>
        <div className="flex items-center gap-2">
          {/* Icon */}
          <div className="relative shrink-0">
            <div
              className={`w-9 h-9 rounded-xl bg-linear-to-br flex items-center justify-center shadow-lg ${accentClasses}`}
            >
              <div className="w-4 h-4 text-white/95">{icon}</div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1 mb-0.5">
              <h3 className="text-white text-sm font-semibold">{name}</h3>
              <span className="text-gray-500 text-xs">· {time} ago</span>
            </div>
            <p className="text-gray-400 text-xs leading-snug">{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}