'use client';

import { TextareaHTMLAttributes } from 'react';

interface KeyInputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function KeyInput({
  label,
  placeholder,
  value,
  onChange,
  className = '',
  ...props
}: KeyInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-32 bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 text-sm text-gray-300 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm placeholder:text-gray-500"
        {...props}
      />
    </div>
  );
}
