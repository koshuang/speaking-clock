import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Button } from '@/presentation/components/ui/button'
import { Toggle } from '@/presentation/components/ui/toggle'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { Target, Clock, Check, X, AlertCircle, TrendingUp, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import type { UltimateGoal } from '@/domain/entities/UltimateGoal'
import type { Todo } from '@/domain/entities/Todo'
import { TodoIcon } from '@/presentation/components/todo'

interface UltimateGoalPanelProps {
  goals: UltimateGoal[]
  todos: Todo[]
  selectedGoalId: string | null
  activeGoal: UltimateGoal | null
  onSelectGoal: (goalId: string | null) => void
  onAddGoal: (name: string, targetTime: string, todoIds: string[]) => void
  onUpdateGoal: (goalId: string, updates: Partial<UltimateGoal>) => void
  onRemoveGoal: (goalId: string) => void
  onToggleGoalEnabled: (goalId: string) => void
  onAddTodoToGoal: (goalId: string, todoId: string) => void
  onRemoveTodoFromGoal: (goalId: string, todoId: string) => void
}

/**
 * UltimateGoalPanel - 終極目標設定面板
 *
 * 支援多個目標，每個目標有截止時間並可連結待辦事項。
 * 系統會自動計算需要開始執行的時間，並在接近截止時間時提醒。
 */
export function UltimateGoalPanel({
  goals,
  todos,
  selectedGoalId,
  activeGoal,
  onSelectGoal,
  onAddGoal,
  onUpdateGoal,
  onRemoveGoal,
  onToggleGoalEnabled,
  onAddTodoToGoal,
  onRemoveTodoFromGoal,
}: UltimateGoalPanelProps) {
  // Form state for creating new goal
  const [isCreating, setIsCreating] = useState(goals.length === 0)
  const [newGoalName, setNewGoalName] = useState('')
  const [newTargetTime, setNewTargetTime] = useState('08:00')
  const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([])

  const nameInputRef = useRef<HTMLInputElement>(null)
  const timeInputRef = useRef<HTMLInputElement>(null)

  // Focus name input when entering creation mode
  useEffect(() => {
    if (isCreating && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [isCreating])

  const handleCreateGoal = () => {
    if (!newGoalName.trim() || !newTargetTime) return

    onAddGoal(newGoalName.trim(), newTargetTime, selectedTodoIds)
    setIsCreating(false)
    setNewGoalName('')
    setNewTargetTime('08:00')
    setSelectedTodoIds([])
  }

  const handleCancelCreate = () => {
    setIsCreating(false)
    setNewGoalName('')
    setNewTargetTime('08:00')
    setSelectedTodoIds([])
  }

  const toggleTodoSelection = (todoId: string) => {
    setSelectedTodoIds(prev =>
      prev.includes(todoId)
        ? prev.filter(id => id !== todoId)
        : [...prev, todoId]
    )
  }

  const handleGoalClick = (goalId: string) => {
    onSelectGoal(goalId)
  }

  const handleBackToList = () => {
    onSelectGoal(null)
  }

  // Helper: Format time display (HH:MM)
  const formatTime = (date: Date | null) => {
    if (!date) return '--:--'
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  // Helper: Format countdown display
  const formatCountdown = (minutes: number) => {
    if (minutes < 0) {
      const absMinutes = Math.abs(minutes)
      const hours = Math.floor(absMinutes / 60)
      const mins = absMinutes % 60
      return hours > 0 ? `超時 ${hours}小時${mins}分` : `超時 ${mins}分`
    }

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `剩餘 ${hours}小時${mins}分` : `剩餘 ${mins}分`
  }

  // Helper: Calculate time until goal deadline
  const getGoalTimeRemaining = (goal: UltimateGoal): number => {
    if (!goal.enabled) return 0

    const [hours, minutes] = goal.targetTime.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(hours, minutes, 0, 0)

    if (target < now) {
      target.setDate(target.getDate() + 1)
    }

    return Math.floor((target.getTime() - now.getTime()) / (1000 * 60))
  }

  // Helper: Get urgency color class
  const getUrgencyClass = (minutes: number, overdue: boolean) => {
    if (overdue || minutes < 5) {
      return 'text-red-600 dark:text-red-400'
    }
    if (minutes < 15) {
      return 'text-orange-600 dark:text-orange-400'
    }
    if (minutes < 30) {
      return 'text-yellow-600 dark:text-yellow-500'
    }
    return 'text-green-600 dark:text-green-400'
  }

  // Helper: Get urgency background class for cards
  const getUrgencyBgClass = (minutes: number, overdue: boolean) => {
    if (overdue || minutes < 5) {
      return 'border-red-500 bg-red-50 dark:bg-red-950/20'
    }
    if (minutes < 15) {
      return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
    }
    if (minutes < 30) {
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
    }
    return ''
  }

  // VIEW 1: Empty state - no goals and not creating
  if (goals.length === 0 && !isCreating) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="py-8 text-center space-y-4">
            <Target className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg mb-2">設定終極目標</h3>
              <p className="text-sm text-muted-foreground mb-4">
                建立有截止時間的目標，系統會自動計算開始時間並提醒你
              </p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="w-full max-w-xs">
              <Target className="h-4 w-4 mr-2" />
              建立目標
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // VIEW 2: Creation form
  if (isCreating) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">建立終極目標</h2>
              </div>
              {goals.length > 0 && (
                <Button onClick={handleCancelCreate} variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  返回
                </Button>
              )}
            </div>

            {/* Goal Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">目標名稱</label>
              <Input
                ref={nameInputRef}
                type="text"
                placeholder="例如：出門、上學、交報告"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    timeInputRef.current?.focus()
                  } else if (e.key === 'Escape') {
                    handleCancelCreate()
                  }
                }}
                className="w-full"
                aria-label="輸入目標名稱"
              />
            </div>

            {/* Target Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium">目標時間</label>
              <Input
                ref={timeInputRef}
                type="time"
                value={newTargetTime}
                onChange={(e) => setNewTargetTime(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateGoal()
                  } else if (e.key === 'Escape') {
                    handleCancelCreate()
                  }
                }}
                className="w-full"
                aria-label="設定目標時間"
              />
            </div>

            {/* Todo Selection */}
            {todos.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">包含任務</label>
                <div className="space-y-2 max-h-48 overflow-y-auto rounded-md border p-3">
                  {todos.map((todo) => (
                    <label
                      key={todo.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 p-1 rounded transition-colors"
                    >
                      <Checkbox
                        checked={selectedTodoIds.includes(todo.id)}
                        onCheckedChange={() => toggleTodoSelection(todo.id)}
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {todo.icon && (
                          <TodoIcon name={todo.icon} size={14} className="text-primary shrink-0" />
                        )}
                        <span className="text-sm truncate">{todo.text}</span>
                        {todo.durationMinutes && (
                          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                            {todo.durationMinutes}分
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  選擇需要在目標時間前完成的任務
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleCreateGoal}
                disabled={!newGoalName.trim() || !newTargetTime}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                建立
              </Button>
              <Button onClick={handleCancelCreate} variant="outline" className="flex-1">
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // VIEW 3: Goal detail/edit view
  if (selectedGoalId !== null) {
    const selectedGoal = goals.find(g => g.id === selectedGoalId)

    if (!selectedGoal) {
      handleBackToList()
      return null
    }

    const linkedTodos = todos.filter(t => selectedGoal.todoIds.includes(t.id))
    const availableTodos = todos.filter(t => !selectedGoal.todoIds.includes(t.id))

    const goalProgress = {
      completed: linkedTodos.filter(t => t.completed).length,
      total: linkedTodos.length,
    }

    const goalTotalDuration = linkedTodos.reduce((sum, t) => sum + (t.durationMinutes || 0), 0)

    const goalTimeRemaining = getGoalTimeRemaining(selectedGoal)
    const goalIsOverdue = selectedGoal.enabled && goalTimeRemaining < 0

    // Calculate start time for this goal
    let goalStartTime: Date | null = null
    if (selectedGoal.enabled && linkedTodos.length > 0) {
      const [hours, minutes] = selectedGoal.targetTime.split(':').map(Number)
      const target = new Date()
      target.setHours(hours, minutes, 0, 0)

      if (target < new Date()) {
        target.setDate(target.getDate() + 1)
      }

      const startMs = target.getTime() - (goalTotalDuration * 60 * 1000)
      goalStartTime = new Date(startMs)
    }

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={handleBackToList} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回列表
          </Button>
          <Toggle
            pressed={selectedGoal.enabled}
            onPressedChange={() => onToggleGoalEnabled(selectedGoal.id)}
            variant="outline"
            aria-label={selectedGoal.enabled ? '停用目標' : '啟用目標'}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {selectedGoal.enabled ? '已啟用' : '已停用'}
          </Toggle>
        </div>

        {/* Goal Status Card */}
        <Card className={selectedGoal.enabled && goalIsOverdue ? getUrgencyBgClass(goalTimeRemaining, goalIsOverdue) : ''}>
          <CardContent className="space-y-4">
            {/* Goal Name (Editable) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">目標名稱</label>
              <Input
                type="text"
                value={selectedGoal.name}
                onChange={(e) => onUpdateGoal(selectedGoal.id, { name: e.target.value })}
                className="w-full"
                aria-label="編輯目標名稱"
              />
            </div>

            {/* Target Time (Editable) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">目標時間</label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={selectedGoal.targetTime}
                  onChange={(e) => onUpdateGoal(selectedGoal.id, { targetTime: e.target.value })}
                  className="flex-1"
                  aria-label="編輯目標時間"
                />
                {selectedGoal.enabled && (
                  <div className={`text-sm font-semibold tabular-nums ${getUrgencyClass(goalTimeRemaining, goalIsOverdue)}`}>
                    {formatCountdown(goalTimeRemaining)}
                  </div>
                )}
              </div>
            </div>

            {/* Status Display */}
            {selectedGoal.enabled && linkedTodos.length > 0 && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    建議開始時間
                  </div>
                  <div className="font-mono font-semibold">{formatTime(goalStartTime)}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    任務進度
                  </div>
                  <div className="font-semibold">
                    {goalProgress.completed}/{goalProgress.total} 完成
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    總計時間
                  </div>
                  <div className="font-semibold">{goalTotalDuration} 分鐘</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Target className="h-3 w-3" />
                    目標時間
                  </div>
                  <div className="font-mono font-semibold">{selectedGoal.targetTime}</div>
                </div>
              </div>
            )}

            {/* Overdue Warning */}
            {selectedGoal.enabled && goalIsOverdue && (
              <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-950/40 rounded-md border border-red-300 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  已超過目標時間！還有 {goalProgress.total - goalProgress.completed} 個任務未完成
                </p>
              </div>
            )}

            {/* Progress Bar */}
            {linkedTodos.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>完成進度</span>
                  <span>{goalProgress.total > 0 ? Math.round((goalProgress.completed / goalProgress.total) * 100) : 0}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all duration-300 ${
                      goalIsOverdue ? 'bg-red-500' : 'bg-primary'
                    }`}
                    style={{ width: `${goalProgress.total > 0 ? (goalProgress.completed / goalProgress.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Linked Todos */}
        {linkedTodos.length > 0 && (
          <Card>
            <CardContent className="space-y-3">
              <h3 className="text-sm font-medium">已包含的任務 ({linkedTodos.length})</h3>
              <div className="space-y-2">
                {linkedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-2 p-2 rounded-md border ${
                      todo.completed
                        ? 'border-primary/30 bg-primary/5 opacity-60'
                        : 'border-border'
                    }`}
                  >
                    <Check
                      className={`h-4 w-4 shrink-0 ${
                        todo.completed ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {todo.icon && (
                        <TodoIcon
                          name={todo.icon}
                          size={14}
                          className={todo.completed ? 'text-primary' : 'text-muted-foreground'}
                        />
                      )}
                      <span
                        className={`text-sm flex-1 truncate ${
                          todo.completed ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {todo.text}
                      </span>
                      {todo.durationMinutes && (
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                          {todo.durationMinutes}分
                        </span>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemoveTodoFromGoal(selectedGoal.id, todo.id)}
                      className="h-7 w-7 shrink-0"
                      aria-label="從目標移除"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Todos to Add */}
        {availableTodos.length > 0 && (
          <Card>
            <CardContent className="space-y-3">
              <h3 className="text-sm font-medium">可加入的任務 ({availableTodos.length})</h3>
              <div className="space-y-2">
                {availableTodos.map((todo) => (
                  <button
                    key={todo.id}
                    onClick={() => onAddTodoToGoal(selectedGoal.id, todo.id)}
                    className="flex items-center gap-2 p-2 rounded-md border border-border hover:bg-muted/30 transition-colors w-full text-left"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {todo.icon && (
                        <TodoIcon name={todo.icon} size={14} className="text-muted-foreground shrink-0" />
                      )}
                      <span className="text-sm flex-1 truncate">{todo.text}</span>
                      {todo.durationMinutes && (
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                          {todo.durationMinutes}分
                        </span>
                      )}
                    </div>
                    <Plus className="h-4 w-4 text-primary shrink-0" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delete Goal Button */}
        <Button
          onClick={() => {
            onRemoveGoal(selectedGoal.id)
            handleBackToList()
          }}
          variant="outline"
          className="w-full text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          刪除目標
        </Button>
      </div>
    )
  }

  // VIEW 4: Goals list view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          終極目標 ({goals.length})
        </h2>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const isActive = activeGoal?.id === goal.id
          const timeRemaining = getGoalTimeRemaining(goal)
          const isGoalOverdue = goal.enabled && timeRemaining < 0
          const linkedTodos = todos.filter(t => goal.todoIds.includes(t.id))
          const completedCount = linkedTodos.filter(t => t.completed).length

          return (
            <Card
              key={goal.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isActive ? 'ring-2 ring-primary' : ''
              } ${goal.enabled ? getUrgencyBgClass(timeRemaining, isGoalOverdue) : ''}`}
              onClick={() => handleGoalClick(goal.id)}
            >
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{goal.name}</h3>
                      {isActive && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full shrink-0">
                          進行中
                        </span>
                      )}
                      {!goal.enabled && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full shrink-0">
                          已停用
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-mono">{goal.targetTime}</span>
                      {goal.enabled && (
                        <>
                          <span>•</span>
                          <span className={getUrgencyClass(timeRemaining, isGoalOverdue)}>
                            {formatCountdown(timeRemaining)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Toggle
                    pressed={goal.enabled}
                    onPressedChange={() => onToggleGoalEnabled(goal.id)}
                    onClick={(e) => e.stopPropagation()}
                    variant="outline"
                    size="sm"
                    aria-label={goal.enabled ? '停用目標' : '啟用目標'}
                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground shrink-0"
                  >
                    {goal.enabled ? '啟用' : '停用'}
                  </Toggle>
                </div>

                {/* Progress Bar */}
                {linkedTodos.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{completedCount}/{linkedTodos.length} 任務完成</span>
                      <span>{linkedTodos.length > 0 ? Math.round((completedCount / linkedTodos.length) * 100) : 0}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isGoalOverdue ? 'bg-red-500' : 'bg-primary'
                        }`}
                        style={{ width: `${linkedTodos.length > 0 ? (completedCount / linkedTodos.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add New Goal Button */}
      <Button
        onClick={() => setIsCreating(true)}
        variant="outline"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        新增目標
      </Button>
    </div>
  )
}
