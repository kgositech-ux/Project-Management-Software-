import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme for accessibility`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
        isDark
          ? 'bg-[#141a24] hover:bg-[#1c2433] text-amber-300 border border-[#232e42]'
          : 'bg-white hover:bg-slate-100 text-amber-600 border border-slate-300 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {isDark ? 'Light Theme' : 'Dark Theme'}
        </span>
      )}
    </button>
  );
};
