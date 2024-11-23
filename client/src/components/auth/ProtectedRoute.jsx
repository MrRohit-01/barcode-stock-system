import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute; 