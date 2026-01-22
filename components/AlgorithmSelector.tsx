'use client';

import { ALGORITHMS } from '@/lib/algorithms';
import { Algorithm } from '@/types/jwt';

interface AlgorithmSelectorProps {
  value: Algorithm;
  onChange: (algorithm: Algorithm) => void;
  className?: string;
}

export default function AlgorithmSelector({
  value,
  onChange,
  className = '',
}: AlgorithmSelectorProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white mb-2">
        演算法
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Algorithm)}
        className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm"
      >
        {ALGORITHMS.map((alg) => (
          <option key={alg.value} value={alg.value} className="bg-gray-900">
            {alg.label}
          </option>
        ))}
      </select>
      {ALGORITHMS.find((a) => a.value === value) && (
        <p className="mt-1 text-xs text-gray-400">
          {ALGORITHMS.find((a) => a.value === value)?.description}
        </p>
      )}
    </div>
  );
}
