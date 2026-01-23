import { useState } from 'react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Plus } from 'lucide-react'

interface TodoFormProps {
  onAdd: (text: string) => void
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text.trim())
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="輸入待辦事項..."
        aria-label="新增待辦事項"
        className="flex-1"
      />
      <Button type="submit" size="icon" aria-label="新增" disabled={!text.trim()}>
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  )
}
