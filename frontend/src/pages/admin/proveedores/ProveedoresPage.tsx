import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { appsettings } from "../../../settings/appsettings";
import type { Proveedor } from "../../../interfaces/proveedores/Proveedor";
import type { ProveedorForm } from "../../../interfaces/proveedores/ProveedorForm";
import type { TipoProveedor } from "../../../interfaces/proveedores/TipoProveedor";
import { useNavigate } from 'react-router-dom';

export default function ProveedoresPage() {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [tipos, setTipos] = useState<TipoProveedor[]>([]);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState<ProveedorForm>({
        proveedorId: 0,
        nombre: '',
        telefono: 0,
        email: '',
        direccion: '',
        tipoProveedorId: 0
    });
    const [busqueda, setBusqueda] = useState('');
    const navigate = useNavigate();

    const fetchProveedores = async () => {
        const { data } = await axios.get(`${appsettings.apiUrl}Proveedor/Lista`);
        setProveedores(data as Proveedor[]);
    };

    const fetchTipos = async () => {
        const { data } = await axios.get(`${appsettings.apiUrl}TipoProveedor/Lista`);
        setTipos(data as TipoProveedor[]);
    };

    const handleCreate = async () => {
        if (!form.nombre.trim()) {
        Swal.fire('Validación', 'El nombre es obligatorio', 'warning');
        return;
        }
        try {
        await axios.post(`${appsettings.apiUrl}Proveedor/Nuevo`, form);
        Swal.fire('Creado', 'Proveedor creado exitosamente', 'success');
        resetForm();
        fetchProveedores();
        } catch {
        Swal.fire('Error', 'No se pudo crear el proveedor', 'error');
        }
    };

    const handleUpdate = async () => {
        try {
        await axios.put(`${appsettings.apiUrl}Proveedor/Editar`, form);
        Swal.fire('Actualizado', 'Proveedor actualizado exitosamente', 'success');
        resetForm();
        fetchProveedores();
        } catch {
        Swal.fire('Error', 'No se pudo actualizar el proveedor', 'error');
        }
    };

    const handleEdit = (p: Proveedor) => {
        const tipo = tipos.find(t => t.nombre === p.tipoProveedor);
        setForm({
        proveedorId: p.proveedorId,
        nombre: p.nombre,
        telefono: p.telefono,
        email: p.email,
        direccion: p.direccion,
        tipoProveedorId: tipo?.tipoProveedorId || 0
        });
        setIsEdit(true);
    };

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
        title: '¿Eliminar?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar'
        });
        if (confirm.isConfirmed) {
        await axios.delete(`${appsettings.apiUrl}Proveedor/Eliminar/${id}`);
        Swal.fire('Eliminado', 'Proveedor eliminado exitosamente', 'success');
        fetchProveedores();
        }
    };

    const resetForm = () => {
        setForm({
        proveedorId: 0,
        nombre: '',
        telefono: 0,
        email: '',
        direccion: '',
        tipoProveedorId: 0
        });
        setIsEdit(false);
    };

    useEffect(() => {
        fetchProveedores();
        fetchTipos();
    }, []);

    const proveedoresFiltrados = proveedores.filter(
        p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    
    return (
        <div className="container">
            <h3>Gestión de Proveedores</h3>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar nombre proveedor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            /> <br />

            <button
                className="btn btn-info mt-3"
                onClick={() => navigate('/admin/proveedores/tipo-proveedores')}
            >
                Administrar Tipos de Proveedor
            </button>

            <div className="row mb-3">
                <div className="col">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
                </div>
                <div className="col">
                <input
                    type="number"
                    className="form-control"
                    placeholder="Teléfono"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: Number(e.target.value) })}
                />
                </div>
                <div className="col">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                </div>
                <div className="col">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Dirección"
                    value={form.direccion}
                    onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                />
                </div>
                <div className="col">
                <select
                    className="form-control"
                    value={form.tipoProveedorId}
                    onChange={(e) => setForm({ ...form, tipoProveedorId: Number(e.target.value) })}
                >
                    <option value="">Seleccione tipo</option>
                    {tipos.map(t => (
                    <option key={t.tipoProveedorId} value={t.tipoProveedorId}>
                        {t.nombre}
                    </option>
                    ))}
                </select>
                </div>
                <div className="col d-flex align-items-center gap-2">
                <button className="btn btn-success" onClick={handleCreate} disabled={isEdit}>
                    Crear
                </button>
                <button className="btn btn-warning" onClick={handleUpdate} disabled={!isEdit}>
                    Actualizar
                </button>
                {isEdit && (
                    <button className="btn btn-secondary" onClick={resetForm}>
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
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Dirección</th>
                    <th>Tipo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {proveedoresFiltrados.map(p => (
                    <tr key={p.proveedorId}>
                    <td>{p.proveedorId}</td>
                    <td>{p.nombre}</td>
                    <td>{p.telefono}</td>
                    <td>{p.email}</td>
                    <td>{p.direccion}</td>
                    <td>{p.tipoProveedor}</td>
                    <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>
                        Editar
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.proveedorId)}>
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