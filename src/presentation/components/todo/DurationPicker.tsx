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
}

const PRESET_DURATIONS = [5, 10, 15, 20, 30, 45, 60];

export function DurationPicker({
  value,
  onChange,
  className,
  size = 'default',
}: DurationPickerProps) {
  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === 'none') {
      onChange(undefined);
    } else {
      onChange(Number(selectedValue));
    }
  };

  return (
    <Select
      value={value?.toString() ?? 'none'}
      onValueChange={handleValueChange}
    >
      <SelectTrigger
        className={cn(
          'gap-2',
          size === 'sm' ? 'h-8 w-24 text-xs' : 'w-32',
          className
        )}
      >
        <Clock className={cn('shrink-0', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
        <SelectValue placeholder="不計時" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">不計時</SelectItem>
        {PRESET_DURATIONS.map((duration) => (
          <SelectItem key={duration} value={duration.toString()}>
            {duration}分鐘
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
