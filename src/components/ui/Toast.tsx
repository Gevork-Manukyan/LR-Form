import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    // Handle entrance animation
    const entranceTimer = setTimeout(() => {
      setIsEntering(false);
    }, 50); // Small delay to ensure the initial state is rendered

    // Handle exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300); // Match this with the transition duration
    }, duration);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(exitTimer);
    };
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out ${
        isEntering ? 'opacity-0 translate-y-2' : 
        isExiting ? 'opacity-0 translate-y-2' : 
        'opacity-100 translate-y-0'
      }`}
    >
      {message}
    </div>
  );
} 