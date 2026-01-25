export class TaskReminderTextGenerator {
  generateStartText(todoText: string, durationMinutes: number): string {
    return `現在是${todoText}時間，共 ${durationMinutes} 分鐘`;
  }

  generateProgressText(todoText: string, remainingMinutes: number): string {
    return `${todoText}，還剩 ${remainingMinutes} 分鐘`;
  }

  generateWarningText(todoText: string, remainingMinutes: number): string {
    return `${todoText}，還剩 ${remainingMinutes} 分鐘`;
  }

  generateCompleteText(todoText: string): string {
    return `${todoText}，時間到了。做得好！`;
  }

  generateNextTaskText(todoText: string, durationMinutes: number): string {
    return `接下來是${todoText}，共 ${durationMinutes} 分鐘`;
  }

  generateTimePrefix(): string {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Convert to 12-hour format
    const displayHours = hours % 12 || 12;

    let period: string;
    if (hours >= 0 && hours < 6) {
      period = '凌晨';
    } else if (hours >= 6 && hours < 12) {
      period = '上午';
    } else if (hours >= 12 && hours < 18) {
      period = '下午';
    } else {
      period = '晚上';
    }

    if (minutes === 0) {
      return `${period} ${displayHours} 點整`;
    }
    return `${period} ${displayHours} 點 ${minutes} 分`;
  }
}
