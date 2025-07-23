import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { useAuctionNotifications } from '../hooks/useAuctionNotifications';

/**
 * Component to initialize and manage auction notifications globally
 * This component should be mounted at the app level to ensure
 * notification system is properly initialized
 */
const NotificationInitializer = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const vehicles = useSelector(state => state.vehicles.allVehicles);
  
  const { initializeNotifications } = useAuctionNotifications();

  useEffect(() => {
    if (isAuthenticated && vehicles.length > 0) {
      // Initialize notifications when user is authenticated and vehicles are loaded
      initializeNotifications();
    }
  }, [isAuthenticated, vehicles.length, initializeNotifications]);

  return children;
};

export default NotificationInitializer;
