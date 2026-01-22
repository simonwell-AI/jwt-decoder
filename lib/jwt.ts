import * as jose from 'jose';
import type { JWK } from 'jose';
import { Algorithm, JWTDecodeResult, JWTEncodeResult, JWTVerifyResult } from '@/types/jwt';
import { isSymmetric } from './algorithms';

/**
 * 解碼 JWT token（不驗證簽名）
 */
export function decodeJWT(token: string): JWTDecodeResult {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {
        success: false,
        error: '無效的 JWT 格式。JWT 應包含三個部分，以點號分隔。',
      };
    }

    const [headerBase64, payloadBase64, signature] = parts;

    // 解碼 header
    const headerJson = atob(headerBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const header = JSON.parse(headerJson);

    // 解碼 payload
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);

    return {
      success: true,
      decoded: {
        header,
        payload,
        signature,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '解碼 JWT 時發生錯誤',
    };
  }
}

/**
 * 驗證 JWT token 的簽名
 */
export async function verifyJWT(
  token: string,
  key: string,
  algorithm: Algorithm,
  jwksUrl?: string
): Promise<JWTVerifyResult> {
  try {
    let publicKey: any;

    // 如果提供了 JWKs URL，從中獲取公鑰
    if (jwksUrl) {
      const jwks = jose.createRemoteJWKSet(new URL(jwksUrl));
      publicKey = jwks;
    } else {
      // 根據演算法類型處理密鑰
      if (isSymmetric(algorithm)) {
        // 對稱加密：使用字串密鑰
        publicKey = new TextEncoder().encode(key) as Uint8Array;
      } else {
        // 非對稱加密：使用 PEM 格式公鑰
        try {
          publicKey = await jose.importSPKI(key, algorithm);
        } catch (error) {
          return {
            success: false,
            error: '無效的公鑰格式。請確保使用正確的 PEM 格式。',
          };
        }
      }
    }

    // 驗證 token
    try {
      await jose.jwtVerify(token, publicKey, {
        algorithms: [algorithm],
      });
      return {
        success: true,
        verified: true,
      };
    } catch (error) {
      if (error instanceof jose.errors.JWTExpired) {
        return {
          success: true,
          verified: false,
          error: 'JWT 已過期',
        };
      } else if (error instanceof jose.errors.JWTInvalid) {
        return {
          success: true,
          verified: false,
          error: 'JWT 簽名驗證失敗',
        };
      } else {
        return {
          success: true,
          verified: false,
          error: error instanceof Error ? error.message : '驗證失敗',
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '驗證 JWT 時發生錯誤',
    };
  }
}

/**
 * 編碼 JWT token
 */
export async function encodeJWT(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  algorithm: Algorithm,
  privateKey: string
): Promise<JWTEncodeResult> {
  try {
    let key: any;

    // 根據演算法類型處理密鑰
    if (isSymmetric(algorithm)) {
      // 對稱加密：使用字串密鑰
      key = new TextEncoder().encode(privateKey) as Uint8Array;
    } else {
      // 非對稱加密：使用 PEM 格式私鑰
      try {
        key = await jose.importPKCS8(privateKey, algorithm);
      } catch (error) {
        // 如果 PKCS8 格式失敗，嘗試 PKCS1 格式（RSA）
        try {
          key = await jose.importPKCS8(
            privateKey.replace('-----BEGIN RSA PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----').replace('-----END RSA PRIVATE KEY-----', '-----END PRIVATE KEY-----'),
            algorithm
          );
        } catch {
          return {
            success: false,
            error: '無效的私鑰格式。請確保使用正確的 PEM 格式。',
          };
        }
      }
    }

    // 確保 header 包含 alg
    const jwtHeader = {
      ...header,
      alg: algorithm,
    };

    // 創建 JWT
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader(jwtHeader)
      .sign(key);

    return {
      success: true,
      token,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '編碼 JWT 時發生錯誤',
    };
  }
}

/**
 * 檢查 JWT 是否過期
 */
export function isJWTExpired(payload: Record<string, unknown>): boolean {
  if (!payload.exp) {
    return false; // 沒有過期時間，視為不過期
  }

  const exp = typeof payload.exp === 'number' ? payload.exp : Number(payload.exp);
  const now = Math.floor(Date.now() / 1000);

  return exp < now;
}

/**
 * 格式化過期時間
 */
export function formatExpiration(exp: number | string): string {
  const expNum = typeof exp === 'number' ? exp : Number(exp);
  const date = new Date(expNum * 1000);
  return date.toLocaleString('zh-TW');
}
