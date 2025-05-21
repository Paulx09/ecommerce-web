namespace backend.Models.DTO.Request
{
    public class OrdeneRequest
    {
        public int OrdenId { get; set; }
        public DateTime FechaOrden { get; set; }
        public string Estado { get; set; } = null!;
        public string EstadoEmail { get; set; } = null!;
        public int ClienteId { get; set; }
        public int MetodoPagoId { get; set; }
    }
}
