import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="container mt-4">
      <h2>Zona Administrador</h2>
      <p>Bienvenido, {user?.nombre}</p>

      <nav className="mb-4 d-flex flex-column gap-2">
        <Link to="/admin/usuarios" className="btn btn-outline-primary">Usuarios</Link><br />
        <Link to="/admin/productos" className="btn btn-outline-primary">Productos</Link><br />
        <Link to="/admin/proveedores" className="btn btn-outline-primary">Proveedores</Link><br />
        <Link to="/admin/compras" className="btn btn-outline-primary">Compras</Link><br />
        <Link to="/admin/ventas" className="btn btn-outline-primary">Ventas</Link>
      </nav>

      <Outlet />

      <button onClick={logout} className="btn btn-danger mt-4">Cerrar sesión</button>
    </div>
  );
}
