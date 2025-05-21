namespace backend.Models.DTO.Response
{
    public class ClienteRequest
    {
        public int ClienteId { get; set; }
        public int UsuarioId { get; set; }
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
    }
}