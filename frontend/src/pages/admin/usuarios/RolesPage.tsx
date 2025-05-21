import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { appsettings } from '../../../settings/appsettings';
import type { Rol } from '../../../interfaces/usuarios/Rol';

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [nombreRol, setNombreRol] = useState('');
  const [rolId, setRolId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get(`${appsettings.apiUrl}Role/Lista`);
      setRoles(data as Rol[]);
    } catch {
      Swal.fire('Error', 'No se pudieron cargar los roles', 'error');
    }
  };

  const resetForm = () => {
    setRolId(0);
    setNombreRol('');
    setIsEdit(false);
  };

  const handleCreate = async () => {
    if (!nombreRol.trim()) {
      Swal.fire('Advertencia', 'El nombre del rol es obligatorio', 'warning');
      return;
    }
    try {
      await axios.post(`${appsettings.apiUrl}Role/Nuevo`, { nombreRol });
      Swal.fire('Creado', 'Rol creado con éxito', 'success');
      resetForm();
      fetchRoles();
    } catch {
      Swal.fire('Error', 'No se pudo crear el rol', 'error');
    }
  };

  const handleUpdate = async () => {
    if (!nombreRol.trim()) {
      Swal.fire('Advertencia', 'El nombre del rol es obligatorio', 'warning');
      return;
    }
    try {
      await axios.put(`${appsettings.apiUrl}Role/Editar`, { rolId, nombreRol });
      Swal.fire('Actualizado', 'Rol actualizado con éxito', 'success');
      resetForm();
      fetchRoles();
    } catch {
      Swal.fire('Error', 'No se pudo actualizar el rol', 'error');
    }
  };

  const handleEdit = (rol: Rol) => {
    setRolId(rol.rolId);
    setNombreRol(rol.nombreRol);
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
      await axios.delete(`${appsettings.apiUrl}Role/Eliminar/${id}`);
      Swal.fire('Eliminado', 'Rol eliminado', 'success');
      fetchRoles();
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="container">
      <h3>Gestión de Roles</h3>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del Rol"
            value={nombreRol}
            onChange={(e) => setNombreRol(e.target.value)}
            required
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
          {roles.map((rol) => (
            <tr key={rol.rolId}>
              <td>{rol.rolId}</td>
              <td>{rol.nombreRol}</td>
              <td>
                <button
                  onClick={() => handleEdit(rol)}
                  className="btn btn-sm btn-warning me-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(rol.rolId)}
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