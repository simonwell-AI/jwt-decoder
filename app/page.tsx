'use client';

import { useState, useEffect } from 'react';
import JWTDecoder from '@/components/JWTDecoder';
import JWTEncoder from '@/components/JWTEncoder';
import { ChevronDown, Share2 } from 'lucide-react';
import { JWT_EXAMPLES } from '@/lib/examples';

type Tab = 'decoder' | 'encoder';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('decoder');
  const [showExamples, setShowExamples] = useState(false);
  const [jwt, setJwt] = useState('');
  const [header, setHeader] = useState('{}');
  const [payload, setPayload] = useState('{}');

  // 從 URL 參數恢復狀態
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as Tab;
      if (tab === 'encoder' || tab === 'decoder') {
        setActiveTab(tab);
      }

      const jwtParam = params.get('jwt');
      if (jwtParam) {
        setJwt(decodeURIComponent(jwtParam));
      }

      const headerParam = params.get('header');
      if (headerParam) {
        setHeader(decodeURIComponent(headerParam));
      }

      const payloadParam = params.get('payload');
      if (payloadParam) {
        setPayload(decodeURIComponent(payloadParam));
      }
    }
  }, []);

  // 更新 URL 參數
  const updateURL = (tab: Tab, jwtValue?: string, headerValue?: string, payloadValue?: string) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      params.set('tab', tab);
      if (jwtValue) params.set('jwt', encodeURIComponent(jwtValue));
      if (headerValue) params.set('header', encodeURIComponent(headerValue));
      if (payloadValue) params.set('payload', encodeURIComponent(payloadValue));
      window.history.replaceState({}, '', `?${params.toString()}`);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      params.set('tab', activeTab);
      if (activeTab === 'decoder' && jwt) {
        params.set('jwt', encodeURIComponent(jwt));
      } else if (activeTab === 'encoder') {
        if (header) params.set('header', encodeURIComponent(header));
        if (payload) params.set('payload', encodeURIComponent(payload));
      }
      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      navigator.clipboard.writeText(url);
      alert('連結已複製到剪貼簿！');
    }
  };

  const handleExampleSelect = (exampleName: string) => {
    const example = JWT_EXAMPLES.find((ex) => ex.name === exampleName);
    if (example) {
      if (activeTab === 'decoder') {
        setJwt(example.jwt);
        updateURL('decoder', example.jwt);
      } else {
        setHeader(example.header);
        setPayload(example.payload);
        updateURL('encoder', undefined, example.header, example.payload);
      }
      setShowExamples(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* 標題和隱私聲明 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-white">JWT decoder</span>
            <span className="text-gray-500"> / encoder</span>
          </h1>
          <p className="text-gray-400 text-sm">
            你的數據是 100% 私密的 —— JWT 完全在你的設備上進行解碼和編碼。
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800/50">
          <button
            onClick={() => {
              setActiveTab('decoder');
              updateURL('decoder', jwt);
            }}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'decoder'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Decoder
          </button>
          <button
            onClick={() => {
              setActiveTab('encoder');
              updateURL('encoder', undefined, header, payload);
            }}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'encoder'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Encoder
          </button>
        </div>

        {/* 功能按鈕 */}
        <div className="flex gap-2 mb-6 justify-end">
          <div className="relative">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800/80 text-gray-200 rounded-lg transition-colors border border-gray-700/50 backdrop-blur-sm"
            >
              JWT 示例
              <ChevronDown className="w-4 h-4" />
            </button>
            {showExamples && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 border border-gray-700/50 rounded-lg shadow-lg z-10 backdrop-blur-sm">
                {JWT_EXAMPLES.map((example) => (
                  <button
                    key={example.name}
                    onClick={() => handleExampleSelect(example.name)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800/80 first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
          >
            <Share2 className="w-4 h-4" />
            分享 JWT
          </button>
        </div>

        {/* 內容區域 */}
        <div className="mt-8">
          {activeTab === 'decoder' ? (
            <JWTDecoder
              key="decoder"
              initialJWT={jwt}
              onJWTChange={(value) => {
                setJwt(value);
                updateURL('decoder', value);
              }}
            />
          ) : (
            <JWTEncoder
              key="encoder"
              initialHeader={header}
              initialPayload={payload}
              onHeaderChange={(value) => {
                setHeader(value);
                updateURL('encoder', undefined, value, payload);
              }}
              onPayloadChange={(value) => {
                setPayload(value);
                updateURL('encoder', undefined, header, value);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
