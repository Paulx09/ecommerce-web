using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class OrdenDetail
{
    public int OrdenDetailsId { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnit { get; set; }

    public int OrdenId { get; set; }

    public int ProductoId { get; set; }

    public virtual Ordene Orden { get; set; } = null!;

    public virtual Producto Producto { get; set; } = null!;
}
