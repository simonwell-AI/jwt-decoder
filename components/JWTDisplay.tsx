'use client';

import { useRef, useEffect } from 'react';

interface JWTDisplayProps {
  jwt: string;
  className?: string;
  placeholder?: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export default function JWTDisplay({
  jwt,
  className = '',
  placeholder,
  editable = false,
  onChange,
}: JWTDisplayProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // 同步滾動位置
  useEffect(() => {
    if (editable && textareaRef.current && backgroundRef.current) {
      const textarea = textareaRef.current;
      const background = backgroundRef.current;

      const handleScroll = () => {
        if (background && textarea) {
          background.scrollTop = textarea.scrollTop;
          background.scrollLeft = textarea.scrollLeft;
        }
      };

      textarea.addEventListener('scroll', handleScroll);
      return () => textarea.removeEventListener('scroll', handleScroll);
    }
  }, [editable, jwt]);

  // 分割 JWT 為三個部分
  const parts = jwt.split('.');
  const hasValidFormat = parts.length === 3;

  const containerClass = `w-full bg-gray-900/50 border border-gray-700/50 rounded-lg text-sm font-mono resize-none focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-purple-500/50 backdrop-blur-sm ${className}`;

  if (!jwt.trim() && placeholder) {
    if (editable) {
      return (
        <div className={containerClass} style={{ minHeight: '192px' }}>
          <textarea
            ref={textareaRef}
            value={jwt}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full bg-transparent border-0 text-gray-500 font-mono resize-none focus:outline-none p-4 overflow-auto"
            style={{ 
              caretColor: 'rgb(196, 181, 253)',
              minHeight: '192px',
              height: '192px'
            }}
          />
        </div>
      );
    }
    return (
      <div className={`${containerClass} p-4 overflow-auto`} style={{ minHeight: '192px' }}>
        <span className="text-gray-500">{placeholder}</span>
      </div>
    );
  }

  if (!hasValidFormat && jwt.trim()) {
    if (editable) {
      return (
        <div className={`${containerClass} relative`} style={{ minHeight: '192px', height: '192px' }}>
          <div
            ref={backgroundRef}
            className="absolute inset-0 p-4 pointer-events-none overflow-auto hide-scrollbar"
            style={{ height: '100%' }}
          >
            <span className="text-purple-300 break-all whitespace-pre-wrap">{jwt}</span>
          </div>
          <textarea
            ref={textareaRef}
            value={jwt}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full h-full bg-transparent border-0 text-transparent font-mono resize-none focus:outline-none relative z-10 p-4 overflow-auto"
            style={{ 
              caretColor: 'rgb(196, 181, 253)',
              height: '100%'
            }}
          />
        </div>
      );
    }
    return (
      <div className={`${containerClass} p-4 overflow-auto`} style={{ minHeight: '192px' }}>
        <span className="text-purple-300 break-all">{jwt}</span>
      </div>
    );
  }

  const [header, payload, signature] = parts;

  if (editable) {
    return (
      <div className={`${containerClass} relative`} style={{ minHeight: '192px', height: '192px' }}>
        {/* 背景顯示帶顏色的 JWT - 同步滾動，隱藏滾動條 */}
        <div
          ref={backgroundRef}
          className="absolute inset-0 p-4 pointer-events-none overflow-auto hide-scrollbar"
          style={{ height: '100%' }}
        >
          <span className="text-pink-400 break-all whitespace-pre-wrap">{header}</span>
          <span className="text-gray-400">.</span>
          <span className="text-purple-400 break-all whitespace-pre-wrap">{payload}</span>
          <span className="text-gray-400">.</span>
          <span className="text-cyan-400 break-all whitespace-pre-wrap">{signature}</span>
        </div>
        {/* 透明的 textarea 用於輸入 - 只有這個有滾動條 */}
        <textarea
          ref={textareaRef}
          value={jwt}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-full bg-transparent border-0 text-transparent font-mono resize-none focus:outline-none relative z-10 p-4 overflow-auto"
          style={{ 
            caretColor: 'rgb(196, 181, 253)',
            height: '100%'
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${containerClass} p-4 overflow-auto`} style={{ minHeight: '192px' }}>
      <span className="text-pink-400 break-all">{header}</span>
      <span className="text-gray-400">.</span>
      <span className="text-purple-400 break-all">{payload}</span>
      <span className="text-gray-400">.</span>
      <span className="text-cyan-400 break-all">{signature}</span>
    </div>
  );
}
