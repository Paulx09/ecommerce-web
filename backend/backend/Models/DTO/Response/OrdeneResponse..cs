namespace backend.Models.DTO.Response
{
    public class OrdeneResponse
    {
        public int OrdenId { get; set; }
        public DateTime FechaOrden { get; set; }
        public string Estado { get; set; } = null!;
        public string EstadoEmail { get; set; } = null!;
        public string Cliente { get; set; } = null!;
        public string MetodoPago { get; set; } = null!;
        public int ClienteId { get; set; }
        public int MetodoPagoId { get; set; }
    }
}
