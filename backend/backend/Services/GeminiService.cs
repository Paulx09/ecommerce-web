using System.Net.Http;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace ECommerceAPI.Services
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public GeminiService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            _config = config;
        }

        public async Task<string> ObtenerRespuestaAsync(string prompt)
        {
            string apiKey = _config["Gemini:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return "API Key no configurada.";

            string endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}";

            var payload = new
            {
                contents = new[]
                {
                    new {
                        parts = new[] { new { text = $"Asiste al cliente. {prompt}" } }
                    }
                }
            };

            var response = await _httpClient.PostAsJsonAsync(endpoint, payload);

            if (!response.IsSuccessStatusCode)
                return $"Error API Gemini: {response.StatusCode}";

            var json = await response.Content.ReadFromJsonAsync<JsonElement>();

            try
            {
                return json.GetProperty("candidates")[0]
                           .GetProperty("content")
                           .GetProperty("parts")[0]
                           .GetProperty("text")
                           .GetString() ?? "Sin respuesta.";
            }
            catch
            {
                return "Formato inesperado en la respuesta de Gemini.";
            }
        }
    }
}
