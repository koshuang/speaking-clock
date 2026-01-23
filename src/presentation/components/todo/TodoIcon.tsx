import { icons } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TodoIconProps {
  name?: string
  size?: number
  className?: string
}

export function TodoIcon({ name, size = 16, className }: TodoIconProps) {
  if (!name) return null

  const LucideIcon = icons[name as keyof typeof icons]
  if (!LucideIcon) return null

  return <LucideIcon size={size} className={cn('shrink-0', className)} />
}
