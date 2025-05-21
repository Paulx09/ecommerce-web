namespace backend.Models.DTO.Request
{
    public class TipoProveedorRequest
    {
        public int TipoProveedorId { get; set; }
        public string Nombre { get; set; } = null!;
    }
}