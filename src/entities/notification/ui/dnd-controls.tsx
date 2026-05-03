import { useEffect, useState } from 'react';

import { formatDndDuration, isDndExpired } from '../lib';
import { Button } from '@/shared/ui/primitives';

interface DndControlsProps {
  isDndActive: boolean;
  dndUntil: string | null;
  onPause1Hour: () => void;
  onPause4Hours: () => void;
  onPauseUntilTomorrow: () => void;
  onResume: () => void;
  isPending?: boolean;
}

function DndActiveDisplay({
  dndUntil,
  onResume,
  isPending,
}: {
  dndUntil: string;
  onResume: () => void;
  isPending?: boolean;
}) {
  const [remainingMs, setRemainingMs] = useState(() => {
    return new Date(dndUntil).getTime() - Date.now();
  });

  useEffect(() => {
    if (!dndUntil) return;
    
    const updateRemaining = () => {
      setRemainingMs(new Date(dndUntil).getTime() - Date.now());
    };
    
    updateRemaining();
    const interval = setInterval(updateRemaining, 60000);
    
    return () => clearInterval(interval);
  }, [dndUntil]);

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-lg bg-layer-2">
        <div className="text-14 font-medium text-primary">Notifications paused</div>
        <div className="text-13 text-secondary">
          Resuming in {formatDndDuration(remainingMs)}
        </div>
      </div>
      <Button
        variant="outline"
        onClick={onResume}
        disabled={isPending}
        className="w-full"
      >
        Resume notifications
      </Button>
      <p className="text-11 text-tertiary text-center">
        You will still receive direct @mentions
      </p>
    </div>
  );
}

export function DndControls({
  isDndActive,
  dndUntil,
  onPause1Hour,
  onPause4Hours,
  onPauseUntilTomorrow,
  onResume,
  isPending,
}: DndControlsProps) {
  const isDndActiveAndNotExpired = isDndActive && dndUntil && !isDndExpired(dndUntil);

  if (isDndActiveAndNotExpired) {
    return (
      <DndActiveDisplay
        dndUntil={dndUntil}
        onResume={onResume}
        isPending={isPending}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-14 font-medium text-primary">Pause notifications</div>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" onClick={onPause1Hour} disabled={isPending}>
          1 hour
        </Button>
        <Button variant="outline" onClick={onPause4Hours} disabled={isPending}>
          4 hours
        </Button>
        <Button variant="outline" onClick={onPauseUntilTomorrow} disabled={isPending}>
          Tomorrow 8am
        </Button>
      </div>
      <p className="text-11 text-tertiary text-center">
        You will still receive direct @mentions
      </p>
    </div>
  );
}