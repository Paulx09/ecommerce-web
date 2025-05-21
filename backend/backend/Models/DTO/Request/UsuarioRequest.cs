namespace backend.Models.DTO.Request
{
    public class UsuarioRequest
    {
        public int UsuarioId { get; set; }
        public string Nombre { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Estado { get; set; } = null!;
        public int RolId { get; set; }
    }
}
