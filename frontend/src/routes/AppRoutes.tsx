import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PrivateRoute from '../components/PrivateRoute';
import Home from '../pages/Home';
import AdminDashboard from '../pages/admin/Dashboard';
import ClientDashboard from '../pages/client/Dashboard';

// Importación de las páginas para administración
import UsuariosPage from '../pages/admin/usuarios/UsuariosPage';
import RolesPage from '../pages/admin/usuarios/RolesPage';
import ProductosPage from '../pages/admin/productos/ProductosPage';
import CategoriasPage from '../pages/admin/productos/CategoriasPage';
import ProveedoresPage from '../pages/admin/proveedores/ProveedoresPage';
import TipoProveedoresPage from '../pages/admin/proveedores/TipoProveedoresPage';
import ComprasPage from '../pages/admin/compras/ComprasPage';
import MetodoPagoPage from '../pages/admin/compras/MetodoPagoPage';
import CompraDetailPage from '../pages/admin/compras/CompraDetailPage';

// Importación de las páginas para cliente
import ProductosClientPage from '../pages/client/productos/ProductosClientPage';
import OrdenesPage from '../pages/client/ordenes/OrdenesPage';
import VentasPage from '../pages/admin/ventas/VentasPage';
import VentasDetailPage from '../pages/admin/ventas/VentasDetailPage';
import { CartProvider } from '../context/CartContext';
import CarritoPage from '../pages/client/carrito/CarritoPage';
import OrdenesDetailPage from '../pages/client/ordenes/OrdenesDetailsPage';
import ChatPage from '../pages/client/chat/ChatPage';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={['Administrador']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="usuarios/roles" element={<RolesPage />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="productos/categorias" element={<CategoriasPage />} />
            <Route path="proveedores" element={<ProveedoresPage />} />
            <Route path="proveedores/tipo-proveedores" element={<TipoProveedoresPage />} />
            <Route path="compras" element={<ComprasPage />} />
            <Route path="compras/metodo-pago" element={<MetodoPagoPage />} />
            <Route path="compras/detalles" element={<CompraDetailPage />} />
            <Route path="ventas" element={<VentasPage />} />,
            <Route path="ventas/detalles" element={<VentasDetailPage />} />

          </Route>
          <Route
            path="/cliente/*"
            element={
              <PrivateRoute allowedRoles={['Cliente']}>
                <ClientDashboard />
              </PrivateRoute>
            }
          >
            <Route path="productos" element={<ProductosClientPage/>}/>
            <Route path="ordenes" element={<OrdenesPage/>}/>
            <Route path="ordenes/detalles" element={<OrdenesDetailPage/>}/>
            <Route path="carrito" element={<CarritoPage/>}/>
            <Route path="chat" element={<ChatPage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
