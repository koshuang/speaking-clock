import { useState, useRef, useEffect } from 'react';
import { AlarmClock, Check, X } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { cn } from '@/lib/utils';

interface DeadlinePickerProps {
  value?: string; // Deadline in HH:MM format (undefined means no deadline)
  onChange: (deadline: string | undefined) => void;
  className?: string;
  compact?: boolean; // Show only icon when no value
}

export function DeadlinePicker({
  value,
  onChange,
  className,
  compact = false,
}: DeadlinePickerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value when external value changes
  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    if (inputValue && isValidTime(inputValue)) {
      onChange(inputValue);
    } else {
      onChange(undefined);
    }
    setIsEditing(false);
  };

  const handleClear = () => {
    onChange(undefined);
    setInputValue('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      setInputValue(value ?? '');
      setIsEditing(false);
    }
  };

  const isValidTime = (time: string): boolean => {
    const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return regex.test(time);
  };

  const hideValue = compact && !value;

  // Edit mode - show time input with confirm/cancel
  if (isEditing) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <Input
          ref={inputRef}
          type="time"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-24 h-9 text-xs px-2"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleConfirm}
          className="h-8 w-8"
          disabled={inputValue !== '' && !isValidTime(inputValue)}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleClear}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Display mode - show button to enter edit mode
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsEditing(true)}
      className={cn(
        'shrink-0 h-9 text-xs gap-1',
        compact
          ? value
            ? 'w-[4.5rem] px-2'
            : 'w-10 px-2'
          : 'w-24 px-2',
        className
      )}
      aria-label="選擇期限時間"
    >
      <AlarmClock className="h-4 w-4 shrink-0" />
      <span className={hideValue ? 'sr-only' : ''}>
        {value ?? (compact ? '' : '無期限')}
      </span>
    </Button>
  );
}
