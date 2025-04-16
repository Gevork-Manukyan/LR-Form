import { cn } from '../../lib/utils';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerMenu({ isOpen, onClick }: HamburgerMenuProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-6 h-6 focus:outline-none"
      aria-label="Toggle menu"
    >
      <span className="sr-only">Toggle menu</span>
      <div className={cn("block w-6 transform transition duration-300 ease-in-out", isOpen ? "translate-y-[-6px]" : "")}>
        <span
          className={cn(
            'block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out',
            isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1.5'
          )}
        />
        <span
          className={cn(
            'block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out',
            isOpen ? 'opacity-0' : 'opacity-100'
          )}
        />
        <span
          className={cn(
            'block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out',
            isOpen ? '-rotate-45 translate-y-1.5' : 'translate-y-1.5'
          )}
        />
      </div>
    </button>
  );
}
