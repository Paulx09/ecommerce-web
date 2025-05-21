import { useEffect, useState } from 'react';
import axios from 'axios';
import { appsettings } from '../../../settings/appsettings';
import Swal from 'sweetalert2';
import type { Ordene } from '../../../interfaces/ordenes/Ordene';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Ordene[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchOrdenesCliente = async () => {
    try {
        const { data } = await axios.get(`${appsettings.apiUrl}Ordene/PorCliente/${user?.clienteId}`);
        setOrdenes(data as Ordene[]);
    } catch {
        Swal.fire('Error', 'No se pudieron cargar las órdenes del cliente', 'error');
    }
  };


  useEffect(() => {
    if (user?.clienteId) fetchOrdenesCliente();
  }, [user]);

  return (
    <div className="container">
      <h3>Mis Órdenes</h3>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Estado</th>
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
              <td>{o.metodoPago}</td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => navigate(`/cliente/ordenes/detalles?ordenId=${o.ordenId}`)}
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
