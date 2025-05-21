import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { appsettings } from '../../../settings/appsettings';
import type { MetodoPago } from '../../../interfaces/compras/MetodoPago';

export default function MetodoPagoPage() {
    const [metodos, setMetodos] = useState<MetodoPago[]>([]);
    const [metodoPagoId, setMetodoPagoId] = useState(0);
    const [nombre, setNombre] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    const fetchMetodos = async () => {
        try {
        const { data } = await axios.get(`${appsettings.apiUrl}MetodoPago/Lista`);
        setMetodos(data as MetodoPago[]);
        } catch {
        Swal.fire('Error', 'No se pudieron cargar los métodos de pago', 'error');
        }
    };

    const resetForm = () => {
        setMetodoPagoId(0);
        setNombre('');
        setIsEdit(false);
    };

    const handleCreate = async () => {
        if (!nombre.trim()) {
        Swal.fire('Advertencia', 'El nombre es obligatorio', 'warning');
        return;
        }
        try {
        await axios.post(`${appsettings.apiUrl}MetodoPago/Nuevo`, { nombre });
        Swal.fire('Creado', 'Método de pago creado', 'success');
        resetForm();
        fetchMetodos();
        } catch {
        Swal.fire('Error', 'No se pudo crear el método de pago', 'error');
        }
    };

    const handleUpdate = async () => {
        if (!nombre.trim()) {
        Swal.fire('Advertencia', 'El nombre es obligatorio', 'warning');
        return;
        }
        try {
        await axios.put(`${appsettings.apiUrl}MetodoPago/Editar`, { metodoPagoId, nombre });
        Swal.fire('Actualizado', 'Método de pago actualizado', 'success');
        resetForm();
        fetchMetodos();
        } catch {
        Swal.fire('Error', 'No se pudo actualizar el método de pago', 'error');
        }
    };

    const handleEdit = (m: MetodoPago) => {
        setMetodoPagoId(m.metodoPagoId);
        setNombre(m.nombre);
        setIsEdit(true);
    };

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
        title: '¿Eliminar?',
        text: 'Esto no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar'
        });
        if (confirm.isConfirmed) {
        await axios.delete(`${appsettings.apiUrl}MetodoPago/Eliminar/${id}`);
        Swal.fire('Eliminado', 'Método de pago eliminado', 'success');
        fetchMetodos();
        }
    };

    useEffect(() => {
        fetchMetodos();
    }, []);

    const metodosFiltrados = metodos.filter(
        m => m.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    
    return (
        <div className="container">
      <h3>Gestión de Métodos de Pago</h3>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar método de pago..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del Método"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="col d-flex gap-2 align-items-center">
          <button onClick={handleCreate} disabled={isEdit} className="btn btn-success">
            Crear
          </button>
          <button onClick={handleUpdate} disabled={!isEdit} className="btn btn-warning">
            Actualizar
          </button>
          {isEdit && (
            <button onClick={resetForm} className="btn btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {metodosFiltrados.map((m) => (
            <tr key={m.metodoPagoId}>
              <td>{m.metodoPagoId}</td>
              <td>{m.nombre}</td>
              <td>
                <button onClick={() => handleEdit(m)} className="btn btn-sm btn-warning me-2">
                  Editar
                </button>
                <button onClick={() => handleDelete(m.metodoPagoId)} className="btn btn-sm btn-danger">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
}