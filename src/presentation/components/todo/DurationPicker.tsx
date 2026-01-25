import { Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { cn } from '@/lib/utils';

interface DurationPickerProps {
  value?: number; // Duration in minutes (undefined means no duration)
  onChange: (duration: number | undefined) => void;
  className?: string;
  size?: 'default' | 'sm'; // For different contexts
  compact?: boolean; // Show only icon when no value
}

const PRESET_DURATIONS = [5, 10, 15, 20, 30, 45, 60];

export function DurationPicker({
  value,
  onChange,
  className,
  size = 'default',
  compact = false,
}: DurationPickerProps) {
  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === 'none') {
      onChange(undefined);
    } else {
      onChange(Number(selectedValue));
    }
  };

  const isSmall = size === 'sm' || compact;
  const hideValue = compact && !value;

  return (
    <Select
      value={value?.toString() ?? 'none'}
      onValueChange={handleValueChange}
    >
      <SelectTrigger
        className={cn(
          'shrink-0',
          isSmall ? 'h-9 text-xs' : '',
          compact
            ? value
              ? 'w-[4.5rem] gap-1 px-2'
              : 'w-10 gap-0 px-2 [&>svg:last-child]:hidden'
            : size === 'sm'
              ? 'w-20 gap-1 px-2'
              : 'w-28 gap-2',
          className
        )}
        aria-label="選擇任務時長"
      >
        <Clock className="h-4 w-4 shrink-0" />
        <span className={hideValue ? 'sr-only' : ''}>
          <SelectValue placeholder={compact ? '' : '不計時'} />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">不計時</SelectItem>
        {PRESET_DURATIONS.map((duration) => (
          <SelectItem key={duration} value={duration.toString()}>
            {duration}分
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
