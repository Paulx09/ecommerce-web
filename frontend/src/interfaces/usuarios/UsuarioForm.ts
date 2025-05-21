export interface UsuarioForm {
  usuarioId: number;
  nombre: string;
  email: string;
  estado: string;
  passwordHash: string;
  rolId: number;
}