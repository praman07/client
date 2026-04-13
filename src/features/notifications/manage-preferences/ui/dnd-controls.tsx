import { Button } from '@/shared/ui/primitives/button';
import { usePauseNotifications, useResumeNotifications } from '../hooks';

interface DndControlsProps {
  isDndActive: boolean;
  dndUntil: string | null;
  disabled?: boolean;
}

export function DndControls({ isDndActive, dndUntil, disabled }: DndControlsProps) {
  const pause = usePauseNotifications();
  const resume = useResumeNotifications();

  const formatUntil = (until: string | null) => {
    if (!until) return null;
    const date = new Date(until);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (isDndActive) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Notifications paused until {formatUntil(dndUntil)}
        </p>
        <Button
          variant="outline"
          onClick={() => resume.mutate()}
          disabled={resume.isPending || disabled}
        >
          Resume notifications
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => pause.pause1Hour()}
        disabled={pause.isPending || disabled}
      >
        1 hour
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => pause.pause4Hours()}
        disabled={pause.isPending || disabled}
      >
        4 hours
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => pause.pauseUntilTomorrow()}
        disabled={pause.isPending || disabled}
      >
        Until tomorrow
      </Button>
    </div>
  );
}
