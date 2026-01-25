export type TaskCategory = 'learning' | 'self-care' | 'daily' | 'play';

export interface TaskTemplate {
  id: string;
  name: string;
  icon: string;
  durationMinutes: number;
  category: TaskCategory;
}

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  learning: '學習',
  'self-care': '自我照顧',
  daily: '日常',
  play: '遊戲',
};

export const DEFAULT_TASK_TEMPLATES: TaskTemplate[] = [
  // 日常
  {
    id: 'breakfast',
    name: '吃早餐',
    icon: 'Utensils',
    durationMinutes: 20,
    category: 'daily',
  },
  {
    id: 'lunch',
    name: '吃午餐',
    icon: 'Utensils',
    durationMinutes: 20,
    category: 'daily',
  },
  {
    id: 'dinner',
    name: '吃晚餐',
    icon: 'Utensils',
    durationMinutes: 20,
    category: 'daily',
  },
  {
    id: 'clean-toys',
    name: '收玩具',
    icon: 'Sparkles',
    durationMinutes: 10,
    category: 'daily',
  },
  {
    id: 'pack-bag',
    name: '整理書包',
    icon: 'Backpack',
    durationMinutes: 10,
    category: 'daily',
  },
  {
    id: 'tidy-room',
    name: '整理房間',
    icon: 'Home',
    durationMinutes: 15,
    category: 'daily',
  },
  {
    id: 'fold-clothes',
    name: '摺衣服',
    icon: 'Shirt',
    durationMinutes: 10,
    category: 'daily',
  },
  {
    id: 'water-plants',
    name: '澆花',
    icon: 'Flower2',
    durationMinutes: 5,
    category: 'daily',
  },
  {
    id: 'set-table',
    name: '擺碗筷',
    icon: 'Utensils',
    durationMinutes: 5,
    category: 'daily',
  },
  {
    id: 'take-trash',
    name: '倒垃圾',
    icon: 'Trash2',
    durationMinutes: 5,
    category: 'daily',
  },
  // 學習
  {
    id: 'homework',
    name: '寫功課',
    icon: 'BookOpen',
    durationMinutes: 30,
    category: 'learning',
  },
  {
    id: 'reading',
    name: '看書閱讀',
    icon: 'BookOpen',
    durationMinutes: 15,
    category: 'learning',
  },
  {
    id: 'practice-piano',
    name: '練鋼琴',
    icon: 'Music',
    durationMinutes: 30,
    category: 'learning',
  },
  {
    id: 'english',
    name: '學英文',
    icon: 'Languages',
    durationMinutes: 20,
    category: 'learning',
  },
  // 自我照顧
  {
    id: 'brush-teeth',
    name: '刷牙洗臉',
    icon: 'Bath',
    durationMinutes: 5,
    category: 'self-care',
  },
  {
    id: 'bedtime',
    name: '準備睡覺',
    icon: 'Moon',
    durationMinutes: 15,
    category: 'self-care',
  },
  {
    id: 'get-dressed',
    name: '穿衣服',
    icon: 'Shirt',
    durationMinutes: 5,
    category: 'self-care',
  },
  // 遊戲
  {
    id: 'free-play',
    name: '自由玩耍',
    icon: 'Gamepad2',
    durationMinutes: 30,
    category: 'play',
  },
  {
    id: 'outdoor-play',
    name: '戶外活動',
    icon: 'Trees',
    durationMinutes: 30,
    category: 'play',
  },
  {
    id: 'drawing',
    name: '畫畫',
    icon: 'Palette',
    durationMinutes: 20,
    category: 'play',
  },
  {
    id: 'tablet',
    name: '玩平板',
    icon: 'Tablet',
    durationMinutes: 30,
    category: 'play',
  },
  {
    id: 'phone',
    name: '玩手機',
    icon: 'Smartphone',
    durationMinutes: 30,
    category: 'play',
  },
];
