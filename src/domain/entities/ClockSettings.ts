export interface ClockSettings {
  interval: number // 報時間隔（分鐘）
  enabled: boolean // 是否啟用報時
  voiceId?: string // 選擇的語音 ID
  childMode: boolean // 兒童模式
  childName?: string // 主人公名字（提醒時會先念名字）
}

export const DEFAULT_CLOCK_SETTINGS: ClockSettings = {
  interval: 30,
  enabled: false,
  voiceId: undefined,
  childMode: false,
}
