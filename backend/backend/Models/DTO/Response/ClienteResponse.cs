namespace backend.Models.DTO.Response
{
    public class ClienteResponse
    {
        public int ClienteId { get; set; }
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
        public string NombreUsuario { get; set; } = null!;
        public string EmailUsuario { get; set; } = null!;
    }
}
