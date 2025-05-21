namespace backend.Models.DTO.Request
{
    public class RegistroClienteRequest
    {
        public string Nombre { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
