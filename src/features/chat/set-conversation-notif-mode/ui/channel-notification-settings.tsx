import { useState } from 'react';
import { Bell, AtSign, BellOff } from 'lucide-react'
import { useSetConversationNotifMode } from '../hooks';
import { muteDurationToISO } from '../model/schema';
import type { MuteDuration } from '../model/types';
import { ConversationNotifMode } from '@/gql/graphql';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/primitives/radio-group';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/primitives/button';

const NOTIFICATION_OPTIONS: Array<{
  value: ConversationNotifMode;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    value: ConversationNotifMode.AllMessages,
    label: 'All messages',
    description: 'Notify for all new messages.',
    icon: Bell,
  },
  {
    value: ConversationNotifMode.MentionsOnly,
    label: 'Mentions only',
    description: 'Only notify when @mentioned.',
    icon: AtSign,
  },
  {
    value: ConversationNotifMode.Nothing,
    label: 'Nothing',
    description: 'Disable all notifications for this channel.',
    icon: BellOff,
  },
];

const MUTE_DURATIONS: Array<{ value: MuteDuration; label: string }> = [
  { value: '1h', label: '1 hour' },
  { value: '4h', label: '4 hours' },
  { value: '8h', label: '8 hours' },
  { value: '24h', label: '24 hours' },
  { value: 'indefinite', label: 'Until I turn it back on' },
];

interface ChannelNotificationSettingsProps {
  conversationId: string;
  initialMode: ConversationNotifMode | undefined;
  initialMuteUntil: string | null | undefined;
}

function isMuted(
  mode: ConversationNotifMode | undefined,
  muteUntil: string | null | undefined,
): boolean {
  if (mode === 'NOTHING') return true;
  if (muteUntil && new Date(muteUntil) > new Date()) return true;
  return false;
}

function resolveInitialMode(
  mode: ConversationNotifMode | undefined,
  muteUntil: string | null | undefined,
): ConversationNotifMode {
  if (isMuted(mode, muteUntil)) return ConversationNotifMode.Nothing;
  if (mode === 'MENTIONS_ONLY') return ConversationNotifMode.MentionsOnly;
  return ConversationNotifMode.AllMessages;
}

export function ChannelNotificationSettings({
  conversationId,
  initialMode,
  initialMuteUntil,
}: ChannelNotificationSettingsProps) {
  const setMode = useSetConversationNotifMode();

  const [selectedMode, setSelectedMode] = useState<ConversationNotifMode>(
    resolveInitialMode(initialMode, initialMuteUntil),
  );
  const [muteDuration, setMuteDuration] = useState<MuteDuration>('indefinite');
  const [showMuteOptions, setShowMuteOptions] = useState(
    isMuted(initialMode, initialMuteUntil),
  );

  const setNotificationMode = async (
    mode: ConversationNotifMode,
    duration: MuteDuration = 'indefinite',
  ) => {
    await setMode.mutateAsync({
      conversationId,
      mode,
      muteUntil: muteDurationToISO(duration),
    });
  };

  const handleModeChange = async (mode: ConversationNotifMode) => {
    setSelectedMode(mode);
    if (mode === 'NOTHING') {
      setShowMuteOptions(true);
      await setNotificationMode(mode, muteDuration);
    } else {
      setShowMuteOptions(false);
      setMuteDuration('indefinite');
      await setNotificationMode(mode, null);
    }
  };

  const handleMuteDurationChange = async (duration: MuteDuration) => {
    setMuteDuration(duration);
    await setNotificationMode(ConversationNotifMode.Nothing, duration);
  };

  return (
    <div className="space-y-4">
      <p className="text-11 font-semibold uppercase tracking-widest text-secondary px-1">
        Notifications
      </p>

      <div className="space-y-2">
        <RadioGroup
          value={selectedMode}
          onValueChange={handleModeChange}
          className="space-y-2"
        >
          {NOTIFICATION_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                'flex items-start gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors',
                'hover:bg-layer-1-hover',
                selectedMode === opt.value
                  ? 'border-subtle-1 bg-layer-1'
                  : 'border-subtle',
              )}
            >
              <RadioGroupItem value={opt.value} className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <opt.icon className="size-4 text-secondary shrink-0" />
                  <span className="text-sm font-medium text-primary">{opt.label}</span>
                </div>
                <p className="text-xs text-secondary mt-0.5">{opt.description}</p>
              </div>
            </label>
          ))}
        </RadioGroup>

        {showMuteOptions && (
          <div className="mt-2 pl-1">
            <p className="py-2 text-xs text-secondary">Mute for...</p>
            <div className="flex flex-wrap gap-2">
              {MUTE_DURATIONS.map((d) => (
                <Button
                  key={d.value}
                  variant={muteDuration === d.value ? 'secondary' : 'outline'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleMuteDurationChange(d.value)}
                  disabled={setMode.isPending}
                >
                  {d.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-secondary mt-2">
              You will still be notified for direct @mentions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
