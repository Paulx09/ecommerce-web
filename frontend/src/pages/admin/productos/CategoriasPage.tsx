import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { appsettings } from '../../../settings/appsettings';
import type { Categoria } from '../../../interfaces/productos/Categoria';

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [form, setForm] = useState<Categoria>({ categoriaId: 0, nombre: '' });
    const [isEdit, setIsEdit] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const fetchCategorias = async () => {
        try {
        const { data } = await axios.get(`${appsettings.apiUrl}Categoria/Lista`);
        setCategorias(data as Categoria[]);
        } catch {
        Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        if (isEdit) {
            await axios.put(`${appsettings.apiUrl}Categoria/Editar`, form);
            Swal.fire('Actualizado', 'Categoría actualizada', 'success');
        } else {
            await axios.post(`${appsettings.apiUrl}Categoria/Nuevo`, form);
            Swal.fire('Creado', 'Categoría creada', 'success');
        }
        resetForm();
        fetchCategorias();
        } catch {
        Swal.fire('Error', 'No se pudo guardar la categoría', 'error');
        }
    };

    const resetForm = () => {
        setForm({ categoriaId: 0, nombre: '' });
        setIsEdit(false);
    };
    
    const handleEdit = (categoria: Categoria) => {
        setForm(categoria);
        setIsEdit(true);
    };

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
        title: '¿Eliminar?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        });
        if (confirm.isConfirmed) {
        await axios.delete(`${appsettings.apiUrl}Categoria/Eliminar/${id}`);
        Swal.fire('Eliminado', 'Categoría eliminada', 'success');
        fetchCategorias();
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const categoriasFiltradas = categorias.filter(c =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container">
        <h3>Gestión de Categorías</h3>

        <input
            type="text"
            className="form-control mb-3"
            placeholder="Buscar categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
        />

        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row">
            <div className="col">
                <input
                type="text"
                className="form-control"
                placeholder="Nombre de la categoría"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                />
            </div>
            <div className="col d-flex align-items-center gap-2">
                <button type="submit" className="btn btn-success">
                {isEdit ? 'Actualizar' : 'Crear'} Categoría
                </button>
                {isEdit && (
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancelar
                </button>
                )}
            </div>
            </div>
        </form>

        <table className="table table-bordered">
            <thead className="table-light">
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {categoriasFiltradas.map((c) => (
                <tr key={c.categoriaId}>
                <td>{c.categoriaId}</td>
                <td>{c.nombre}</td>
                <td>
                    <button
                    onClick={() => handleEdit(c)}
                    className="btn btn-sm btn-warning me-2"
                    >
                    Editar
                    </button>
                    <button
                    onClick={() => handleDelete(c.categoriaId)}
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