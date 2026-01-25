import { useState } from 'react'
import type { TaskTemplate, TaskCategory } from '@/domain/entities/TaskTemplate'
import { DEFAULT_TASK_TEMPLATES, TASK_CATEGORY_LABELS } from '@/domain/entities/TaskTemplate'
import { Button } from '@/presentation/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { TodoIcon } from './TodoIcon'
import { ListPlus } from 'lucide-react'

interface TemplatePickerProps {
  onSelect: (template: TaskTemplate) => void
  childMode?: boolean
}

export function TemplatePicker({ onSelect, childMode = false }: TemplatePickerProps) {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('daily')

  // Group templates by category
  const templatesByCategory = DEFAULT_TASK_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {} as Record<TaskCategory, TaskTemplate[]>)

  const categories = Object.keys(templatesByCategory) as TaskCategory[]

  const handleSelect = (template: TaskTemplate) => {
    onSelect(template)
    setOpen(false)
  }

  const buttonSize = childMode ? 'h-12 w-12' : 'h-10 w-10'
  const iconSize = childMode ? 20 : 16
  const templateIconSize = childMode ? 18 : 16

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={buttonSize}
          aria-label="快速新增常用任務"
          title="快速新增常用任務"
        >
          <ListPlus size={iconSize} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 p-0"
        align="start"
        side="bottom"
        collisionPadding={8}
      >
        {/* Category tabs */}
        <div className="overflow-x-auto border-b bg-muted/30 scrollbar-thin">
          <div className="flex gap-1 p-2 min-w-max">
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                variant={selectedCategory === category ? 'secondary' : 'ghost'}
                size="sm"
                className={`whitespace-nowrap ${childMode ? 'h-9 px-3 text-sm' : 'h-7 px-2 text-xs'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {TASK_CATEGORY_LABELS[category]}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates for selected category */}
        <div className="p-2 max-h-64 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {templatesByCategory[selectedCategory]?.map((template) => (
              <Button
                key={template.id}
                type="button"
                variant="ghost"
                onClick={() => handleSelect(template)}
                className={`justify-start gap-2 ${childMode ? 'h-12 text-base' : 'h-9 text-sm'}`}
              >
                <TodoIcon name={template.icon} size={templateIconSize} className="text-primary shrink-0" />
                <span className="flex-1 text-left truncate">{template.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {template.durationMinutes}分
                </span>
              </Button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
