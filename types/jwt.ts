export type Algorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512';

export type AlgorithmCategory = 'symmetric' | 'asymmetric';

export interface AlgorithmInfo {
  value: Algorithm;
  label: string;
  category: AlgorithmCategory;
  description: string;
}

export interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export interface JWTDecodeResult {
  success: boolean;
  decoded?: DecodedJWT;
  error?: string;
}

export interface JWTVerifyResult {
  success: boolean;
  verified?: boolean;
  error?: string;
}

export interface JWTEncodeResult {
  success: boolean;
  token?: string;
  error?: string;
}
