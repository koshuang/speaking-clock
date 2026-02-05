import { useState } from 'react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Plus } from 'lucide-react'
import { IconPicker } from './IconPicker'
import { DurationPicker } from './DurationPicker'
import { DeadlinePicker } from './DeadlinePicker'
import { TemplatePicker } from './TemplatePicker'
import type { TaskTemplate } from '@/domain/entities/TaskTemplate'

interface TodoFormProps {
  onAdd: (text: string, icon?: string, durationMinutes?: number, deadline?: string) => void
  childMode?: boolean
}

export function TodoForm({ onAdd, childMode = false }: TodoFormProps) {
  const [text, setText] = useState('')
  const [icon, setIcon] = useState<string | undefined>(undefined)
  const [duration, setDuration] = useState<number | undefined>(undefined)
  const [deadline, setDeadline] = useState<string | undefined>(undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text.trim(), icon, duration, deadline)
      setText('')
      setIcon(undefined)
      setDuration(undefined)
      setDeadline(undefined)
    }
  }

  const handleTemplateSelect = (template: TaskTemplate) => {
    onAdd(template.name, template.icon, template.durationMinutes)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
      <TemplatePicker onSelect={handleTemplateSelect} childMode={childMode} />
      <IconPicker value={icon} onChange={setIcon} />
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新增待辦..."
        aria-label="新增待辦事項"
        className="flex-1 min-w-0"
      />
      <DurationPicker value={duration} onChange={setDuration} compact />
      <DeadlinePicker value={deadline} onChange={setDeadline} compact />
      <Button type="submit" size="icon" aria-label="新增" disabled={!text.trim()} className="shrink-0">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  )
}
