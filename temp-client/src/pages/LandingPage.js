// src/pages/LandingPage.js
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-center p-8">
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to SealX Job Tracker 💼</h1>
        <p className="text-gray-600 mb-6">
          Track your job applications, get AI resume tips, and stay organized during your job hunt.
        </p>
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Sign In
          </Link>
          <Link to="/register" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
