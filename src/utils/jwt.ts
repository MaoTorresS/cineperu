import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'clave-super-secreta';

export const generarToken = (payload: object): string => {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
};

export const verificarToken = (token: string): any => {
  return jwt.verify(token, SECRET);
};
