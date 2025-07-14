import axios from 'axios';

const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'http://localhost:3001';
  }
  return 'https://your-production-api.com';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    if (!config || config.__retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }
    
    config.__retryCount = config.__retryCount || 0;
    config.__retryCount += 1;
    
    await delay(RETRY_DELAY);
    return apiClient(config);
  }
);

export const vehicleAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/vehicles', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch vehicles: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch vehicle ${id}: ${error.message}`);
    }
  },

  getPaginated: async (page = 1, limit = 20, filters = {}) => {
    try {
      const params = { _page: page, _limit: limit, ...filters };
      const response = await apiClient.get('/vehicles', { params });
      const totalCount = response.headers['x-total-count'];
      
      return {
        data: response.data,
        totalCount: parseInt(totalCount || '0'),
        currentPage: page,
        totalPages: Math.ceil(parseInt(totalCount || '0') / limit),
        hasNextPage: page * limit < parseInt(totalCount || '0'),
      };
    } catch (error) {
      throw new Error(`Failed to fetch paginated vehicles: ${error.message}`);
    }
  },

  search: async (query, filters = {}) => {
    try {
      const params = { q: query, ...filters };
      const response = await apiClient.get('/vehicles', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search vehicles: ${error.message}`);
    }
  },

  filter: async (filters) => {
    try {
      const params = {};
      
      if (filters.make) params.make = filters.make;
      if (filters.model) params.model = filters.model;
      if (filters.fuel) params.fuel = filters.fuel;
      if (filters.category) params.category = filters.category;
      if (filters.favourite !== undefined) params.favourite = filters.favourite;
      
      if (filters.minBid) params.startingBid_gte = filters.minBid;
      if (filters.maxBid) params.startingBid_lte = filters.maxBid;
      if (filters.minYear) params.year_gte = filters.minYear;
      if (filters.maxYear) params.year_lte = filters.maxYear;
      
      const response = await apiClient.get('/vehicles', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to filter vehicles: ${error.message}`);
    }
  },

  update: async (id, updates) => {
    try {
      const response = await apiClient.patch(`/vehicles/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update vehicle ${id}: ${error.message}`);
    }
  },

  toggleFavorite: async (id) => {
    try {
      const vehicle = await vehicleAPI.getById(id);
      const response = await apiClient.patch(`/vehicles/${id}`, {
        favourite: !vehicle.favourite
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to toggle favorite for vehicle ${id}: ${error.message}`);
    }
  },
};

export const auctionAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/auctions');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch auctions: ${error.message}`);
    }
  },

  getByVehicleId: async (vehicleId) => {
    try {
      const response = await apiClient.get('/auctions', {
        params: { vehicleId }
      });
      return response.data[0];
    } catch (error) {
      throw new Error(`Failed to fetch auction for vehicle ${vehicleId}: ${error.message}`);
    }
  },

  getActive: async () => {
    try {
      const response = await apiClient.get('/auctions', {
        params: { status: 'active' }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch active auctions: ${error.message}`);
    }
  },
};

export const userAPI = {
  getProfile: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  },

  updateFavorites: async (userId, favorites) => {
    try {
      const response = await apiClient.patch(`/users/${userId}`, {
        favorites
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update user favorites: ${error.message}`);
    }
  },
};

export const categoryAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  },
};

export const checkAPIHealth = async () => {
  const testUrls = [
    `${API_BASE_URL}/vehicles?_limit=1`,
    `${API_BASE_URL}/vehicles`,
    `${API_BASE_URL}`,
  ];
  
  for (const url of testUrls) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        return true;
      }
    } catch (_error) {
      continue;
    }
  }
  
  return false;
};

export default {
  vehicleAPI,
  auctionAPI,
  userAPI,
  categoryAPI,
  checkAPIHealth,
};
