'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn(
          'relative h-9 w-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20',
          'flex items-center justify-center transition-all duration-300',
          className
        )}
      >
        <Sun className="h-4 w-4 text-foreground/50" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'relative h-9 w-9 rounded-full backdrop-blur-sm border',
        'flex items-center justify-center transition-all duration-300',
        'hover:scale-110 active:scale-95',
        theme === 'dark'
          ? 'bg-white/10 border-white/20 hover:bg-white/20'
          : 'bg-black/5 border-black/10 hover:bg-black/10',
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun
        className={cn(
          'h-4 w-4 transition-all duration-500',
          theme === 'dark'
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100 text-amber-500'
        )}
        style={{ position: 'absolute' }}
      />
      <Moon
        className={cn(
          'h-4 w-4 transition-all duration-500',
          theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100 text-blue-300'
            : '-rotate-90 scale-0 opacity-0'
        )}
        style={{ position: 'absolute' }}
      />
    </button>
  );
}
