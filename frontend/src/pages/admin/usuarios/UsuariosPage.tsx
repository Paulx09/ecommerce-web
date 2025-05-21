import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { appsettings } from '../../../settings/appsettings';
import type { Usuario } from '../../../interfaces/usuarios/Usuario';
import type { UsuarioForm } from '../../../interfaces/usuarios/UsuarioForm';
import type { Rol } from '../../../interfaces/usuarios/Rol'; 
import { useNavigate } from 'react-router-dom';

export default function UsuariosPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [form, setForm] = useState<UsuarioForm>({
    usuarioId: 0,
    nombre: '',
    email: '',
    estado: 'Activo',
    passwordHash: '',
    rolId: 0
  });
  const [isEdit, setIsEdit] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const fetchUsuarios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${appsettings.apiUrl}Usuario/Lista`);
      setUsuarios(data as Usuario[]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar usuarios';
      setError(message);
      Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get(`${appsettings.apiUrl}Role/Lista`);
      setRoles(data as Rol[]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar roles';
      setError(message);
      Swal.fire('Error', 'No se pudieron cargar los roles', 'error');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${appsettings.apiUrl}Usuario/Nuevo`, form);
      Swal.fire('Creado', 'Usuario creado con éxito', 'success');
      resetForm();
      fetchUsuarios();
    } catch {
      Swal.fire('Error', 'Error al crear usuario', 'error');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${appsettings.apiUrl}Usuario/Editar`, form);
      Swal.fire('Actualizado', 'Usuario editado con éxito', 'success');
      resetForm();
      fetchUsuarios();
    } catch {
      Swal.fire('Error', 'Error al actualizar usuario', 'error');
    }
  };

  const resetForm = () => {
    setForm({ usuarioId: 0, nombre: '', email: '', estado: 'Activo', passwordHash: '', rolId: 0 });
    setIsEdit(false);
  };

  const handleEdit = (usuario: Usuario) => {
    setForm({
      usuarioId: usuario.usuarioId,
      nombre: usuario.nombre,
      email: usuario.email,
      estado: usuario.estado,
      passwordHash: '',
      rolId: roles.find(r => r.nombreRol === usuario.rol)?.rolId || 0
    });
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
      await axios.delete(`${appsettings.apiUrl}Usuario/Eliminar/${id}`);
      Swal.fire('Eliminado', 'Usuario eliminado', 'success');
      fetchUsuarios();
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const usuariosFiltrados = usuarios.filter(
    u => u.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container">
      <h3>Gestión de Usuarios</h3>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      /> <br />

      <button
          className="btn btn-info mt-3"
          onClick={() => navigate('/admin/usuarios/roles')}
      >
          Administrar Roles
      </button>

      <form className="mb-4">
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>
          <div className="col">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="col">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={form.passwordHash}
              onChange={(e) => setForm({ ...form, passwordHash: e.target.value })}
              required={!isEdit}
            />
          </div>
          <div className="col">
            <select
              className="form-control"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="col">
            <select
              className="form-control"
              value={form.rolId}
              onChange={(e) => setForm({ ...form, rolId: parseInt(e.target.value) })}
              required
            >
              <option value="">Seleccione Rol</option>
              {roles.map((r) => (
                <option key={r.rolId} value={r.rolId}>{r.nombreRol}</option>
              ))}
            </select>
          </div>
          <div className="col d-flex align-items-center gap-2">
            <button type="button" onClick={handleCreate} disabled={isEdit} className="btn btn-success">
              Crear
            </button>
            <button type="button" onClick={handleUpdate} disabled={!isEdit} className="btn btn-warning">
              Actualizar
            </button>
            {isEdit && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center">
          <span className="spinner-border" role="status" aria-label="Cargando..."></span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.usuarioId}>
                <td>{u.usuarioId}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.estado}</td>
                <td>{u.rol}</td>
                <td>
                  <button
                    onClick={() => handleEdit(u)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(u.usuarioId)}
                    className="btn btn-sm btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}