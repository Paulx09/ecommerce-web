import { createContext, useContext, useEffect, useState } from 'react';
import type { Usuario } from '../interfaces/usuarios/Usuario';
import Swal from 'sweetalert2';
import axios from 'axios';
import { appsettings } from '../settings/appsettings';

interface AuthContextType {
  user: Usuario | null;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      console.log('Llamando API con:', email, password);
      const { data } = await axios.post(`${appsettings.apiUrl}Usuario/Login`, {
        email,
        password
      });
      console.log('Respuesta login:', data);

      setUser(data as Usuario);
      if (remember) {
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        sessionStorage.setItem('user', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error en login:', error);
      Swal.fire('Error', 'Credenciales incorrectas o error de conexión', 'error');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};