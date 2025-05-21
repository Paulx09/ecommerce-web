import { useEffect, useState } from "react";
import axios from "axios";
import { appsettings } from "../../../settings/appsettings";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import type { Producto } from "../../../interfaces/productos/Producto";
import type { Categoria } from "../../../interfaces/productos/Categoria";

export default function ProductosPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [form, setForm] = useState({
        productoId: 0,
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        categoriaId: 0,
        imagenNombre: '',
    });
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const navigate = useNavigate();

    // Función para cargar productos
    const fetchProductos = async () => {
        try {
            const { data } = await axios.get(`${appsettings.apiUrl}Producto/Lista`);
            setProductos(data as Producto[]);
        } catch {
            Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        }
    };

    // Función para cargar categorías
    const fetchCategorias = async () => {
        try {
            const { data } = await axios.get(`${appsettings.apiUrl}Categoria/Lista`);
            setCategorias(data as Categoria[]);
        } catch {
            Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
        }
    };

    const handleImageUpload = async (): Promise<string> => {
        if (!imagenFile) return '';
        const formData = new FormData();
        formData.append("archivo", imagenFile);
        const { data } = await axios.post(`${appsettings.apiUrl}Producto/SubirImagen`, formData);
        return (data as { nombre: string }).nombre;
    };

    // Función para crear o actualizar un producto
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.nombre || !form.descripcion || !form.precio || !form.stock || form.categoriaId === 0) {
            Swal.fire('Error', 'Todos los campos deben estar completos', 'error');
            return;
        }

        try {
            let imagenNombre = form.imagenNombre; // Por defecto, usar la imagen actual

            if (imagenFile) {
                // Si seleccionó nueva imagen, subirla y obtener nuevo nombre
                imagenNombre = await handleImageUpload();
            }

            const payload = { ...form, imagenNombre };

            if (isEdit) {
                await axios.put(`${appsettings.apiUrl}Producto/Editar`, payload);
                Swal.fire('Actualizado', 'Producto actualizado', 'success');
            } else {
                await axios.post(`${appsettings.apiUrl}Producto/Nuevo`, payload);
                Swal.fire('Creado', 'Producto creado', 'success');
            }
            resetForm();
            fetchProductos();
        } catch {
            Swal.fire('Error', 'No se pudo guardar el producto', 'error');
        }
    };

    // Función para resetear el formulario y cambiar el estado de edición
    const resetForm = () => {
        setForm({
        productoId: 0,
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        categoriaId: 0,
        imagenNombre: '',
        });
        setImagenFile(null);
        setIsEdit(false);
    };

    // Función para editar un producto
    const handleEdit = (producto: Producto) => {
        setForm({
            productoId: producto.productoId,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock,
            categoriaId: categorias.find(c => c.nombre === producto.categoria)?.categoriaId || 0,
            imagenNombre: producto.imagenNombre || '',
        });
        setIsEdit(true);
    };

    // Función para eliminar un producto
    const handleDelete = async (productoId: number) => {
        const confirm = await Swal.fire({
            title: '¿Eliminar?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
        });
        if (confirm.isConfirmed) {
            await axios.delete(`${appsettings.apiUrl}Producto/Eliminar/${productoId}`);
            Swal.fire('Eliminado', 'Producto eliminado', 'success');
            fetchProductos();
        }
    };

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );
    
    return (
        <div className="container">
            <h3>Gestión de Productos</h3>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre o categoría"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <button
                className="btn btn-info mt-3"
                onClick={() => navigate('/admin/productos/categorias')}
            >
                Administrar Categorías
            </button>
                <h4>{isEdit ? 'Actualizar Producto' : 'Agregar Producto'}</h4>
                <div className="row">
                <div className="col">
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del producto"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                    />
                </div>
                <div className="col">
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Descripción"
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    required
                    />
                </div>
                <div className="col">
                    <input
                    type="number"
                    className="form-control"
                    placeholder="Precio"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) })}
                    required
                    />
                </div>
                <div className="col">
                    <input
                    type="number"
                    className="form-control"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                    required
                    />
                </div>
                <div className="col">
                    <select
                    className="form-control"
                    value={form.categoriaId}
                    onChange={(e) => setForm({ ...form, categoriaId: parseInt(e.target.value) })}
                    required
                    >
                    <option value="">Seleccione Categoría</option>
                    {categorias.map((c) => (
                        <option key={c.categoriaId} value={c.categoriaId}>{c.nombre}</option>
                    ))}
                    </select>
                </div>
                <div className="col">
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
                    />
                </div>
                <div className="col d-flex align-items-center gap-2">
                    <button onClick={handleSubmit} disabled={isEdit} className="btn btn-success">
                    Agregar Producto
                    </button>
                    <button onClick={handleSubmit} disabled={!isEdit} className="btn btn-warning">
                    Actualizar
                    </button>
                    {isEdit && (
                    <button onClick={resetForm} className="btn btn-secondary">
                        Cancelar
                    </button>
                    )}
                </div>
                </div>
            </div>

            <table className="table table-bordered">
                <thead className="table-light">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    {productosFiltrados.map((p) => (
                        <tr key={p.productoId}>
                        <td>{p.productoId}</td>
                        <td>{p.nombre}</td>
                        <td>{p.descripcion}</td>
                        <td>{p.precio}</td>
                        <td>{p.stock}</td>
                        <td>{p.categoria}</td>
                        <td>
                            <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(p)}
                            >
                            Editar
                            </button>
                            <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(p.productoId)}
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