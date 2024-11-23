import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const { isAuthenticated } = useAuthStore();

  if (token && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default PublicRoute; 