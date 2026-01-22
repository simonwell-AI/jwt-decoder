'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { encodeJWT, verifyJWT } from '@/lib/jwt';
import { Algorithm } from '@/types/jwt';
import AlgorithmSelector from './AlgorithmSelector';
import KeyInput from './KeyInput';
import JSONViewer from './JSONViewer';
import JWTDisplay from './JWTDisplay';

interface JWTEncoderProps {
  initialHeader?: string;
  initialPayload?: string;
  onHeaderChange?: (header: string) => void;
  onPayloadChange?: (payload: string) => void;
}

export default function JWTEncoder({
  initialHeader = '{}',
  initialPayload = '{}',
  onHeaderChange,
  onPayloadChange,
}: JWTEncoderProps) {
  const [header, setHeader] = useState(initialHeader);
  const [payload, setPayload] = useState(initialPayload);
  const [algorithm, setAlgorithm] = useState<Algorithm>('HS256');
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [encodedJWT, setEncodedJWT] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<{
    verified?: boolean;
    error?: string;
  } | null>(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const prevInitialHeaderRef = useRef(initialHeader);
  const prevInitialPayloadRef = useRef(initialPayload);
  const isInternalUpdateRef = useRef(false);

  // 同步外部初始值（只在真正改變時）
  useEffect(() => {
    if (prevInitialHeaderRef.current !== initialHeader && !isInternalUpdateRef.current) {
      prevInitialHeaderRef.current = initialHeader;
      setHeader(initialHeader);
    }
    isInternalUpdateRef.current = false;
  }, [initialHeader]);

  useEffect(() => {
    if (prevInitialPayloadRef.current !== initialPayload && !isInternalUpdateRef.current) {
      prevInitialPayloadRef.current = initialPayload;
      setPayload(initialPayload);
    }
    isInternalUpdateRef.current = false;
  }, [initialPayload]);

  // 處理 Header 改變
  const handleHeaderChange = (value: string) => {
    isInternalUpdateRef.current = true;
    setHeader(value);
    if (onHeaderChange) {
      onHeaderChange(value);
    }
  };

  // 處理 Payload 改變
  const handlePayloadChange = (value: string) => {
    isInternalUpdateRef.current = true;
    setPayload(value);
    if (onPayloadChange) {
      onPayloadChange(value);
    }
  };

  // 解析 JSON
  const parsedHeader = useMemo(() => {
    try {
      return JSON.parse(header);
    } catch {
      return null;
    }
  }, [header]);

  const parsedPayload = useMemo(() => {
    try {
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }, [payload]);

  // 編碼 JWT
  const handleEncode = async () => {
    if (!parsedHeader || !parsedPayload) {
      setError('Header 或 Payload 格式無效。請確保是有效的 JSON。');
      setEncodedJWT('');
      return;
    }

    if (!privateKey.trim()) {
      setError('請輸入私鑰');
      setEncodedJWT('');
      return;
    }

    setIsEncoding(true);
    setError(null);

    try {
      const result = await encodeJWT(parsedHeader, parsedPayload, algorithm, privateKey);
      if (result.success && result.token) {
        setEncodedJWT(result.token);
        setError(null);
      } else {
        setError(result.error || '編碼失敗');
        setEncodedJWT('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '編碼時發生錯誤');
      setEncodedJWT('');
    } finally {
      setIsEncoding(false);
    }
  };

  // 當輸入改變時自動編碼
  useEffect(() => {
    if (parsedHeader && parsedPayload && privateKey.trim()) {
      const timer = setTimeout(() => {
        handleEncode();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setEncodedJWT('');
      setError(null);
    }
  }, [header, payload, algorithm, privateKey]);

  // 驗證編碼後的 JWT（如果有公鑰）
  useEffect(() => {
    if (encodedJWT && publicKey.trim()) {
      const verify = async () => {
        try {
          const result = await verifyJWT(encodedJWT, publicKey, algorithm);
          setVerificationStatus({
            verified: result.verified,
            error: result.error,
          });
        } catch {
          setVerificationStatus({ error: '驗證失敗' });
        }
      };
      verify();
    } else {
      setVerificationStatus(null);
    }
  }, [encodedJWT, publicKey, algorithm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 左側：輸入區域 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            標頭
          </label>
          <textarea
            value={header}
            onChange={(e) => handleHeaderChange(e.target.value)}
            placeholder="{}"
            className="w-full h-32 bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 text-sm text-gray-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm"
          />
          {!parsedHeader && header.trim() && (
            <p className="mt-1 text-xs text-red-400">無效的 JSON 格式</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            有效載荷
          </label>
          <textarea
            value={payload}
            onChange={(e) => handlePayloadChange(e.target.value)}
            placeholder="{}"
            className="w-full h-32 bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 text-sm text-gray-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm"
          />
          {!parsedPayload && payload.trim() && (
            <p className="mt-1 text-xs text-red-400">無效的 JSON 格式</p>
          )}
        </div>

        <AlgorithmSelector value={algorithm} onChange={setAlgorithm} />

        <KeyInput
          label="私鑰"
          value={privateKey}
          onChange={setPrivateKey}
          placeholder={`-----BEGIN PRIVATE KEY-----
{在此輸入私鑰}
-----END PRIVATE KEY-----`}
        />

        <KeyInput
          label="公鑰（可選，用於驗證）"
          value={publicKey}
          onChange={setPublicKey}
          placeholder={`-----BEGIN PUBLIC KEY-----
{在此輸入公鑰}
-----END PUBLIC KEY-----`}
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/50 backdrop-blur-sm">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {isEncoding && (
          <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <p className="text-sm text-gray-400">編碼中...</p>
          </div>
        )}
      </div>

      {/* 右側：輸出區域 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            已編碼 JWT
          </label>
          <JWTDisplay
            jwt={encodedJWT}
            placeholder="{{標頭}}.{{有效載荷}}.{{簽名}}"
            className="h-48"
          />
          {encodedJWT && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(encodedJWT);
              }}
              className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors font-medium"
            >
              複製 JWT
            </button>
          )}
        </div>

        {verificationStatus && publicKey.trim() && (
          <div
            className={`p-3 rounded-lg backdrop-blur-sm ${
              verificationStatus.verified
                ? 'bg-green-900/30 border border-green-700/50'
                : 'bg-red-900/30 border border-red-700/50'
            }`}
          >
            <p
              className={`text-sm ${
                verificationStatus.verified ? 'text-green-300' : 'text-red-300'
              }`}
            >
              {verificationStatus.verified
                ? '✓ 簽名驗證成功'
                : verificationStatus.error || '✗ 簽名驗證失敗'}
            </p>
          </div>
        )}

        <JSONViewer data={parsedHeader} label="標頭（預覽）" />
        <JSONViewer data={parsedPayload} label="有效載荷（預覽）" />
      </div>
    </div>
  );
}
