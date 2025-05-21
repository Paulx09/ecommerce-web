import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { appsettings } from '../settings/appsettings';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${appsettings.apiUrl}Usuario/RegistrarCliente`, {
        nombre,
        email,
        password
      });

      Swal.fire('Éxito', 'Usuario registrado correctamente', 'success');
      navigate('/login');
    } catch {
      Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-control"
            required
          />
        </div>
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
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">Registrar</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/login')}>
            Volver al Login
          </button>
        </div>
      </form>
    </div>
  );
}
