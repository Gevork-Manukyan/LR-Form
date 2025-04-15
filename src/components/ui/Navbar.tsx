
import { ChevronDown, ChevronUp } from 'lucide-react';

interface NavbarProps {
  onCollapseAll: () => void;
  isAllCollapsed: boolean;
}

export function Navbar({ onCollapseAll, isAllCollapsed }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">LR Form</h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={onCollapseAll}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              {isAllCollapsed ? (
                <>
                  <ChevronDown className="w-5 h-5" />
                  <span>Expand All</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-5 h-5" />
                  <span>Collapse All</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 