import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';

export default function PrivateRoute({
  children,
  allowedRoles
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.rol)) return <Navigate to="/" />;
  return children;
}