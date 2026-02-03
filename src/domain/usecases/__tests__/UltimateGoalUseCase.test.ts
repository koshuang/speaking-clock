import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UltimateGoalUseCase } from '../UltimateGoalUseCase'
import type { UltimateGoalRepository } from '../../ports/UltimateGoalRepository'
import type { UltimateGoal, GoalList } from '../../entities/UltimateGoal'
import type { TodoList } from '../../entities/Todo'

describe('UltimateGoalUseCase', () => {
  let mockRepository: UltimateGoalRepository
  let useCase: UltimateGoalUseCase
  let mockGoal: UltimateGoal
  let mockGoalList: GoalList
  let mockTodoList: TodoList

  beforeEach(() => {
    mockGoal = {
      id: 'goal-1',
      name: '出門',
      targetTime: '07:50',
      enabled: true,
      todoIds: ['todo-1', 'todo-2'],
      reminderIntervals: [30, 15, 5],
      createdAt: Date.now(),
    }

    mockGoalList = {
      goals: [mockGoal],
    }

    mockTodoList = {
      items: [
        { id: 'todo-1', text: '刷牙', durationMinutes: 5, completed: false, order: 0, createdAt: 1000 },
        { id: 'todo-2', text: '穿衣服', durationMinutes: 10, completed: true, order: 1, createdAt: 2000 },
        { id: 'todo-3', text: '其他', durationMinutes: 15, completed: false, order: 2, createdAt: 3000 },
      ],
    }

    mockRepository = {
      load: vi.fn().mockReturnValue(mockGoalList),
      save: vi.fn(),
    }

    useCase = new UltimateGoalUseCase(mockRepository)
  })

  describe('load', () => {
    it('應該從 repository 載入目標列表', () => {
      const result = useCase.load()

      expect(mockRepository.load).toHaveBeenCalled()
      expect(result).toEqual(mockGoalList)
      expect(result.goals).toHaveLength(1)
      expect(result.goals[0]).toEqual(mockGoal)
    })

    it('如果沒有目標應該回傳空列表', () => {
      mockRepository.load = vi.fn().mockReturnValue({ goals: [] })

      const result = useCase.load()

      expect(result.goals).toHaveLength(0)
    })
  })

  describe('save', () => {
    it('應該儲存目標列表到 repository', () => {
      useCase.save(mockGoalList)

      expect(mockRepository.save).toHaveBeenCalledWith(mockGoalList)
    })
  })

  describe('addGoal', () => {
    it('應該新增目標到列表', () => {
      const newGoal: UltimateGoal = {
        id: 'goal-2',
        name: '上班',
        targetTime: '08:30',
        enabled: true,
        todoIds: [],
        reminderIntervals: [15, 5],
        createdAt: Date.now(),
      }

      const result = useCase.addGoal(mockGoalList, newGoal)

      expect(result.goals).toHaveLength(2)
      expect(result.goals[1]).toEqual(newGoal)
      expect(mockRepository.save).toHaveBeenCalledWith(result)
    })
  })

  describe('updateGoal', () => {
    it('應該更新指定目標', () => {
      const updates = {
        name: '出門上班',
        targetTime: '08:00',
      }

      const result = useCase.updateGoal(mockGoalList, 'goal-1', updates)

      expect(result.goals[0].name).toBe('出門上班')
      expect(result.goals[0].targetTime).toBe('08:00')
      expect(mockRepository.save).toHaveBeenCalledWith(result)
    })

    it('不影響其他目標', () => {
      const goal2: UltimateGoal = {
        id: 'goal-2',
        name: '睡覺',
        targetTime: '23:00',
        enabled: true,
        todoIds: [],
        reminderIntervals: [30],
        createdAt: Date.now(),
      }

      const listWithTwoGoals = { goals: [mockGoal, goal2] }

      const result = useCase.updateGoal(listWithTwoGoals, 'goal-1', { name: '新名稱' })

      expect(result.goals[0].name).toBe('新名稱')
      expect(result.goals[1].name).toBe('睡覺')
    })
  })

  describe('removeGoal', () => {
    it('應該移除指定目標', () => {
      const result = useCase.removeGoal(mockGoalList, 'goal-1')

      expect(result.goals).toHaveLength(0)
      expect(mockRepository.save).toHaveBeenCalledWith(result)
    })

    it('不影響其他目標', () => {
      const goal2: UltimateGoal = {
        id: 'goal-2',
        name: '睡覺',
        targetTime: '23:00',
        enabled: true,
        todoIds: [],
        reminderIntervals: [30],
        createdAt: Date.now(),
      }

      const listWithTwoGoals = { goals: [mockGoal, goal2] }

      const result = useCase.removeGoal(listWithTwoGoals, 'goal-1')

      expect(result.goals).toHaveLength(1)
      expect(result.goals[0].id).toBe('goal-2')
    })
  })

  describe('getGoalById', () => {
    it('應該回傳指定 ID 的目標', () => {
      const result = useCase.getGoalById(mockGoalList, 'goal-1')

      expect(result).toEqual(mockGoal)
    })

    it('找不到時應該回傳 undefined', () => {
      const result = useCase.getGoalById(mockGoalList, 'non-existent')

      expect(result).toBeUndefined()
    })
  })

  describe('getEnabledGoals', () => {
    it('應該只回傳啟用的目標', () => {
      const disabledGoal: UltimateGoal = {
        id: 'goal-2',
        name: '停用目標',
        targetTime: '10:00',
        enabled: false,
        todoIds: [],
        reminderIntervals: [10],
        createdAt: Date.now(),
      }

      const listWithDisabled = { goals: [mockGoal, disabledGoal] }

      const result = useCase.getEnabledGoals(listWithDisabled)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('goal-1')
    })

    it('全部停用時應該回傳空陣列', () => {
      const disabledList = {
        goals: [{ ...mockGoal, enabled: false }],
      }

      const result = useCase.getEnabledGoals(disabledList)

      expect(result).toHaveLength(0)
    })
  })

  describe('getNextUpcomingGoal', () => {
    it('應該回傳最接近的啟用目標', () => {
      const goal2: UltimateGoal = {
        id: 'goal-2',
        name: '上班',
        targetTime: '08:30',
        enabled: true,
        todoIds: [],
        reminderIntervals: [15],
        createdAt: Date.now(),
      }

      const listWithTwoGoals = { goals: [mockGoal, goal2] }

      // 現在時間 07:00，goal-1 (07:50) 更近
      const currentTime = new Date()
      currentTime.setHours(7, 0, 0, 0)

      const result = useCase.getNextUpcomingGoal(listWithTwoGoals, currentTime)

      expect(result?.id).toBe('goal-1')
    })

    it('應該排除已經超時超過 60 分鐘的目標', () => {
      const currentTime = new Date()
      currentTime.setHours(9, 0, 0, 0) // 09:00，goal-1 (07:50) 已超時 70 分鐘

      const result = useCase.getNextUpcomingGoal(mockGoalList, currentTime)

      expect(result).toBeNull()
    })

    it('應該包含 60 分鐘內超時的目標', () => {
      const currentTime = new Date()
      currentTime.setHours(8, 30, 0, 0) // 08:30，goal-1 (07:50) 超時 40 分鐘

      const result = useCase.getNextUpcomingGoal(mockGoalList, currentTime)

      expect(result?.id).toBe('goal-1')
    })

    it('沒有啟用目標時應該回傳 null', () => {
      const disabledList = { goals: [{ ...mockGoal, enabled: false }] }

      const result = useCase.getNextUpcomingGoal(disabledList)

      expect(result).toBeNull()
    })
  })

  describe('calculateStartTime', () => {
    it('應該根據目標時間和待辦事項總時長計算開始時間', () => {
      // 目標時間: 07:50
      // todo-1 (關聯): 5 分鐘
      // todo-2 (關聯): 10 分鐘
      // todo-3 (未關聯): 15 分鐘
      // 總時長: 15 分鐘
      // 建議開始時間: 07:35

      const result = useCase.calculateStartTime(mockGoal, mockTodoList.items)

      expect(result.getHours()).toBe(7)
      expect(result.getMinutes()).toBe(35)
    })

    it('目標時間為 23:00，需要 30 分鐘，應該計算為 22:30', () => {
      const lateGoal: UltimateGoal = {
        ...mockGoal,
        targetTime: '23:00',
      }

      const todos = [
        { id: 'todo-1', text: '任務', durationMinutes: 30, completed: false, order: 0, createdAt: 1000 },
      ]

      lateGoal.todoIds = ['todo-1']

      const result = useCase.calculateStartTime(lateGoal, todos)

      expect(result.getHours()).toBe(22)
      expect(result.getMinutes()).toBe(30)
    })

    it('沒有待辦事項時應該回傳目標時間', () => {
      const goalWithNoTodos: UltimateGoal = {
        ...mockGoal,
        todoIds: [],
      }

      const result = useCase.calculateStartTime(goalWithNoTodos, mockTodoList.items)

      expect(result.getHours()).toBe(7)
      expect(result.getMinutes()).toBe(50)
    })
  })

  describe('getTotalDurationMinutes', () => {
    it('應該計算關聯待辦事項的總時長', () => {
      // todo-1: 5 分鐘
      // todo-2: 10 分鐘
      // 總計: 15 分鐘
      const result = useCase.getTotalDurationMinutes(mockGoal, mockTodoList.items)

      expect(result).toBe(15)
    })

    it('沒有關聯待辦事項時應該回傳 0', () => {
      const goalWithNoTodos: UltimateGoal = {
        ...mockGoal,
        todoIds: [],
      }

      const result = useCase.getTotalDurationMinutes(goalWithNoTodos, mockTodoList.items)

      expect(result).toBe(0)
    })

    it('應該忽略未關聯的待辦事項', () => {
      // todo-3 (15 分鐘) 未關聯，應該被忽略
      const goalWithOneTodo: UltimateGoal = {
        ...mockGoal,
        todoIds: ['todo-1'], // 只有 todo-1 (5 分鐘)
      }

      const result = useCase.getTotalDurationMinutes(goalWithOneTodo, mockTodoList.items)

      expect(result).toBe(5)
    })

    it('待辦事項沒有 durationMinutes 時應該視為 0', () => {
      const todosWithoutDuration: TodoList = {
        items: [
          { id: 'todo-1', text: '無時長', completed: false, order: 0, createdAt: 1000 },
        ],
      }

      const result = useCase.getTotalDurationMinutes(mockGoal, todosWithoutDuration.items)

      expect(result).toBe(0)
    })
  })

  describe('getTimeUntilDeadline', () => {
    it('應該計算距離截止時間的分鐘數', () => {
      // 目標時間: 07:50
      // 現在時間: 07:00
      // 剩餘時間: 50 分鐘
      const currentTime = new Date()
      currentTime.setHours(7, 0, 0, 0)

      const result = useCase.getTimeUntilDeadline(mockGoal, currentTime)

      expect(result).toBe(50)
    })

    it('已經超過截止時間應該回傳負數', () => {
      // 目標時間: 07:50
      // 現在時間: 08:00
      // 剩餘時間: -10 分鐘
      const currentTime = new Date()
      currentTime.setHours(8, 0, 0, 0)

      const result = useCase.getTimeUntilDeadline(mockGoal, currentTime)

      expect(result).toBe(-10)
    })

    it('剛好到達截止時間應該回傳 0', () => {
      const currentTime = new Date()
      currentTime.setHours(7, 50, 0, 0)

      const result = useCase.getTimeUntilDeadline(mockGoal, currentTime)

      expect(result).toBe(0)
    })
  })

  describe('shouldRemind', () => {
    it('在提醒間隔時應該回傳 true', () => {
      // 剩餘 30 分鐘，符合 reminderIntervals [30, 15, 5]
      const currentTime = new Date()
      currentTime.setHours(7, 20, 0, 0)

      const result = useCase.shouldRemind(mockGoal, currentTime)

      expect(result.shouldRemind).toBe(true)
      expect(result.minutesLeft).toBe(30)
    })

    it('在提醒間隔 15 分鐘時應該提醒', () => {
      const currentTime = new Date()
      currentTime.setHours(7, 35, 0, 0)

      const result = useCase.shouldRemind(mockGoal, currentTime)

      expect(result.shouldRemind).toBe(true)
      expect(result.minutesLeft).toBe(15)
    })

    it('在提醒間隔 5 分鐘時應該提醒', () => {
      const currentTime = new Date()
      currentTime.setHours(7, 45, 0, 0)

      const result = useCase.shouldRemind(mockGoal, currentTime)

      expect(result.shouldRemind).toBe(true)
      expect(result.minutesLeft).toBe(5)
    })

    it('不在提醒間隔時應該回傳 false', () => {
      // 剩餘 20 分鐘，不在 [30, 15, 5] 內
      const currentTime = new Date()
      currentTime.setHours(7, 30, 0, 0)

      const result = useCase.shouldRemind(mockGoal, currentTime)

      expect(result.shouldRemind).toBe(false)
      expect(result.minutesLeft).toBe(20)
    })

    it('已經超過截止時間不應該提醒', () => {
      const currentTime = new Date()
      currentTime.setHours(8, 0, 0, 0)

      const result = useCase.shouldRemind(mockGoal, currentTime)

      expect(result.shouldRemind).toBe(false)
      expect(result.minutesLeft).toBe(0)
    })

    it('在提醒間隔前後 30 秒內都應該提醒', () => {
      // 剩餘 30.5 分鐘，在 30 分鐘的誤差範圍內
      const currentTime = new Date()
      currentTime.setHours(7, 19, 30, 0) // 7:50 - 30.5 分鐘

      const result = useCase.shouldRemind(mockGoal, currentTime)

      expect(result.shouldRemind).toBe(true)
    })
  })

  describe('getRemainingTodos', () => {
    it('應該回傳關聯且未完成的待辦事項', () => {
      // todo-1: 關聯且未完成 ✓
      // todo-2: 關聯但已完成 ✗
      // todo-3: 未關聯 ✗
      const result = useCase.getRemainingTodos(mockGoal, mockTodoList)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('todo-1')
    })

    it('應該依 order 排序', () => {
      const unorderedTodoList: TodoList = {
        items: [
          { id: 'todo-1', text: '任務1', completed: false, order: 2, createdAt: 1000 },
          { id: 'todo-2', text: '任務2', completed: false, order: 0, createdAt: 2000 },
          { id: 'todo-3', text: '任務3', completed: false, order: 1, createdAt: 3000 },
        ],
      }

      const goal: UltimateGoal = {
        ...mockGoal,
        todoIds: ['todo-1', 'todo-2', 'todo-3'],
      }

      const result = useCase.getRemainingTodos(goal, unorderedTodoList)

      expect(result[0].id).toBe('todo-2') // order 0
      expect(result[1].id).toBe('todo-3') // order 1
      expect(result[2].id).toBe('todo-1') // order 2
    })

    it('全部完成時應該回傳空陣列', () => {
      const allCompletedList: TodoList = {
        items: [
          { id: 'todo-1', text: '已完成', completed: true, order: 0, createdAt: 1000 },
          { id: 'todo-2', text: '已完成', completed: true, order: 1, createdAt: 2000 },
        ],
      }

      const result = useCase.getRemainingTodos(mockGoal, allCompletedList)

      expect(result).toHaveLength(0)
    })

    it('沒有關聯的待辦事項時應該回傳空陣列', () => {
      const goalWithNoTodos: UltimateGoal = {
        ...mockGoal,
        todoIds: [],
      }

      const result = useCase.getRemainingTodos(goalWithNoTodos, mockTodoList)

      expect(result).toHaveLength(0)
    })
  })

  describe('getCompletedCount', () => {
    it('應該回傳已完成和總數', () => {
      // todo-1: 關聯且未完成
      // todo-2: 關聯且已完成
      // 總計: 1/2 完成
      const result = useCase.getCompletedCount(mockGoal, mockTodoList)

      expect(result.completed).toBe(1)
      expect(result.total).toBe(2)
    })

    it('全部完成時應該回傳相同數字', () => {
      const allCompletedList: TodoList = {
        items: [
          { id: 'todo-1', text: '已完成1', completed: true, order: 0, createdAt: 1000 },
          { id: 'todo-2', text: '已完成2', completed: true, order: 1, createdAt: 2000 },
        ],
      }

      const result = useCase.getCompletedCount(mockGoal, allCompletedList)

      expect(result.completed).toBe(2)
      expect(result.total).toBe(2)
    })

    it('全部未完成時 completed 應該為 0', () => {
      const allUncompletedList: TodoList = {
        items: [
          { id: 'todo-1', text: '未完成1', completed: false, order: 0, createdAt: 1000 },
          { id: 'todo-2', text: '未完成2', completed: false, order: 1, createdAt: 2000 },
        ],
      }

      const result = useCase.getCompletedCount(mockGoal, allUncompletedList)

      expect(result.completed).toBe(0)
      expect(result.total).toBe(2)
    })

    it('沒有關聯待辦事項時應該回傳 0/0', () => {
      const goalWithNoTodos: UltimateGoal = {
        ...mockGoal,
        todoIds: [],
      }

      const result = useCase.getCompletedCount(goalWithNoTodos, mockTodoList)

      expect(result.completed).toBe(0)
      expect(result.total).toBe(0)
    })

    it('應該只計算關聯的待辦事項', () => {
      // todo-3 未關聯，不應該被計入
      const result = useCase.getCompletedCount(mockGoal, mockTodoList)

      expect(result.total).toBe(2) // 只有 todo-1 和 todo-2
    })
  })

  describe('isOverdue', () => {
    it('超過截止時間應該回傳 true', () => {
      const currentTime = new Date()
      currentTime.setHours(8, 0, 0, 0) // 08:00 > 07:50

      const result = useCase.isOverdue(mockGoal, currentTime)

      expect(result).toBe(true)
    })

    it('未到截止時間應該回傳 false', () => {
      const currentTime = new Date()
      currentTime.setHours(7, 0, 0, 0) // 07:00 < 07:50

      const result = useCase.isOverdue(mockGoal, currentTime)

      expect(result).toBe(false)
    })

    it('剛好到達截止時間應該回傳 false', () => {
      const currentTime = new Date()
      currentTime.setHours(7, 50, 0, 0) // 07:50 = 07:50

      const result = useCase.isOverdue(mockGoal, currentTime)

      expect(result).toBe(false)
    })
  })
})
