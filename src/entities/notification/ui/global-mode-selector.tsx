import { GlobalNotifMode } from '@/gql/graphql';
import { cn } from '@/shared/lib/utils';

interface GlobalModeSelectorProps {
  value: GlobalNotifMode;
  onChange: (mode: GlobalNotifMode) => void;
  disabled?: boolean;
}

const modes: Array<{ value: GlobalNotifMode; label: string; description: string }> = [
  {
    value: GlobalNotifMode.All,
    label: 'All activity',
    description: 'Receive notifications for all messages and activity',
  },
  {
    value: GlobalNotifMode.MentionsOnly,
    label: 'Mentions only',
    description: 'Only receive notifications when @mentioned',
  },
  {
    value: GlobalNotifMode.Nothing,
    label: 'Nothing',
    description: 'Turn off all notifications',
  },
];

export function GlobalModeSelector({
  value,
  onChange,
  disabled,
}: GlobalModeSelectorProps) {
  return (
    <div className="space-y-2">
      {modes.map((mode) => (
        <label
          key={mode.value}
          className={cn(
            'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
            'hover:bg-muted/50',
            value === mode.value && 'border-primary bg-primary/5',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="radio"
            name="global-mode"
            value={mode.value}
            checked={value === mode.value}
            onChange={() => onChange(mode.value)}
            disabled={disabled}
            className="mt-1"
          />
          <div>
            <div className="font-medium">{mode.label}</div>
            <div className="text-sm text-muted-foreground">
              {mode.description}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}