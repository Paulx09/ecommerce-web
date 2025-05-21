using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Compra
{
    public int CompraId { get; set; }

    public DateTime FechaCompra { get; set; }

    public string Estado { get; set; } = null!;

    public int MetodoPagoId { get; set; }

    public int ProveedorId { get; set; }

    public virtual ICollection<CompraDetail> CompraDetails { get; set; } = new List<CompraDetail>();

    public virtual MetodoPago MetodoPago { get; set; } = null!;

    public virtual Proveedor Proveedor { get; set; } = null!;
}
