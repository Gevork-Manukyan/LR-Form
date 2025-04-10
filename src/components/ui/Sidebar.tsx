import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Sidebar({ isOpen, onClose, children }: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-60 bg-white transform transition-all duration-300 ease-in-out z-0 rounded-r-lg",
          isOpen ? "translate-x-[240px] shadow-lg" : "translate-x-0",
          "max-w-3xl mx-auto"
        )}
      >
        <div className="p-4 h-full overflow-y-auto">
          {children}
        </div>
      </aside>
    </>
  );
} 