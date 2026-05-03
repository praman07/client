import { Switch } from '@/shared/ui/primitives';

interface ChannelTogglesProps {
  emailEnabled: boolean;
  pushEnabled: boolean;
  onEmailChange: (enabled: boolean) => void;
  onPushChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export function ChannelToggles({
  emailEnabled,
  pushEnabled,
  onEmailChange,
  onPushChange,
  disabled,
}: ChannelTogglesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-14 font-medium text-primary">Email notifications</div>
          <div className="text-13 text-secondary">
            Receive notifications via email
          </div>
        </div>
        <Switch
          checked={emailEnabled}
          onCheckedChange={onEmailChange}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-14 font-medium text-primary">Push notifications</div>
          <div className="text-13 text-secondary">
            Receive push notifications on your devices
          </div>
        </div>
        <Switch
          checked={pushEnabled}
          onCheckedChange={onPushChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}