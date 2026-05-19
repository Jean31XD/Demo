import jwt from 'jsonwebtoken';

interface JwtPayload {
  customerId: string;
  email: string;
}

const SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

/** Extrae el token Bearer del header Authorization */
export const extractToken = (authHeader?: string): string | null => {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
};
