using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class MetodoPago
{
    public int MetodoPagoId { get; set; }

    public string Nombre { get; set; } = null!;

    public virtual ICollection<Compra> Compras { get; set; } = new List<Compra>();

    public virtual ICollection<Ordene> Ordenes { get; set; } = new List<Ordene>();
}
