using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Ordene
{
    public int OrdenId { get; set; }

    public DateTime FechaOrden { get; set; }

    public string Estado { get; set; } = null!;

    public string EstadoEmail { get; set; } = null!;

    public int ClienteId { get; set; }

    public int MetodoPagoId { get; set; }

    public virtual MetodoPago MetodoPago { get; set; } = null!;

    public virtual ICollection<OrdenDetail> OrdenDetails { get; set; } = new List<OrdenDetail>();

    public virtual Cliente Cliente { get; set; } = null!;
}
