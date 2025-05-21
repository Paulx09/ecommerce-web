namespace ECommerceAPI.Models.DTO.Response
{
    public class CompraResponse
    {
        public int CompraId { get; set; }
        public DateTime FechaCompra { get; set; }
        public string Estado { get; set; } = null!;
        public string MetodoPago { get; set; } = null!;
        public string Proveedor { get; set; } = null!;
    }
}
