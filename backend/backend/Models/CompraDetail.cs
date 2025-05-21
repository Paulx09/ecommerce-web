using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class CompraDetail
{
    public int CompraDetailsId { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public int ProductoId { get; set; }

    public int CompraId { get; set; }

    public virtual Compra Compra { get; set; } = null!;

    public virtual Producto Producto { get; set; } = null!;
}
