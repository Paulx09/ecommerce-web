namespace backend.Models.DTO.Request
{
    public class CompraDetailRequest
    {
        public int CompraDetailsId { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public int ProductoId { get; set; }
        public int CompraId { get; set; }
    }
}
