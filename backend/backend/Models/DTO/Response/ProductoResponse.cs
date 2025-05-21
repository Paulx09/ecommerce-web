namespace backend.Models.DTO.Response
{
    public class ProductoResponse
    {
        public int ProductoId { get; set; }
        public string Nombre { get; set; } = null!;
        public string? Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public string Disponibilidad { get; set; } = null!;
        public string? ImagenNombre { get; set; }
        public string Categoria { get; set; } = null!;
    }
}
