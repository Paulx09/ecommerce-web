import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { appsettings } from "../../../settings/appsettings";
import type { Producto } from "../../../interfaces/productos/Producto";
import { useCart } from "../../../context/CartContext";

export default function ProductosClientPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cantidades, setCantidades] = useState<Record<number, number>>({});
  const { agregarAlCarrito } = useCart();

  const fetchProductos = async () => {
    try {
      const { data } = await axios.get(`${appsettings.apiUrl}Producto/Lista`);
      setProductos(data as Producto[]);
      // Inicializar cantidades a 1 por producto
      const iniciales: Record<number, number> = {};
      (data as Producto[]).forEach((p) => (iniciales[p.productoId] = 1));
      setCantidades(iniciales);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleCantidadChange = (productoId: number, valor: number) => {
    if (valor < 1) valor = 1;
    setCantidades((prev) => ({ ...prev, [productoId]: valor }));
  };

  const handleAgregar = (producto: Producto) => {
    const cantidad = cantidades[producto.productoId] || 1;
    if (cantidad > producto.stock) {
      Swal.fire(
        "Cantidad inválida",
        `Solo hay ${producto.stock} unidades disponibles`,
        "warning"
      );
      return;
    }

    // Crear objeto CartItem con la cantidad
    const itemToAdd = {
      productoId: producto.productoId,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad,
      imagenNombre: producto.imagenNombre || '',
      stock: producto.stock,
    };

    agregarAlCarrito(itemToAdd);

    Swal.fire("Agregado", `${producto.nombre} agregado al carrito`, "success");
  };

  const baseImgUrl = appsettings.imgUrl;

  return (
    <div className="container">
      <h3>Catálogo de Productos</h3>
      <div className="row">
        {productos.map((producto) => (
          <div
            key={producto.productoId}
            className="card col-md-3 m-2 p-0"
            style={{ width: "18rem" }}
          >
            {producto.imagenNombre ? (
              <img style={{ height: "180px" }}
                src={`${baseImgUrl}${producto.imagenNombre}`}
                className="card-img-top"
                alt={producto.nombre}
              />
            ) : (
              <div
                style={{
                  height: "180px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f0f0f0",
                  color: "#999",
                }}
              >
                Sin Imagen
              </div>
            )}
            <div className="card-body">
              <h5 className="card-title">{producto.nombre}</h5>
              <p className="card-text">{producto.descripcion}</p>
              <p>Precio: S/. {producto.precio.toFixed(2)}</p>
              <p>
                Stock:{" "}
                {producto.stock > 0 ? (
                  <span className="text-success">Disponible</span>
                ) : (
                  <span className="text-danger">Agotado</span>
                )}
              </p>
              <input
                type="number"
                className="form-control mb-2"
                min={1}
                max={producto.stock}
                value={cantidades[producto.productoId] || 1}
                onChange={(e) =>
                  handleCantidadChange(
                    producto.productoId,
                    parseInt(e.target.value) || 1
                  )
                }
                disabled={producto.stock === 0}
              />
              <button
                className="btn btn-primary"
                onClick={() => handleAgregar(producto)}
                disabled={producto.stock === 0}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
