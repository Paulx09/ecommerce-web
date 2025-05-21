namespace backend.Models.DTO.Response
{
    public class CategoriaRequest
    {
        public int? CategoriaId { get; set; }
        public string Nombre { get; set; } = null!;
    }
}