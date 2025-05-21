namespace backend.Models.DTO.Response
{
    public class OrdenDetailResponse
    {
        public int OrdenDetailsId { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnit { get; set; }
        public int OrdenId { get; set; }
        public int ProductoId { get; set; }
        public string Producto { get; set; } = null!;
    }
}