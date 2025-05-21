using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class TipoProveedor
{
    public int TipoProveedorId { get; set; }

    public string Nombre { get; set; } = null!;

    public virtual ICollection<Proveedor> Proveedors { get; set; } = new List<Proveedor>();
}
