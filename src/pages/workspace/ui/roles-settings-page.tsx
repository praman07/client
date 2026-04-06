import { WorkspaceRolesPanel } from "@/widgets/workspace-roles-panel";
import { ScrollArea } from "@/shared/ui";

export function RolesSettingsPage() {
  return <ScrollArea className="h-[calc(100vh-320px)]"><WorkspaceRolesPanel /></ScrollArea>
}
