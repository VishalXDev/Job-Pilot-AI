import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  const handleLogout = () => {
    setToken(null); // Updates context
    localStorage.removeItem('token'); // Clear from storage
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="text-xl font-semibold">
        <Link to={token ? "/dashboard" : "/"} className="hover:text-blue-300 transition">
          JobPilot AI
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-sm">
        {token && (
          <>
            <Link to="/dashboard" className="hover:text-blue-300 transition">Dashboard</Link>
            <Link to="/ai" className="hover:text-blue-300 transition">AI Assistant</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}
        {!token && (
          <>
            <Link to="/login" className="hover:text-blue-300 transition">Login</Link>
            <Link to="/register" className="hover:text-blue-300 transition">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
