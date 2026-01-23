import { useState } from 'react'
import { Button } from '@/presentation/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { TODO_ICONS, TODO_ICON_LABELS, type TodoIconCategory } from '@/domain/entities/TodoIcons'
import { TodoIcon } from './TodoIcon'
import { Smile, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconPickerProps {
  value?: string
  onChange: (icon: string | undefined) => void
  size?: 'sm' | 'default'
}

export function IconPicker({ value, onChange, size = 'default' }: IconPickerProps) {
  const categories = Object.keys(TODO_ICONS) as TodoIconCategory[]
  const [selectedCategory, setSelectedCategory] = useState<TodoIconCategory>('school')

  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const iconSize = size === 'sm' ? 14 : 16

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={buttonSize}
          aria-label="選擇圖示"
        >
          {value ? (
            <TodoIcon name={value} size={iconSize} />
          ) : (
            <Smile size={iconSize} className="text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 p-0"
        align="start"
        side="bottom"
        collisionPadding={8}
      >
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
          {categories.map((category) => (
            <Button
              key={category}
              type="button"
              variant={selectedCategory === category ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setSelectedCategory(category)}
            >
              {TODO_ICON_LABELS[category]}
            </Button>
          ))}
        </div>

        {/* Icons grid for selected category */}
        <div className="p-2">
          <div className="flex flex-wrap gap-1">
            {TODO_ICONS[selectedCategory].map((iconName) => (
              <Button
                key={iconName}
                type="button"
                variant={value === iconName ? 'secondary' : 'ghost'}
                size="icon"
                className={cn(
                  'h-9 w-9',
                  value === iconName && 'ring-2 ring-primary'
                )}
                onClick={() => onChange(iconName)}
                aria-label={iconName}
              >
                <TodoIcon name={iconName} size={18} />
              </Button>
            ))}
          </div>
        </div>

        {/* Clear selection */}
        {value && (
          <div className="border-t p-2">
            <DropdownMenuItem
              className="justify-center text-muted-foreground"
              onClick={() => onChange(undefined)}
            >
              <X className="mr-1 h-3 w-3" />
              清除圖示
            </DropdownMenuItem>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
