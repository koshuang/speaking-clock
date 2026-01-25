import { Clock, ListTodo, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabId = 'clock' | 'todo' | 'settings'

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  todoCount?: number
}

const tabs = [
  { id: 'clock' as const, label: '時鐘', icon: Clock },
  { id: 'todo' as const, label: '待辦', icon: ListTodo },
  { id: 'settings' as const, label: '設定', icon: Settings },
]

export function BottomNav({ activeTab, onTabChange, todoCount }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {id === 'todo' && todoCount !== undefined && todoCount > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                    {todoCount > 9 ? '9+' : todoCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          )
        })}
      </div>
      {/* Safe area padding for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
