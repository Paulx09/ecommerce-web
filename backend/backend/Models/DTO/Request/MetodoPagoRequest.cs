namespace backend.Models.DTO.Request
{
    public class MetodoPagoRequest
    {
        public int MetodoPagoId { get; set; }
        public string Nombre { get; set; } = null!;
    }
}