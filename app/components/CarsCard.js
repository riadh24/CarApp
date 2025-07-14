import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { toggleFavorite } from '../Store';

const { width } = Dimensions.get('window');

const CarsCard = ({ containerStyle, vehicle, onPress }) => {
  const dispatch = useDispatch();
  const [timeRemaining, setTimeRemaining] = useState('');

  // Calculate time remaining until auction
  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const auctionDate = new Date(vehicle.auctionDateTime);
      const diff = auctionDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else {
          setTimeRemaining(`${minutes}m`);
        }
      } else {
        setTimeRemaining('Auction ended');
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [vehicle.auctionDateTime]);

  const handleFavoritePress = (e) => {
    e.stopPropagation(); // Prevent triggering the main onPress
    dispatch(toggleFavorite(vehicle.id));
  };

  // Placeholder car image based on make
  const getCarImage = () => {
    const make = vehicle.make.toLowerCase();
    if (make.includes('tesla')) return require('../assets/images/cars/tesla_1.jpeg');
    if (make.includes('bmw')) return require('../assets/images/cars/bmw_1.jpeg');
    if (make.includes('audi')) return require('../assets/images/cars/audi_1.jpeg');
    return require('../assets/images/cars/suv_1.jpeg'); // Default
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      {/* Car Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={getCarImage()}
          style={styles.carImage}
          resizeMode="cover"
        />
        
        {/* Favorite Button */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Ionicons 
            name={vehicle.favourite ? "heart" : "heart-outline"} 
            size={24} 
            color={vehicle.favourite ? "#ff4444" : "#fff"} 
          />
        </TouchableOpacity>

        {/* Auction Countdown */}
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{timeRemaining}</Text>
        </View>
      </View>

      {/* Vehicle Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
        <Text style={styles.year}>{vehicle.year} • {vehicle.mileage.toLocaleString()} miles</Text>
        <Text style={styles.specs}>{vehicle.engineSize} {vehicle.fuel}</Text>
        <Text style={styles.startingBid}>Starting Bid: £{vehicle.startingBid.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    marginHorizontal: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  countdownContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countdownText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  specs: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  startingBid: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
});

export default CarsCard;