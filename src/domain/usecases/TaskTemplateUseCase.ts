import type { TaskCategory, TaskTemplate } from '../entities/TaskTemplate'
import { DEFAULT_TASK_TEMPLATES } from '../entities/TaskTemplate'

/**
 * Domain use case for task templates
 * Manages predefined task templates and provides filtering capabilities
 */
export class TaskTemplateUseCase {
  /**
   * Get all available task templates
   *
   * @returns Array of all task templates
   */
  getTemplates(): TaskTemplate[] {
    return DEFAULT_TASK_TEMPLATES
  }

  /**
   * Get task templates filtered by category
   *
   * @param category - Category to filter by
   * @returns Array of templates in the specified category
   */
  getTemplatesByCategory(category: TaskCategory): TaskTemplate[] {
    return DEFAULT_TASK_TEMPLATES.filter(template => template.category === category)
  }

  /**
   * Get a specific template by its ID
   *
   * @param id - Template ID to search for
   * @returns Template if found, undefined otherwise
   */
  getTemplateById(id: string): TaskTemplate | undefined {
    return DEFAULT_TASK_TEMPLATES.find(template => template.id === id)
  }

  /**
   * Get all unique categories from available templates
   *
   * @returns Array of unique task categories
   */
  getCategories(): TaskCategory[] {
    const categorySet = new Set<TaskCategory>(
      DEFAULT_TASK_TEMPLATES.map(template => template.category)
    )
    return Array.from(categorySet)
  }
}
