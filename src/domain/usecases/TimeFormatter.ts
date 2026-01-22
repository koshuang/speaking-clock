export class TimeFormatter {
  format(date: Date): string {
    const hours = date.getHours()
    const minutes = date.getMinutes()

    const period = this.getPeriod(hours)
    const displayHours = hours % 12 || 12

    if (minutes === 0) {
      return `現在時間 ${period} ${displayHours} 點整`
    }
    return `現在時間 ${period} ${displayHours} 點 ${minutes} 分`
  }

  private getPeriod(hours: number): string {
    if (hours >= 0 && hours < 6) {
      return '凌晨'
    } else if (hours >= 6 && hours < 12) {
      return '上午'
    } else if (hours >= 12 && hours < 18) {
      return '下午'
    } else {
      return '晚上'
    }
  }
}
