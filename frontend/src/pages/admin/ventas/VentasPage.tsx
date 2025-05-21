import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { appsettings } from '../../../settings/appsettings';
import type { Ordene } from '../../../interfaces/ordenes/Ordene';
import { useNavigate } from 'react-router-dom';

export default function VentasPage() {
  const [ordenes, setOrdenes] = useState<Ordene[]>([]);
  const [ordenEditando, setOrdenEditando] = useState<Ordene | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const navigate = useNavigate();

  const handleEdit = (orden: Ordene) => {
    setOrdenEditando(orden);
    setNuevoEstado(orden.estado);
  };

  const guardarEstadoActualizado = async () => {
    if (!ordenEditando) return;

    try {
      await axios.put(
        `${appsettings.apiUrl}Ordene/ActualizarEstado/${ordenEditando.ordenId}`,
        nuevoEstado,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      Swal.fire('Actualizado', 'Estado de la orden actualizado', 'success');
      setOrdenEditando(null);
      fetchOrdenes();
    } catch {
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  };



  // Cargar todas las órdenes
  const fetchOrdenes = async () => {
    try {
      const { data } = await axios.get(`${appsettings.apiUrl}Ordene/Lista`);
      setOrdenes(data as Ordene[]);
    } catch {
      Swal.fire('Error', 'No se pudieron cargar las órdenes', 'error');
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  return (
    <div className="container">
      <h3>Ventas - Órdenes de Clientes</h3>

      {ordenEditando && (
        <div className="mb-3 p-3 border bg-light rounded">
          <h5>Actualizar estado de Orden #{ordenEditando.ordenId}</h5>
          <div className="row align-items-end">
            <div className="col-md-4">
              <label className="form-label">Nuevo Estado</label>
              <select
                className="form-select"
                value={nuevoEstado}
                onChange={e => setNuevoEstado(e.target.value)}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            <div className="col-md-auto d-flex gap-2">
              <button className="btn btn-success" onClick={guardarEstadoActualizado}>
                Guardar
              </button>
              <button className="btn btn-secondary" onClick={() => setOrdenEditando(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID Orden</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Cliente</th>
            <th>Método de Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map(o => (
            <tr key={o.ordenId}>
              <td>{o.ordenId}</td>
              <td>{new Date(o.fechaOrden).toLocaleDateString()}</td>
              <td>{o.estado}</td>
              <td>{o.cliente}</td>
              <td>{o.metodoPago}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(o)}
                  disabled={o.estado === 'Completado' || o.estado === 'Cancelado'}
                  >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => navigate(`/admin/ventas/detalles?ordenId=${o.ordenId}`)}
                >
                  Ver Detalles
                </button>                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
