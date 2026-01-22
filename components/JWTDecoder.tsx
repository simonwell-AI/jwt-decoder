'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { decodeJWT, verifyJWT, isJWTExpired, formatExpiration } from '@/lib/jwt';
import { Algorithm } from '@/types/jwt';
import JSONViewer from './JSONViewer';
import KeyInput from './KeyInput';
import JWTDisplay from './JWTDisplay';
import { ArrowLeftRight } from 'lucide-react';

interface JWTDecoderProps {
  initialJWT?: string;
  onJWTChange?: (jwt: string) => void;
}

export default function JWTDecoder({ initialJWT = '', onJWTChange }: JWTDecoderProps) {
  const [jwt, setJwt] = useState(initialJWT);
  const [publicKey, setPublicKey] = useState('');
  const [jwksUrl, setJwksUrl] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('HS256');
  const [verificationStatus, setVerificationStatus] = useState<{
    verified?: boolean;
    error?: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const prevInitialJWTRef = useRef(initialJWT);
  const isInternalUpdateRef = useRef(false);

  // 同步外部初始值（只在 initialJWT 真正改變時）
  useEffect(() => {
    if (prevInitialJWTRef.current !== initialJWT && !isInternalUpdateRef.current) {
      prevInitialJWTRef.current = initialJWT;
      setJwt(initialJWT);
    }
    isInternalUpdateRef.current = false;
  }, [initialJWT]);

  // 通知父元件 JWT 改變（只在用戶輸入時）
  const handleJWTChange = (value: string) => {
    isInternalUpdateRef.current = true;
    setJwt(value);
    if (onJWTChange) {
      onJWTChange(value);
    }
  };

  // 解碼 JWT
  const decoded = useMemo(() => {
    if (!jwt.trim()) {
      return null;
    }
    const result = decodeJWT(jwt.trim());
    if (result.success && result.decoded) {
      // 從 header 中提取演算法
      const alg = result.decoded.header.alg as Algorithm;
      if (alg && ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512'].includes(alg)) {
        setAlgorithm(alg);
      }
      return result.decoded;
    }
    return null;
  }, [jwt]);

  // 驗證 JWT
  const handleVerify = async () => {
    if (!jwt.trim()) {
      setVerificationStatus({ error: '請輸入 JWT' });
      return;
    }

    if (!publicKey.trim() && !jwksUrl.trim()) {
      setVerificationStatus({ error: '請輸入公鑰或 JWKs Endpoint URI' });
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyJWT(jwt.trim(), publicKey, algorithm, jwksUrl || undefined);
      setVerificationStatus({
        verified: result.verified,
        error: result.error,
      });
    } catch (error) {
      setVerificationStatus({
        error: error instanceof Error ? error.message : '驗證失敗',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // 當 JWT 或密鑰改變時自動驗證（如果有密鑰）
  useEffect(() => {
    if (jwt.trim() && (publicKey.trim() || jwksUrl.trim()) && decoded) {
      const timer = setTimeout(() => {
        handleVerify();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setVerificationStatus(null);
    }
  }, [jwt, publicKey, jwksUrl, algorithm]);

  const isExpired = decoded?.payload ? isJWTExpired(decoded.payload) : false;
  const expiration = decoded?.payload?.exp
    ? formatExpiration(decoded.payload.exp as number | string)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 左側：輸入區域 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            JWT
          </label>
          <JWTDisplay
            jwt={jwt}
            placeholder="在此貼上你的 JWT"
            className="h-48"
            editable
            onChange={handleJWTChange}
          />
        </div>

        <KeyInput
          label="公鑰"
          value={publicKey}
          onChange={setPublicKey}
          placeholder={`-----BEGIN PUBLIC KEY-----
{在此輸入公鑰}
-----END PUBLIC KEY-----`}
        />

        <div>
          <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4" />
            JWKs 端點 URI
          </label>
          <input
            type="text"
            value={jwksUrl}
            onChange={(e) => setJwksUrl(e.target.value)}
            placeholder="https://example.com/.well-known/jwks.json"
            className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm"
          />
        </div>

        {verificationStatus && (
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

        {isVerifying && (
          <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <p className="text-sm text-gray-400">驗證中...</p>
          </div>
        )}
      </div>

      {/* 右側：輸出區域 */}
      <div className="space-y-4">
        <JSONViewer
          data={decoded?.header || null}
          label="已解碼標頭"
        />

        <JSONViewer
          data={decoded?.payload || null}
          label="已解碼有效載荷"
        />

        {decoded?.payload && (
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 space-y-2 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-white">Token 資訊</h3>
            {expiration && (
              <div className="text-sm">
                <span className="text-gray-400">過期時間：</span>
                <span className={`ml-2 ${isExpired ? 'text-red-400' : 'text-green-400'}`}>
                  {expiration} {isExpired && '(已過期)'}
                </span>
              </div>
            )}
            {decoded.payload.iat !== undefined && decoded.payload.iat !== null && (
              <div className="text-sm text-gray-400">
                <span>發行時間：</span>
                <span className="ml-2">
                  {formatExpiration(decoded.payload.iat as number | string)}
                </span>
              </div>
            )}
            {decoded.payload.iss !== undefined && decoded.payload.iss !== null && (
              <div className="text-sm text-gray-400">
                <span>發行者：</span>
                <span className="ml-2">{String(decoded.payload.iss)}</span>
              </div>
            )}
            {decoded.payload.sub !== undefined && decoded.payload.sub !== null && (
              <div className="text-sm text-gray-400">
                <span>主題：</span>
                <span className="ml-2">{String(decoded.payload.sub)}</span>
              </div>
            )}
          </div>
        )}

        {!decoded && jwt.trim() && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/50 backdrop-blur-sm">
            <p className="text-sm text-red-300">無法解碼 JWT。請檢查格式是否正確。</p>
          </div>
        )}
      </div>
    </div>
  );
}
