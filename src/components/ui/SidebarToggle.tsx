import { Switch } from "./switch"

interface SidebarToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SidebarToggle({ id, label, checked, onCheckedChange }: SidebarToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor={id}
        className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
} 