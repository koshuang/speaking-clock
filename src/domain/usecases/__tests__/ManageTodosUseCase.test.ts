import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ManageTodosUseCase } from '../ManageTodosUseCase'
import type { TodoRepository } from '../../ports/TodoRepository'
import type { TodoList } from '../../entities/Todo'

describe('ManageTodosUseCase', () => {
  let mockTodoRepository: TodoRepository
  let useCase: ManageTodosUseCase
  let mockTodoList: TodoList

  beforeEach(() => {
    mockTodoList = {
      items: [
        { id: '1', text: '待辦事項一', completed: false, order: 0, createdAt: 1000 },
        { id: '2', text: '待辦事項二', completed: true, order: 1, createdAt: 2000 },
        { id: '3', text: '待辦事項三', completed: false, order: 2, createdAt: 3000 },
      ],
    }

    mockTodoRepository = {
      load: vi.fn().mockReturnValue(mockTodoList),
      save: vi.fn(),
    }

    useCase = new ManageTodosUseCase(mockTodoRepository)
  })

  describe('load', () => {
    it('應該從 repository 載入待辦清單', () => {
      const result = useCase.load()

      expect(mockTodoRepository.load).toHaveBeenCalled()
      expect(result).toEqual(mockTodoList)
    })
  })

  describe('add', () => {
    it('應該新增待辦事項並儲存', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('new-id-00-00-00-00' as `${string}-${string}-${string}-${string}-${string}`)
      vi.spyOn(Date, 'now').mockReturnValue(5000)

      const result = useCase.add({ items: [] }, '新待辦事項')

      expect(result.items).toHaveLength(1)
      expect(result.items[0]).toEqual({
        id: 'new-id-00-00-00-00',
        text: '新待辦事項',
        completed: false,
        order: 0,
        createdAt: 5000,
      })
      expect(mockTodoRepository.save).toHaveBeenCalledWith(result)
    })

    it('新增時 order 應該比現有最大 order 大 1', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('new-id-00-00-00-00' as `${string}-${string}-${string}-${string}-${string}`)

      const result = useCase.add(mockTodoList, '新待辦事項')

      const newItem = result.items.find((item) => item.id === 'new-id-00-00-00-00')
      expect(newItem?.order).toBe(3) // 現有最大 order 是 2
    })

    it('應該去除文字前後空白', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('new-id-00-00-00-00' as `${string}-${string}-${string}-${string}-${string}`)

      const result = useCase.add({ items: [] }, '  新待辦事項  ')

      expect(result.items[0].text).toBe('新待辦事項')
    })

    it('應該支援新增帶圖示的待辦事項', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('new-id-00-00-00-00' as `${string}-${string}-${string}-${string}-${string}`)
      vi.spyOn(Date, 'now').mockReturnValue(5000)

      const result = useCase.add({ items: [] }, '寫功課', 'BookOpen')

      expect(result.items[0]).toEqual({
        id: 'new-id-00-00-00-00',
        text: '寫功課',
        icon: 'BookOpen',
        completed: false,
        order: 0,
        createdAt: 5000,
      })
    })

    it('新增時不傳圖示應該為 undefined', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('new-id-00-00-00-00' as `${string}-${string}-${string}-${string}-${string}`)

      const result = useCase.add({ items: [] }, '待辦事項')

      expect(result.items[0].icon).toBeUndefined()
    })
  })

  describe('update', () => {
    it('應該更新指定待辦事項的文字並儲存', () => {
      const result = useCase.update(mockTodoList, '1', '更新後的文字')

      const updatedItem = result.items.find((item) => item.id === '1')
      expect(updatedItem?.text).toBe('更新後的文字')
      expect(mockTodoRepository.save).toHaveBeenCalledWith(result)
    })

    it('應該去除更新文字的前後空白', () => {
      const result = useCase.update(mockTodoList, '1', '  更新後  ')

      const updatedItem = result.items.find((item) => item.id === '1')
      expect(updatedItem?.text).toBe('更新後')
    })

    it('應該支援更新待辦事項的圖示', () => {
      const result = useCase.update(mockTodoList, '1', '寫功課', 'BookOpen')

      const updatedItem = result.items.find((item) => item.id === '1')
      expect(updatedItem?.text).toBe('寫功課')
      expect(updatedItem?.icon).toBe('BookOpen')
    })

    it('應該支援移除待辦事項的圖示', () => {
      const listWithIcon = {
        items: [
          { id: '1', text: '待辦事項', icon: 'BookOpen', completed: false, order: 0, createdAt: 1000 },
        ],
      }

      const result = useCase.update(listWithIcon, '1', '待辦事項', undefined)

      const updatedItem = result.items.find((item) => item.id === '1')
      expect(updatedItem?.icon).toBeUndefined()
    })
  })

  describe('remove', () => {
    it('應該刪除指定待辦事項並儲存', () => {
      const result = useCase.remove(mockTodoList, '2')

      expect(result.items).toHaveLength(2)
      expect(result.items.find((item) => item.id === '2')).toBeUndefined()
      expect(mockTodoRepository.save).toHaveBeenCalledWith(result)
    })
  })

  describe('toggle', () => {
    it('應該切換待辦事項的完成狀態並儲存', () => {
      const result = useCase.toggle(mockTodoList, '1')

      const toggledItem = result.items.find((item) => item.id === '1')
      expect(toggledItem?.completed).toBe(true)
      expect(mockTodoRepository.save).toHaveBeenCalledWith(result)
    })

    it('應該將已完成項目切換為未完成', () => {
      const result = useCase.toggle(mockTodoList, '2')

      const toggledItem = result.items.find((item) => item.id === '2')
      expect(toggledItem?.completed).toBe(false)
    })
  })

  describe('reorder', () => {
    it('應該重新排序待辦事項並儲存', () => {
      const result = useCase.reorder(mockTodoList, 0, 2)

      const sortedItems = [...result.items].sort((a, b) => a.order - b.order)
      expect(sortedItems[0].id).toBe('2')
      expect(sortedItems[1].id).toBe('3')
      expect(sortedItems[2].id).toBe('1')
      expect(mockTodoRepository.save).toHaveBeenCalledWith(result)
    })

    it('移動後所有項目的 order 應該連續', () => {
      const result = useCase.reorder(mockTodoList, 2, 0)

      const orders = result.items.map((item) => item.order).sort((a, b) => a - b)
      expect(orders).toEqual([0, 1, 2])
    })
  })

  describe('getNextUncompleted', () => {
    it('應該回傳下一個未完成的待辦事項（依 order 排序）', () => {
      const result = useCase.getNextUncompleted(mockTodoList)

      expect(result?.id).toBe('1') // order 0, 未完成
    })

    it('如果第一個未完成，應該跳過已完成項目', () => {
      const todoListWithFirstCompleted: TodoList = {
        items: [
          { id: '1', text: '已完成', completed: true, order: 0, createdAt: 1000 },
          { id: '2', text: '未完成', completed: false, order: 1, createdAt: 2000 },
        ],
      }

      const result = useCase.getNextUncompleted(todoListWithFirstCompleted)

      expect(result?.id).toBe('2')
    })

    it('如果全部完成，應該回傳 null', () => {
      const allCompletedList: TodoList = {
        items: [
          { id: '1', text: '已完成一', completed: true, order: 0, createdAt: 1000 },
          { id: '2', text: '已完成二', completed: true, order: 1, createdAt: 2000 },
        ],
      }

      const result = useCase.getNextUncompleted(allCompletedList)

      expect(result).toBeNull()
    })

    it('如果清單為空，應該回傳 null', () => {
      const result = useCase.getNextUncompleted({ items: [] })

      expect(result).toBeNull()
    })
  })

  describe('getSortedItems', () => {
    it('應該回傳依 order 排序的項目', () => {
      const unorderedList: TodoList = {
        items: [
          { id: '1', text: '項目一', completed: false, order: 2, createdAt: 1000 },
          { id: '2', text: '項目二', completed: false, order: 0, createdAt: 2000 },
          { id: '3', text: '項目三', completed: false, order: 1, createdAt: 3000 },
        ],
      }

      const result = useCase.getSortedItems(unorderedList)

      expect(result[0].id).toBe('2') // order 0
      expect(result[1].id).toBe('3') // order 1
      expect(result[2].id).toBe('1') // order 2
    })
  })

  describe('getUncompletedCount', () => {
    it('應該回傳未完成項目的數量', () => {
      // mockTodoList 有 2 個未完成，1 個已完成
      const result = useCase.getUncompletedCount(mockTodoList)
      expect(result).toBe(2)
    })

    it('全部完成時應該回傳 0', () => {
      const allCompletedList: TodoList = {
        items: [
          { id: '1', text: '已完成一', completed: true, order: 0, createdAt: 1000 },
          { id: '2', text: '已完成二', completed: true, order: 1, createdAt: 2000 },
        ],
      }

      const result = useCase.getUncompletedCount(allCompletedList)
      expect(result).toBe(0)
    })

    it('全部未完成時應該回傳總數', () => {
      const allUncompletedList: TodoList = {
        items: [
          { id: '1', text: '未完成一', completed: false, order: 0, createdAt: 1000 },
          { id: '2', text: '未完成二', completed: false, order: 1, createdAt: 2000 },
          { id: '3', text: '未完成三', completed: false, order: 2, createdAt: 3000 },
        ],
      }

      const result = useCase.getUncompletedCount(allUncompletedList)
      expect(result).toBe(3)
    })

    it('清單為空時應該回傳 0', () => {
      const result = useCase.getUncompletedCount({ items: [] })
      expect(result).toBe(0)
    })
  })
})
