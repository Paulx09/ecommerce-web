import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";
import { appsettings } from "../../../settings/appsettings";
import type { MetodoPago } from "../../../interfaces/compras/MetodoPago";
import type { Proveedor } from "../../../interfaces/proveedores/Proveedor";
import type { Compra } from "../../../interfaces/compras/Compra";

export default function ComprasPage() {
    const [compras, setCompras] = useState<Compra[]>([]);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [form, setForm] = useState({
        compraId: 0,
        proveedorId: 0,
        metodoPagoId: 0,
        fechaCompra: '',
        estado: 'Pagada',
    });
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate();

    const fetchCompras = async () => {
        try {
            const { data } = await axios.get(`${appsettings.apiUrl}Compra/Lista`);
            setCompras(data as Compra[]);
        } catch {
            Swal.fire('Error', 'No se pudieron cargar las compras', 'error');
        }
    };

    const fetchProveedores = async () => {
        const { data } = await axios.get(`${appsettings.apiUrl}Proveedor/Lista`);
        setProveedores(data as Proveedor[]);
    };

    const fetchMetodosPago = async () => {
        const { data } = await axios.get(`${appsettings.apiUrl}MetodoPago/Lista`);
        setMetodosPago(data as MetodoPago[]);
    };

    const handleCreate = async () => {
        try {
            await axios.post(`${appsettings.apiUrl}Compra/Nuevo`, form);
            Swal.fire('Agregado', 'Compra registrada', 'success');
            resetForm();
            fetchCompras();
        } catch {
            Swal.fire('Error', 'No se pudo registrar la compra', 'error');
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${appsettings.apiUrl}Compra/Editar`, form);
            Swal.fire('Actualizado', 'Compra actualizada', 'success');
            resetForm();
            fetchCompras();
        } catch {
        Swal.fire('Error', 'No se pudo actualizar la compra', 'error');
        }
    };

    const resetForm = () => {
        setForm({
            compraId: 0,
            proveedorId: 0,
            metodoPagoId: 0,
            fechaCompra: '',
            estado: 'Pagada',
        });
        setIsEdit(false);
    };

    const handleEdit = (compra: Compra) => {
        setForm({
            compraId: compra.compraId,
            proveedorId: proveedores.find(p => p.nombre === compra.proveedor)?.proveedorId || 0,
            metodoPagoId: metodosPago.find(m => m.nombre === compra.metodoPago)?.metodoPagoId || 0,
            fechaCompra: compra.fechaCompra,
            estado: compra.estado,
        });
        setIsEdit(true);
    };

    useEffect(() => {
        fetchCompras();
        fetchProveedores();
        fetchMetodosPago();
    }, []);

    return (
        <div className="container">
            <h3>Compras Registradas</h3>

            <button
            className="btn btn-info mt-3"
            onClick={() => navigate('/admin/compras/metodo-pago')}
            >
            Administrar Métodos de Pago
            </button>

            <div className="mb-4">
                <h4>{isEdit ? 'Actualizar Compra' : 'Agregar Compra'}</h4>
                <div className="row">
                <div className="col">
                    <select
                    className="form-control"
                    value={form.proveedorId}
                    onChange={(e) => setForm({ ...form, proveedorId: parseInt(e.target.value) })}
                    >
                    <option value="">Seleccione Proveedor</option>
                    {proveedores.map((p) => (
                        <option key={p.proveedorId} value={p.proveedorId}>{p.nombre}</option>
                    ))}
                    </select>
                </div>
                    <div className="col">
                    <select
                    className="form-control"
                    value={form.metodoPagoId}
                    onChange={(e) => setForm({ ...form, metodoPagoId: parseInt(e.target.value) })}
                    >
                    <option value="">Seleccione Método de Pago</option>
                    {metodosPago.map((m) => (
                        <option key={m.metodoPagoId} value={m.metodoPagoId}>{m.nombre}</option>
                    ))}
                    </select>
                </div>
                    <div className="col">
                    <input
                    type="date"
                    className="form-control"
                    value={form.fechaCompra}
                    onChange={(e) => setForm({ ...form, fechaCompra: e.target.value })}
                    />
                </div>
                <div className="col">
                    <select
                    className="form-control"
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                    >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagada">Pagada</option>
                    <option value="Cancelada">Cancelada</option>
                    </select>
                </div>
                <div className="col d-flex align-items-center gap-2">
                    <button onClick={handleCreate} disabled={isEdit} className="btn btn-success">Añadir Compra</button>
                    <button onClick={handleUpdate} disabled={!isEdit} className="btn btn-warning">Actualizar</button>
                    {isEdit && (
                    <button onClick={resetForm} className="btn btn-secondary">Cancelar</button>
                    )}
                </div>
                </div>
            </div>

            <table className="table table-bordered">
                <thead className="table-light">
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Proveedor</th>
                    <th>Método de Pago</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {compras.map((c) => (
                    <tr key={c.compraId}>
                    <td>{c.compraId}</td>
                    <td>{new Date(c.fechaCompra).toLocaleDateString()}</td>
                    <td>{c.estado}</td>
                    <td>{c.proveedor}</td>
                    <td>{c.metodoPago}</td>
                    <td>
                        <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => navigate(`/admin/compras/detalles?compraId=${c.compraId}`)}
                        >
                        Ver Detalles
                        </button>
                        <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(c)}
                        >
                        Editar
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
    );
}