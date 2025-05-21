import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { appsettings } from '../../../settings/appsettings';
import type { TipoProveedor } from '../../../interfaces/proveedores/TipoProveedor';

export default function TipoProveedoresPage() {
    const [tipos, setTipos] = useState<TipoProveedor[]>([]);
    const [tipoProveedorId, setTipoProveedorId] = useState(0);
    const [nombre, setNombre] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    const fetchTipos = async () => {
        try {
        const { data } = await axios.get(`${appsettings.apiUrl}TipoProveedor/Lista`);
        setTipos(data as TipoProveedor[]);
        } catch {
        Swal.fire('Error', 'No se pudieron cargar los tipos de proveedor', 'error');
        }
    };

    const resetForm = () => {
        setTipoProveedorId(0);
        setNombre('');
        setIsEdit(false);
    };

    const handleCreate = async () => {
        if (!nombre.trim()) {
        Swal.fire('Advertencia', 'El nombre es obligatorio', 'warning');
        return;
        }
        try {
        await axios.post(`${appsettings.apiUrl}TipoProveedor/Nuevo`, { nombre });
        Swal.fire('Creado', 'Tipo de proveedor creado', 'success');
        resetForm();
        fetchTipos();
        } catch {
        Swal.fire('Error', 'Error al crear tipo de proveedor', 'error');
        }
    };

    const handleUpdate = async () => {
        if (!nombre.trim()) {
        Swal.fire('Advertencia', 'El nombre es obligatorio', 'warning');
        return;
        }
        try {
        await axios.put(`${appsettings.apiUrl}TipoProveedor/Editar`, { tipoProveedorId, nombre });
        Swal.fire('Actualizado', 'Tipo de proveedor actualizado', 'success');
        resetForm();
        fetchTipos();
        } catch {
        Swal.fire('Error', 'Error al actualizar tipo de proveedor', 'error');
        }
    };

    const handleEdit = (tipo: TipoProveedor) => {
        setTipoProveedorId(tipo.tipoProveedorId);
        setNombre(tipo.nombre);
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
        await axios.delete(`${appsettings.apiUrl}TipoProveedor/Eliminar/${id}`);
        Swal.fire('Eliminado', 'Tipo de proveedor eliminado', 'success');
        fetchTipos();
        }
    };

    useEffect(() => {
        fetchTipos();
    }, []);

    const tiposFiltrados = tipos.filter(
      t => t.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    
    return (
        <div className="container">
      <h3>Gestión de Tipos de Proveedor</h3>

      <input
            type="text"
            className="form-control mb-3"
            placeholder="Buscar tipo de proveedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
        />

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del Tipo"
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
          {tiposFiltrados.map((tipo) => (
            <tr key={tipo.tipoProveedorId}>
              <td>{tipo.tipoProveedorId}</td>
              <td>{tipo.nombre}</td>
              <td>
                <button
                  onClick={() => handleEdit(tipo)}
                  className="btn btn-sm btn-warning me-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(tipo.tipoProveedorId)}
                  className="btn btn-sm btn-danger"
                >
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