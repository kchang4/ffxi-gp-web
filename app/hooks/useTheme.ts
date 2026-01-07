import { useState, useEffect } from 'react';

export function useTheme(initialTheme: 'light' | 'dark' = 'light') {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )theme=([^;]+)'));
      if (match) {
        const saved = match[2] as 'light' | 'dark';
        setTheme(saved);
        document.documentElement.classList.toggle('dark', saved === 'dark');
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.cookie = `theme=${next}; path=/; max-age=31536000`; // 1 year
  };

  return { theme, toggleTheme, mounted };
}
