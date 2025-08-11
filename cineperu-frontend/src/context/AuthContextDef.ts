import { createContext } from 'react';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  imagen_perfil?: string;
}

export type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
