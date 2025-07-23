import { useCallback, useEffect, useState } from 'react';
import { auctionAPI, categoryAPI, vehicleAPI } from '../services/ApiService';

// Custom hook for fetching vehicles with pagination
export const useVehicles = (page = 1, limit = 20, filters = {}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
  });

  // Stringify filters for dependency comparison
  const filtersString = JSON.stringify(filters);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await vehicleAPI.getPaginated(page, limit, filters);
      
      if (page === 1) {
        setVehicles(result.data);
      } else {
        setVehicles(prev => [...prev, ...result.data]);
      }
      
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        hasNextPage: result.hasNextPage,
      });
    } catch (err) {
      const errorMessage = err.message.includes('Network Error') 
        ? 'API server is not running. Please start the API server with "npm run api"'
        : err.message;
      setError(errorMessage);
      
      setVehicles([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, filtersString]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const refresh = useCallback(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    pagination,
    refresh,
  };
};

// Custom hook for searching vehicles
export const useVehicleSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query, filters = {}) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await vehicleAPI.search(query, filters);
      setResults(data);
    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  };
};

// Custom hook for fetching a single vehicle
export const useVehicle = (vehicleId) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vehicleId) return;

    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await vehicleAPI.getById(vehicleId);
        setVehicle(data);
      } catch (err) {
        setError(err.message);
  
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  return {
    vehicle,
    loading,
    error,
  };
};

// Custom hook for fetching categories
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await categoryAPI.getAll();
        setCategories(data);
      } catch (err) {
        setError(err.message);
  
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
  };
};

// Custom hook for auction data
export const useAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuctions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await auctionAPI.getAll();
      setAuctions(data);
    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  const getActiveAuctions = useCallback(async () => {
    try {
      const data = await auctionAPI.getActive();
      return data;
    } catch (_err) {
      return [];
    }
  }, []);

  return {
    auctions,
    loading,
    error,
    refresh: fetchAuctions,
    getActiveAuctions,
  };
};
