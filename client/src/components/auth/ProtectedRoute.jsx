import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();

  // For development, temporarily bypass authentication
  return children;

  // Uncomment this when authentication is ready
  /*
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
  */
};

export default ProtectedRoute; 