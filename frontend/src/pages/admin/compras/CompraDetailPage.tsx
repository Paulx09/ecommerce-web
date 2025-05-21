import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { appsettings } from '../../../settings/appsettings';
import type { CompraDetail } from '../../../interfaces/compras/CompraDetail';
import type { CompraDetailForm } from '../../../interfaces/compras/CompraDetailForm';
import type { Producto } from '../../../interfaces/productos/Producto';

export default function CompraDetailPage() {
    const [searchParams] = useSearchParams();
    const compraId = parseInt(searchParams.get('compraId') || '0');
    const [detalles, setDetalles] = useState<CompraDetail[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [form, setForm] = useState<CompraDetailForm>({
        compraDetailsId: 0,
        compraId,
        productoId: 0,
        cantidad: 0,
        precioUnitario: 0
    });
    const [isEdit, setIsEdit] = useState(false);

    const fetchDetalles = async () => {
        const { data } = await axios.get(`${appsettings.apiUrl}CompraDetail/Lista`);
        const filtered = data.filter((d: CompraDetail) => d.compraId === compraId);
        setDetalles(filtered);
    };

    const fetchProductos = async () => {
        const { data } = await axios.get(`${appsettings.apiUrl}Producto/Lista`);
        setProductos(data as Producto[]);
    };

    const handleCreate = async () => {
        try {
            await axios.post(`${appsettings.apiUrl}CompraDetail/Nuevo`, form);
            Swal.fire('Agregado', 'Detalle registrado', 'success');
            resetForm();
            fetchDetalles();
        } catch {
            Swal.fire('Error', 'No se pudo agregar el detalle', 'error');
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${appsettings.apiUrl}CompraDetail/Editar`, form);
            Swal.fire('Actualizado', 'Detalle actualizado', 'success');
            resetForm();
            fetchDetalles();
        } catch {
            Swal.fire('Error', 'No se pudo actualizar el detalle', 'error');
        }
    };

    const resetForm = () => {
        setForm({ compraDetailsId: 0, compraId, productoId: 0, cantidad: 0, precioUnitario: 0 });
        setIsEdit(false);
    };

    const handleEdit = (d: CompraDetail) => {
        setForm({
            compraDetailsId: d.compraDetailsId,
            compraId: d.compraId,
            productoId: d.productoId,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario
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
            await axios.delete(`${appsettings.apiUrl}CompraDetail/Eliminar/${id}`);
            Swal.fire('Eliminado', 'Detalle eliminado', 'success');
            fetchDetalles();
        }
    };

    useEffect(() => {
        fetchDetalles();
        fetchProductos();
    }, [compraId]);
    
    return (
        <div className="container">
        <h3>Detalle de Compra #{compraId}</h3>

        <div className="row mb-3">
            <div className="col">
            <select
                className="form-control"
                value={form.productoId}
                onChange={(e) => setForm({ ...form, productoId: parseInt(e.target.value) })}
            >
                <option value="">Seleccione Producto</option>
                {productos.map(p => (
                <option key={p.productoId} value={p.productoId}>{p.nombre}</option>
                ))}
            </select>
            </div>
            <div className="col">
            <input
                type="number"
                className="form-control"
                placeholder="Cantidad"
                value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: parseInt(e.target.value) })}
            />
            </div>
            <div className="col">
            <input
                type="number"
                className="form-control"
                placeholder="Precio Unitario"
                value={form.precioUnitario}
                onChange={(e) => setForm({ ...form, precioUnitario: parseFloat(e.target.value) })}
            />
            </div>
            <div className="col d-flex align-items-center gap-2">
            <button className="btn btn-success" onClick={handleCreate} disabled={isEdit}>
                Agregar
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
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Costo Total</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {detalles.map((d) => (
                <tr key={d.compraDetailsId}>
                <td>{d.compraDetailsId}</td>
                <td>{d.producto}</td>
                <td>{d.cantidad}</td>
                <td>{d.precioUnitario}</td>
                <td>{d.cantidad * d.precioUnitario}</td>
                <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(d)}>
                    Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d.compraDetailsId)}>
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