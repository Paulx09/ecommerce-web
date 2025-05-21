using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Cliente
{
    public int ClienteId { get; set; }

    public int UsuarioId { get; set; }

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }

    public virtual ICollection<Ordene> Ordenes { get; set; } = new List<Ordene>();

    public virtual Usuario Usuario { get; set; } = null!;
}
