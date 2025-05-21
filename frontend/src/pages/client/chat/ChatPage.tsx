import { useState } from 'react';
import { obtenerRespuestaGemini } from '../../../services/chatService';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    const res = await obtenerRespuestaGemini(input);
    setRespuesta(res);
    setCargando(false);
    setInput(''); // Limpiar el input después de enviar
  };

  return (
    <div className="container mt-4">
      <h3>Asistente de Compras</h3>
      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="¿Qué estás buscando?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={cargando}>
          {cargando ? 'Cargando...' : 'Preguntar'}
        </button>
      </form>

      {cargando ? (
        <div className="alert alert-warning">Consultando al asistente...</div>
      ) : (
        respuesta && <div className="alert alert-info">{respuesta}</div>
      )}
    </div>
  );
}
