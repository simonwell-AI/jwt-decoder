import { Algorithm } from '@/types/jwt';

export interface JWTExample {
  name: string;
  algorithm: Algorithm;
  jwt: string;
  header: string;
  payload: string;
  privateKey?: string;
  publicKey?: string;
  description?: string;
}

export const JWT_EXAMPLES: JWTExample[] = [
  {
    name: 'HS256 範例',
    algorithm: 'HS256',
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    header: JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2),
    payload: JSON.stringify(
      {
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
      },
      null,
      2
    ),
    privateKey: 'your-256-bit-secret',
    description: '使用 HS256 演算法的簡單範例',
  },
  {
    name: 'RS256 範例',
    algorithm: 'RS256',
    jwt: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.EkN-DOsnsuRjRO6BxXemmJDm3HbxrbRzXglbN2S4sOkopdU4IsDxTI8jO19W_A4K8ZPJijNLis4EZsHeY559a4DFOd50_OqgHGuERTqYZyuhtF39yxJPAjUESwxk2J5k_4zM3O-vtd1Ghyo4IbqKKSy6J9mTniYJPenn5-HIirE',
    header: JSON.stringify({ alg: 'RS256', typ: 'JWT' }, null, 2),
    payload: JSON.stringify(
      {
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
      },
      null,
      2
    ),
    description: '使用 RS256 演算法的範例（需要 RSA 密鑰對）',
  },
  {
    name: 'ES256 範例',
    algorithm: 'ES256',
    jwt: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KTVEce2Q3q2k1uStuN6t3hmHZhe4f5y5-mpMg8XzoB3dQ',
    header: JSON.stringify({ alg: 'ES256', typ: 'JWT' }, null, 2),
    payload: JSON.stringify(
      {
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
      },
      null,
      2
    ),
    description: '使用 ES256 演算法的範例（需要 ECDSA 密鑰對）',
  },
];

export function getExampleByName(name: string): JWTExample | undefined {
  return JWT_EXAMPLES.find((ex) => ex.name === name);
}
