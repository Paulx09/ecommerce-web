namespace backend.Models.DTO.Response
{
    public class CompraDetailResponse
    {
        public int CompraDetailsId { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public string Producto { get; set; } = null!;
        public int ProductoId { get; set; }
        public int CompraId { get; set; }
    }
}