import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, remember);
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className="form-check-input"
          />
          <label className="form-check-label">Recordarme</label>
        </div>
        <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">Ingresar</button>
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/')}>Regresar</button>
        <button type="button" className="btn btn-outline-success" onClick={() => navigate('/register')}>
          Registrarse
        </button>
      </div>
      </form>
    </div>
  );
}
