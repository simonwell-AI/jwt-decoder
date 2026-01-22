import { Algorithm, AlgorithmInfo, AlgorithmCategory } from '@/types/jwt';

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    value: 'HS256',
    label: 'HS256 (HMAC with SHA-256)',
    category: 'symmetric',
    description: '對稱加密，使用共享密鑰',
  },
  {
    value: 'HS384',
    label: 'HS384 (HMAC with SHA-384)',
    category: 'symmetric',
    description: '對稱加密，使用共享密鑰',
  },
  {
    value: 'HS512',
    label: 'HS512 (HMAC with SHA-512)',
    category: 'symmetric',
    description: '對稱加密，使用共享密鑰',
  },
  {
    value: 'RS256',
    label: 'RS256 (RSA with SHA-256)',
    category: 'asymmetric',
    description: '非對稱加密，使用 RSA 公鑰/私鑰對',
  },
  {
    value: 'RS384',
    label: 'RS384 (RSA with SHA-384)',
    category: 'asymmetric',
    description: '非對稱加密，使用 RSA 公鑰/私鑰對',
  },
  {
    value: 'RS512',
    label: 'RS512 (RSA with SHA-512)',
    category: 'asymmetric',
    description: '非對稱加密，使用 RSA 公鑰/私鑰對',
  },
  {
    value: 'ES256',
    label: 'ES256 (ECDSA with P-256 and SHA-256)',
    category: 'asymmetric',
    description: '非對稱加密，使用 ECDSA 公鑰/私鑰對',
  },
  {
    value: 'ES384',
    label: 'ES384 (ECDSA with P-384 and SHA-384)',
    category: 'asymmetric',
    description: '非對稱加密，使用 ECDSA 公鑰/私鑰對',
  },
  {
    value: 'ES512',
    label: 'ES512 (ECDSA with P-521 and SHA-512)',
    category: 'asymmetric',
    description: '非對稱加密，使用 ECDSA 公鑰/私鑰對',
  },
  {
    value: 'PS256',
    label: 'PS256 (RSA-PSS with SHA-256)',
    category: 'asymmetric',
    description: '非對稱加密，使用 RSA-PSS 公鑰/私鑰對',
  },
  {
    value: 'PS384',
    label: 'PS384 (RSA-PSS with SHA-384)',
    category: 'asymmetric',
    description: '非對稱加密，使用 RSA-PSS 公鑰/私鑰對',
  },
  {
    value: 'PS512',
    label: 'PS512 (RSA-PSS with SHA-512)',
    category: 'asymmetric',
    description: '非對稱加密，使用 RSA-PSS 公鑰/私鑰對',
  },
];

export function getAlgorithmInfo(algorithm: Algorithm): AlgorithmInfo | undefined {
  return ALGORITHMS.find((alg) => alg.value === algorithm);
}

export function getAlgorithmsByCategory(category: AlgorithmCategory): AlgorithmInfo[] {
  return ALGORITHMS.filter((alg) => alg.category === category);
}

export function isSymmetric(algorithm: Algorithm): boolean {
  return algorithm.startsWith('HS');
}

export function isAsymmetric(algorithm: Algorithm): boolean {
  return !isSymmetric(algorithm);
}
