import { useEffect, useState } from 'react';
import type { MetodoPago } from '../../../interfaces/compras/MetodoPago';
import axios from 'axios';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { appsettings } from '../../../settings/appsettings';
import Swal from 'sweetalert2';

export default function CarritoPage() {
  const {
    cartItems,
    actualizarCantidad,
    eliminarDelCarrito,
    limpiarCarrito,
    totalItems,
    totalPrecio,
  } = useCart();

  const baseImgUrl = appsettings.imgUrl;
  const { user } = useAuth();
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<number>(0);

  useEffect(() => {
    const fetchMetodosPago = async () => {
        try {
          const { data } = await axios.get(`${appsettings.apiUrl}MetodoPago/Lista`);
          setMetodosPago(data as MetodoPago[]);
        } catch {
          Swal.fire('Error', 'No se pudieron cargar los métodos de pago', 'error');
        }
      };
      fetchMetodosPago();
  }, []);

  if (cartItems.length === 0) {
    return <p>El carrito está vacío.</p>;
  }

  const handleCantidadChange = (productoId: number, cantidadStr: string) => {
    const cantidad = parseInt(cantidadStr, 10);
    if (isNaN(cantidad) || cantidad < 1) {
      Swal.fire('Cantidad inválida', 'La cantidad debe ser un número positivo.', 'warning');
      return;
    }

    const producto = cartItems.find(item => item.productoId === productoId);
    if (!producto) return;

    if (cantidad > producto.stock) {
      Swal.fire(
        'Cantidad inválida',
        `Solo hay ${producto.stock} unidades disponibles`,
        'warning'
      );
      return;
    }

    actualizarCantidad(productoId, cantidad);
  };



  return (
    <div className="container">
      <h3>Carrito de Compras</h3>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Imagen</th>
            <th>Producto</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.productoId}>
              <td>
                {item.imagenNombre ? (
                  <img
                    src={`${baseImgUrl}${item.imagenNombre}`}
                    alt={item.nombre}
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '80px', height: '80px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    Sin Imagen
                  </div>
                )}
              </td>
              <td>{item.nombre}</td>
              <td>S/. {item.precio.toFixed(2)}</td>
              <td>
                <input
                    type="number"
                    min={1}
                    value={item.cantidad}
                    onChange={e => handleCantidadChange(item.productoId, e.target.value)}
                    className="form-control"
                    style={{ width: '80px' }}
                />
              </td>
              <td>S/. {(item.precio * item.cantidad).toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarDelCarrito(item.productoId)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <strong>Total Items: </strong> {totalItems}
        </div>
        <div>
          <strong>Total Precio: </strong> S/. {totalPrecio.toFixed(2)}
        </div>
        <div className="mt-4">
          <label htmlFor="metodoPago" className="form-label">Método de Pago:</label>
          <select
            id="metodoPago"
            className="form-select"
            value={metodoSeleccionado}
            onChange={(e) => setMetodoSeleccionado(parseInt(e.target.value))}
          >
            <option value={0}>Seleccione un método</option>
            {metodosPago.map((m) => (
              <option key={m.metodoPagoId} value={m.metodoPagoId}>{m.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-warning" onClick={limpiarCarrito}>
          Vaciar Carrito
        </button>
        <button 
          className="btn btn-success"
          onClick={async () => {
            if (!user) return Swal.fire('Error', 'No has iniciado sesión', 'error');
            if (metodoSeleccionado === 0) {
              return Swal.fire('Advertencia', 'Debe seleccionar un método de pago', 'warning');
            }

            try {
              const ordenPayload = {
                fechaOrden: new Date(),
                estado: 'Pendiente',
                estadoEmail: 'Por Confirmar',
                clienteId: user.clienteId,
                metodoPagoId: metodoSeleccionado
              };

              const { data } = await axios.post(`${appsettings.apiUrl}Ordene/Nuevo`, ordenPayload);

              const ordenData = data as { ordenId?: number; id?: number };
              const nuevaOrdenId = ordenData.ordenId || ordenData.id || null;
              if (!nuevaOrdenId) throw new Error('No se obtuvo ID de orden');

              // Ahora insertar cada detalle
              for (const item of cartItems) {
                await axios.post(`${appsettings.apiUrl}OrdenDetail/Nuevo`, {
                  ordenId: nuevaOrdenId,
                  productoId: item.productoId,
                  cantidad: item.cantidad,
                  precioUnit: item.precio
                });
              }

              limpiarCarrito();
              Swal.fire('Éxito', 'Compra registrada exitosamente', 'success');
            } catch (error) {
              console.error(error);
              Swal.fire('Error', 'No se pudo completar la compra', 'error');
            }
          }}
        >
          Proceder a Comprar
        </button>
      </div>
    </div>
  );
}
