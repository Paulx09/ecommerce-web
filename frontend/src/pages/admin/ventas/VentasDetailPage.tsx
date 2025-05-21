import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { appsettings } from '../../../settings/appsettings';
import type { OrdenDetail } from '../../../interfaces/ordenes/OrdenDetail';

export default function VentasDetailPage() {
  const [detalles, setDetalles] = useState<OrdenDetail[]>([]);
  const [totalVenta, setTotalVenta] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const ordenId = Number(searchParams.get('ordenId'));

  useEffect(() => {
    const fetchDetalles = async () => {
      if (!ordenId) {
        Swal.fire('Error', 'No se especificó la orden', 'error');
        return;
      }
      try {
        const { data } = await axios.get(`${appsettings.apiUrl}OrdenDetail/Lista`);
        const detallesOrden = (data as OrdenDetail[]).filter(d => d.ordenId === ordenId);
        setDetalles(detallesOrden);

        const total = detallesOrden.reduce(
          (acc, item) => acc + item.cantidad * item.precioUnit,
          0
        );
        setTotalVenta(total);
      } catch {
        Swal.fire('Error', 'No se pudieron cargar los detalles', 'error');
      }
    };
    fetchDetalles();
  }, [ordenId]);

  return (
    <div className="container">
      <h3>Detalles de Venta - Orden #{ordenId}</h3>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID Detalle</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d) => (
            <tr key={d.ordenDetailsId}>
              <td>{d.ordenDetailsId}</td>
              <td>{d.producto}</td>
              <td>{d.cantidad}</td>
              <td>{d.precioUnit.toFixed(2)}</td>
              <td>{(d.cantidad * d.precioUnit).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total de la venta: S/. {totalVenta.toFixed(2)}</h3>

      <button className="btn btn-secondary" onClick={() => navigate('/admin/ventas')}>
        Volver a Ventas
      </button>

      
    </div>
  );
}

