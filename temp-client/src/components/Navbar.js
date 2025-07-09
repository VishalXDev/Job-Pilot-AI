import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
      {/* Left - Logo/Brand */}
      <div className="text-xl font-semibold">
        <Link to="/dashboard" className="hover:text-blue-300 transition">
          JobPilot AI
        </Link>
      </div>

      {/* Center - Navigation Links */}
      <div className="flex gap-6 text-sm">
        <Link to="/dashboard" className="hover:text-blue-300 transition">Dashboard</Link>
        <Link to="/ai" className="hover:text-blue-300 transition">AI Assistant</Link>
      </div>

      {/* Right - Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm transition"
      >
        Logout
      </button>
    </nav>
  );
}
