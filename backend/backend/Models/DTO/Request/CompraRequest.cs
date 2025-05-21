namespace backend.Models.DTO.Request
{
    public class CompraRequest
    {
        public int CompraId { get; set; }
        public DateTime FechaCompra { get; set; }
        public string Estado { get; set; } = null!;
        public int MetodoPagoId { get; set; }
        public int ProveedorId { get; set; }
    }
}