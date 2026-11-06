import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import NewListing from './pages/NewListing';
import NgoNearby from './pages/NgoNearby';
import MyClaims from './pages/MyClaims';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role-protected dashboard routes */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute role="donor">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/new"
            element={
              <ProtectedRoute role="donor">
                <NewListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo"
            element={
              <ProtectedRoute role="ngo">
                <NgoNearby />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/claims"
            element={
              <ProtectedRoute role="ngo">
                <MyClaims />
              </ProtectedRoute>
            }
          />

          {/* Wildcard 404 route for unmatched paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <footer className="py-6 border-t border-gray-200 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} AnnaSeva Platform — Surplus Food Redistribution
      </footer>
    </div>
  );
}

