export interface ClockSettings {
  interval: number // 報時間隔（分鐘）
  enabled: boolean // 是否啟用報時
}

export const DEFAULT_CLOCK_SETTINGS: ClockSettings = {
  interval: 30,
  enabled: false,
}
