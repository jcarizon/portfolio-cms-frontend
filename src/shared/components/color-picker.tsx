'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const presetColors = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c',
  '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
  '#fa709a', '#fee140', '#a8edea', '#fed6e3',
  '#5ee7df', '#b490ca', '#d299c2', '#fef9d7',
  '#2563eb', '#7c3aed', '#db2777', '#ea580c',
  '#16a34a', '#0891b2', '#4f46e5', '#9333ea',
];

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Validate hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handlePresetClick = (color: string) => {
    setInputValue(color);
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="form-label">{label}</label>
      )}
      
      <div className="flex gap-2">
        {/* Color Preview Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-lg border-2 border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors"
          style={{ backgroundColor: value }}
          title="Pick a color"
        />

        {/* Hex Input */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="form-input flex-1 font-mono"
          placeholder="#000000"
        />
      </div>

      {/* Color Picker Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 w-64">
          {/* Preset Colors */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handlePresetClick(color)}
                className={cn(
                  'w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110',
                  value === color ? 'border-neutral-800' : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Native Color Picker */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-neutral-600">Custom:</label>
            <input
              type="color"
              value={value}
              onChange={(e) => {
                setInputValue(e.target.value);
                onChange(e.target.value);
              }}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}