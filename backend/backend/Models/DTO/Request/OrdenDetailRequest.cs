namespace backend.Models.DTO.Request
{
    public class OrdenDetailRequest
    {
        public int OrdenDetailsId { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnit { get; set; }
        public int OrdenId { get; set; }
        public int ProductoId { get; set; }
    }
}