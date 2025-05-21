namespace ECommerceAPI.Models.DTO.Response
{
    public class UsuarioResponse
    {
        public int UsuarioId { get; set; }
        public string Nombre { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Estado { get; set; } = null!;
        public string Rol { get; set; } = null!;
        public int? ClienteId { get; set; }
    }
}