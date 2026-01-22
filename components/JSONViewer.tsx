'use client';

import { useMemo } from 'react';

interface JSONViewerProps {
  data: Record<string, unknown> | null;
  label?: string;
  className?: string;
}

// 簡化的 JSON 語法高亮函數
function highlightJSON(json: string): React.ReactElement {
  // 使用正則表達式匹配並替換
  let highlighted = json
    // 匹配 JSON 鍵（"key":）
    .replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1":</span>')
    // 匹配字符串值（: "value"）
    .replace(/:\s*"([^"]*)"/g, ': <span class="text-orange-400">"$1"</span>')
    // 匹配數字值（: 123）
    .replace(/:\s*(\d+)/g, ': <span class="text-orange-400">$1</span>')
    // 匹配布林值（: true/false）
    .replace(/:\s*(true|false)/g, ': <span class="text-orange-400">$1</span>');

  return (
    <div
      className="leading-relaxed"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

export default function JSONViewer({ data, label, className = '' }: JSONViewerProps) {
  const formattedJson = useMemo(() => {
    if (!data || Object.keys(data).length === 0) {
      return '{}';
    }
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return '{}';
    }
  }, [data]);

  const highlightedJson = useMemo(() => {
    return highlightJSON(formattedJson);
  }, [formattedJson]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      <pre className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 overflow-auto text-sm text-gray-200 font-mono backdrop-blur-sm">
        {highlightedJson}
      </pre>
    </div>
  );
}
