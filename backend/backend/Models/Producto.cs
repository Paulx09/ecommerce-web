using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Producto
{
    public int ProductoId { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public decimal Precio { get; set; }

    public int Stock { get; set; }

    public string Disponibilidad { get; set; } = null!;

    public string? ImagenNombre { get; set; }

    public int CategoriaId { get; set; }

    public virtual Categoria Categoria { get; set; } = null!;

    public virtual ICollection<CompraDetail> CompraDetails { get; set; } = new List<CompraDetail>();

    public virtual ICollection<OrdenDetail> OrdenDetails { get; set; } = new List<OrdenDetail>();
}
