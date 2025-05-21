import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { appsettings } from '../../../settings/appsettings';
import type { OrdenDetail } from '../../../interfaces/ordenes/OrdenDetail';

export default function OrdenesDetailPage() {
  const [detalles, setDetalles] = useState<OrdenDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const ordenId = Number(searchParams.get('ordenId'));

  const fetchDetalles = async () => {
    try {
      const { data } = await axios.get(`${appsettings.apiUrl}OrdenDetail/Lista`);
      const detallesOrden = (data as OrdenDetail[]).filter(d => d.ordenId === ordenId);
      setDetalles(detallesOrden);

      const suma = detallesOrden.reduce((acc, item) => acc + item.cantidad * item.precioUnit, 0);
      setTotal(suma);
    } catch {
      Swal.fire('Error', 'No se pudieron cargar los detalles de la orden', 'error');
    }
  };

  useEffect(() => {
    if (ordenId) fetchDetalles();
  }, [ordenId]);

  return (
    <div className="container">
      <h3>Detalles de Orden #{ordenId}</h3>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d) => (
            <tr key={d.ordenDetailsId}>
              <td>{d.producto}</td>
              <td>{d.cantidad}</td>
              <td>S/. {d.precioUnit.toFixed(2)}</td>
              <td>S/. {(d.cantidad * d.precioUnit).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4 className="mt-3">Total: S/. {total.toFixed(2)}</h4>
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Volver
      </button>
    </div>
  );
}
