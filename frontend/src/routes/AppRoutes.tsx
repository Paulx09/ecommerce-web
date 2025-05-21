import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';


export default function AppRoutes() {
  return (
    <AuthProvider>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<h1>Home</h1>} />
        </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}
