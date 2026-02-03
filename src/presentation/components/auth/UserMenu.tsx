import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useAuth } from '../../hooks/useAuth'
import { User, LogOut, Cloud } from 'lucide-react'

export function UserMenu() {
  const { user, signOut, isLoading } = useAuth()

  if (!user) return null

  const initials = user.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user.email.slice(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative h-8 w-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="使用者選單"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName ?? user.email}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {initials}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName ?? user.email}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {initials}
            </div>
          )}
          <div className="flex flex-col space-y-1 leading-none">
            {user.displayName && (
              <p className="font-medium text-sm">{user.displayName}</p>
            )}
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>資料已同步</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          disabled={isLoading}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface LoginButtonProps {
  onClick: () => void
}

export function LoginButton({ onClick }: LoginButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label="登入"
      className="h-8 w-8"
    >
      <User className="h-5 w-5" />
    </Button>
  )
}
