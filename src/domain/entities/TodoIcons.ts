export const TODO_ICONS = {
  school: ['Backpack', 'Bus', 'School', 'BookOpen', 'NotebookPen', 'ClipboardList'],
  learning: ['Pencil', 'GraduationCap', 'Calculator', 'Ruler', 'Languages', 'FileText'],
  art: ['Palette', 'Scissors', 'Brush', 'Shapes'],
  science: ['FlaskConical', 'Globe', 'Microscope', 'Atom'],
  music: ['Music', 'Piano', 'Headphones', 'Mic'],
  sports: ['Bike', 'Trophy', 'Dumbbell', 'Medal'],
  life: ['Bath', 'Bed', 'Shirt', 'Sun', 'Moon', 'Alarm'],
  food: ['Apple', 'Coffee', 'Utensils', 'Milk', 'Cookie', 'Sandwich'],
  play: ['Gamepad2', 'Tv', 'Puzzle', 'Blocks', 'Dices'],
  pets: ['Dog', 'Cat', 'Fish', 'Bird'],
  outdoor: ['Trees', 'Flower2', 'Cloud', 'Umbrella'],
  cleaning: ['Trash2', 'Sparkles', 'SprayCan'],
  general: ['Star', 'Heart', 'Clock', 'Bell', 'Gift', 'Camera', 'Phone'],
} as const

export const TODO_ICON_LABELS: Record<string, string> = {
  school: '上學',
  learning: '學習',
  art: '美術',
  science: '科學',
  music: '音樂',
  sports: '運動',
  life: '生活',
  food: '飲食',
  play: '玩樂',
  pets: '寵物',
  outdoor: '戶外',
  cleaning: '清潔',
  general: '其他',
}

export type TodoIconCategory = keyof typeof TODO_ICONS
export type TodoIconName = (typeof TODO_ICONS)[TodoIconCategory][number]
