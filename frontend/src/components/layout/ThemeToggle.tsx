'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-xl bg-brand-secondary-low border border-border-subtle text-foreground/40 hover:text-brand-primary hover:border-brand-primary transition-all active:scale-95 group"
      aria-label="Toggle Theme"
    >
      {resolvedTheme === 'light' ? (
        <Moon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
      ) : (
        <Sun className="h-5 w-5 transition-transform group-hover:rotate-45" />
      )}
    </button>
  );
};
