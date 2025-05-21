export interface Usuario {
  usuarioId: number;
  nombre: string;
  email: string;
  estado: string;
  rol: string;
  clienteId?: number;
}