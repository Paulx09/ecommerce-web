namespace ECommerceAPI.Models.DTO.Response
{
    public class ProveedorResponse
    {
        public int ProveedorId { get; set; }
        public string Nombre { get; set; } = null!;
        public int? Telefono { get; set; }
        public string Email { get; set; } = null!;
        public string? Direccion { get; set; }
        public string TipoProveedor { get; set; } = null!;
    }
}