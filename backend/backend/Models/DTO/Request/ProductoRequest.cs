namespace backend.Models.DTO.Request
{
    public class ProductoRequest
    {
        public int ProductoId { get; set; }
        public string Nombre { get; set; } = null!;
        public string? Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public string? ImagenNombre { get; set; }
        public int CategoriaId { get; set; }
    }
}
