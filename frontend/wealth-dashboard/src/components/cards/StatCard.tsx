import { ReactNode } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  className
}: {
  title: string
  value: string | number
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}) {
  return (
    <div className={cn("p-6 rounded-xl border border-border bg-card shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-muted-foreground p-2 bg-secondary rounded-md">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {trend && trendValue && (
          <p className={cn("text-xs mt-2 font-medium flex items-center gap-1", {
            'text-green-500': trend === 'up',
            'text-red-500': trend === 'down',
            'text-muted-foreground': trend === 'neutral'
          })}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            <span className="text-muted-foreground font-normal ml-1">vs last month</span>
          </p>
        )}
      </div>
    </div>
  )
}
