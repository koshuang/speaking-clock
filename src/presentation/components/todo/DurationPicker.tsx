import { useState, useRef, useEffect } from 'react';
import { Clock, Check, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { cn } from '@/lib/utils';
import { container } from '@/di/container';

const { durationOptionsUseCase } = container;

interface DurationPickerProps {
  value?: number; // Duration in minutes (undefined means no duration)
  onChange: (duration: number | undefined) => void;
  className?: string;
  size?: 'default' | 'sm'; // For different contexts
  compact?: boolean; // Show only icon when no value
}

export function DurationPicker({
  value,
  onChange,
  className,
  size = 'default',
  compact = false,
}: DurationPickerProps) {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if current value is a preset
  const isPresetValue = value === undefined || durationOptionsUseCase.isPreset(value);

  // Focus input when entering custom mode
  useEffect(() => {
    if (isCustomMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCustomMode]);

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === 'none') {
      onChange(undefined);
      setIsCustomMode(false);
    } else if (selectedValue === 'custom') {
      setIsCustomMode(true);
      setCustomValue(value?.toString() ?? '');
    } else {
      onChange(Number(selectedValue));
      setIsCustomMode(false);
    }
  };

  const handleCustomConfirm = () => {
    const num = parseInt(customValue, 10);
    if (durationOptionsUseCase.isValid(num)) {
      onChange(num);
      setIsCustomMode(false);
    }
  };

  const handleCustomCancel = () => {
    setIsCustomMode(false);
    setCustomValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomConfirm();
    } else if (e.key === 'Escape') {
      handleCustomCancel();
    }
  };

  const isSmall = size === 'sm' || compact;
  const hideValue = compact && !value;

  // Custom input mode
  if (isCustomMode) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <Input
          ref={inputRef}
          type="number"
          min={durationOptionsUseCase.getMinDuration()}
          max={durationOptionsUseCase.getMaxDuration()}
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn('w-16 h-9 text-xs px-2', isSmall && 'h-8')}
          placeholder="分鐘"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCustomConfirm}
          className="h-8 w-8"
          disabled={!customValue || !durationOptionsUseCase.isValid(parseInt(customValue, 10))}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCustomCancel}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Get display value for Select
  const selectValue = value === undefined
    ? 'none'
    : isPresetValue
      ? value.toString()
      : 'custom';

  return (
    <Select
      value={selectValue}
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
          <SelectValue placeholder={compact ? '' : '不計時'}>
            {value === undefined ? (compact ? '' : '不計時') : `${value}分`}
          </SelectValue>
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">不計時</SelectItem>
        {durationOptionsUseCase.getPresets().map((duration) => (
          <SelectItem key={duration} value={duration.toString()}>
            {duration}分
          </SelectItem>
        ))}
        <SelectItem value="custom">自訂...</SelectItem>
      </SelectContent>
    </Select>
  );
}
