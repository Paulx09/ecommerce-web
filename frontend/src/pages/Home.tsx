import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log('Render Home - user:', user);

  useEffect(() => {
    if (!user) return;
    if (user.rol === 'Administrador') navigate('/admin');
    else if (user.rol === 'Cliente') navigate('/cliente');
  }, [user, navigate]);

  return (
    <div className="container mt-5">
      <h1>Bienvenido a la Technology Fix</h1>
      <p>Por favor inicia sesión para continuar.</p>
      <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
    </div>
  );
}