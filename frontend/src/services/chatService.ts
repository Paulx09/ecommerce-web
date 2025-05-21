import axios from 'axios';
import { appsettings } from '../settings/appsettings';

export async function obtenerRespuestaGemini(prompt: string): Promise<string> {
  try {
    const { data } = await axios.post<{ respuesta: string }>(
      `${appsettings.apiUrl}Gemini/Responder`,
      { prompt },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return data.respuesta;
  } catch (err) {
    console.error(err);
    return 'Hubo un error al obtener respuesta del asistente.';
  }
}

