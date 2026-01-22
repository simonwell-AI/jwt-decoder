import * as jose from 'jose';
import type { JWK } from 'jose';

const jwksCache = new Map<string, { keys: JWK[]; expiresAt: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 分鐘

/**
 * 從 JWKs endpoint 獲取公鑰
 */
export async function fetchJWKS(jwksUrl: string): Promise<JWK[]> {
  // 檢查快取
  const cached = jwksCache.get(jwksUrl);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.keys;
  }

  try {
    const response = await fetch(jwksUrl);
    if (!response.ok) {
      throw new Error(`無法獲取 JWKs: ${response.statusText}`);
    }

    const data = await response.json();
    const keys = data.keys || [];

    // 更新快取
    jwksCache.set(jwksUrl, {
      keys,
      expiresAt: Date.now() + CACHE_DURATION,
    });

    return keys;
  } catch (error) {
    throw new Error(
      `獲取 JWKs 失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
    );
  }
}

/**
 * 從 JWKs 中選擇合適的公鑰
 */
export function selectKeyFromJWKS(
  keys: JWK[],
  algorithm: string,
  kid?: string
): JWK | null {
  // 如果指定了 kid，優先使用
  if (kid) {
    const key = keys.find((k) => k.kid === kid);
    if (key) return key;
  }

  // 否則選擇匹配演算法的第一個密鑰
  const matchingKey = keys.find((k) => k.alg === algorithm);
  return matchingKey || keys[0] || null;
}

/**
 * 清除 JWKs 快取
 */
export function clearJWKSCache(jwksUrl?: string): void {
  if (jwksUrl) {
    jwksCache.delete(jwksUrl);
  } else {
    jwksCache.clear();
  }
}
