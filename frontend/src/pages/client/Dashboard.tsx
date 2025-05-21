import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <div className="container mt-4">
      <h2>Zona Cliente</h2>
      <p>Bienvenido, {user?.nombre}</p>

      <nav className="mb-4 d-flex flex-column gap-2">
        <Link to="/cliente/productos" className="btn btn-outline-primary">
          Productos
        </Link>
        <Link to="/cliente/chat" className="btn btn-outline-primary">
          Chat AI
        </Link>
        <Link to="/cliente/ordenes" className="btn btn-outline-primary">
          Órdenes
        </Link>
        <Link to="/cliente/carrito" className="btn btn-outline-success">
          Carrito ({totalItems})
        </Link>
      </nav>

      <Outlet />

      <button onClick={logout} className="btn btn-secondary mt-4">
        Cerrar sesión
      </button>
    </div>
  );
}
