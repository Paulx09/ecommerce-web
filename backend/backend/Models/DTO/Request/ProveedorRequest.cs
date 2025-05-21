namespace backend.Models.DTO.Request
{
    public class ProveedorRequest
    {
        public int ProveedorId { get; set; }
        public string Nombre { get; set; } = null!;
        public int? Telefono { get; set; }
        public string Email { get; set; } = null!;
        public string? Direccion { get; set; }
        public int TipoProveedorId { get; set; }
    }
}
