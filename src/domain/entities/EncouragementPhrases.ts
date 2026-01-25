export type EncouragementType = 'completion' | 'progress' | 'start';

export const ENCOURAGEMENT_PHRASES: Record<EncouragementType, readonly string[]> = {
  completion: [
    '做得好！你真棒！',
    '太厲害了！',
    '好棒！繼續加油！',
    '完成了！你好厲害！',
    '讚！做得很好！',
    '太棒了！你完成了！',
  ],
  progress: [
    '加油！你可以的！',
    '繼續努力！',
    '快完成了！',
    '很棒！繼續！',
    '再一下下就好了！',
  ],
  start: [
    '開始囉！一起加油！',
    '準備好了嗎？開始！',
    '加油！我們開始！',
    '出發！',
  ],
} as const;
