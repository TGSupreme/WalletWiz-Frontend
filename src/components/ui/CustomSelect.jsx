import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, placeholder, icon: Icon, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside its viewport area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Normalize options to objects with value and label keys
  const formattedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = formattedOptions.find(opt => opt.value === value) || { value: '', label: placeholder || 'Select option' };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Custom Trigger Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between pl-3.5 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark focus:border-violet-500 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none transition-all cursor-pointer text-left"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
          <span className="truncate">{selectedOption.label}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Options Popup Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark rounded-xl shadow-lg z-50 py-1.5 animate-fade-in divide-y divide-slate-50 dark:divide-slate-800/40">
          {formattedOptions.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold cursor-pointer transition-colors duration-150 ${
                opt.value === value 
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
