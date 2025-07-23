import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch } from 'react-redux';
import useTheme from '../hooks/UseThemeHooks';
import { toggleFavorite } from '../Store';
import { parseVehicleDate } from '../utils';

const { height } = Dimensions.get('window');

const CarDetail = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState('');

    React.useEffect(() => {
        const { vehicle } = route.params;
        setSelectedVehicle(vehicle);
    }, [route.params]);

    // Calculate time remaining until auction
    useEffect(() => {
        if (!selectedVehicle) return;

        const updateTimeRemaining = () => {
            const now = new Date();
            const auctionDate = parseVehicleDate(selectedVehicle.auctionDateTime);
            
            if (!auctionDate) {
                setTimeRemaining('Invalid date');
                return;
            }
            
            const diff = auctionDate - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                
                if (days > 0) {
                    setTimeRemaining(`${days} days, ${hours} hours`);
                } else if (hours > 0) {
                    setTimeRemaining(`${hours} hours, ${minutes} minutes`);
                } else {
                    setTimeRemaining(`${minutes} minutes`);
                }
            } else {
                setTimeRemaining('Auction has ended');
            }
        };

        updateTimeRemaining();
        const interval = setInterval(updateTimeRemaining, 60000);

        return () => clearInterval(interval);
    }, [selectedVehicle]);

    const getCarImage = () => {
        if (!selectedVehicle) return require('../assets/images/cars/suv_1.jpeg');
        
        const make = selectedVehicle.make.toLowerCase();
        if (make.includes('tesla')) return require('../assets/images/cars/tesla_1.jpeg');
        if (make.includes('bmw')) return require('../assets/images/cars/bmw_1.jpeg');
        if (make.includes('audi')) return require('../assets/images/cars/audi_1.jpeg');
        return require('../assets/images/cars/suv_1.jpeg');
    };

    const handleFavoritePress = () => {
        if (selectedVehicle) {
            dispatch(toggleFavorite(selectedVehicle.id));
            setSelectedVehicle({
                ...selectedVehicle,
                favourite: !selectedVehicle.favourite
            });
        }
    };

    if (!selectedVehicle) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.text }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={[styles.backButton, { backgroundColor: theme.colors.overlay }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.favoriteButton, { backgroundColor: theme.colors.overlay }]}
                        onPress={handleFavoritePress}
                    >
                        <Ionicons 
                            name={selectedVehicle.favourite ? "heart" : "heart-outline"} 
                            size={24} 
                            color={selectedVehicle.favourite ? "#ff4444" : "#fff"} 
                        />
                    </TouchableOpacity>
                </View>

                {/* Car Image */}
                <View style={styles.imageContainer}>
                    <Image 
                        source={getCarImage()}
                        style={styles.carImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={[styles.infoContainer, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.titleSection}>
                        <Text style={[styles.carTitle, { color: theme.colors.text }]}>
                            {selectedVehicle.make} {selectedVehicle.model}
                        </Text>
                        <Text style={[styles.carYear, { color: theme.colors.textSecondary }]}>{selectedVehicle.year}</Text>
                    </View>

                    <View style={styles.auctionSection}>
                        <View style={styles.timerContainer}>
                            <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
                            <Text style={[styles.timerText, { color: theme.colors.primary }]}>Auction ends in: {timeRemaining}</Text>
                        </View>
                        <Text style={[styles.auctionDate, { color: theme.colors.textSecondary }]}>
                            {parseVehicleDate(selectedVehicle.auctionDateTime)?.toLocaleDateString('en-GB', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </View>

                    <View style={styles.bidSection}>
                        <Text style={styles.bidLabel}>Starting Bid</Text>
                        <Text style={styles.bidAmount}>£{selectedVehicle.startingBid.toLocaleString()}</Text>
                    </View>

                    <View style={styles.specsSection}>
                        <Text style={styles.sectionTitle}>Vehicle Specifications</Text>
                        
                        <View style={styles.specRow}>
                            <View style={styles.specItem}>
                                <Text style={styles.specLabel}>Engine Size</Text>
                                <Text style={styles.specValue}>{selectedVehicle.engineSize}</Text>
                            </View>
                            <View style={styles.specItem}>
                                <Text style={styles.specLabel}>Fuel Type</Text>
                                <Text style={styles.specValue}>{selectedVehicle.fuel}</Text>
                            </View>
                        </View>

                        <View style={styles.specRow}>
                            <View style={styles.specItem}>
                                <Text style={styles.specLabel}>Mileage</Text>
                                <Text style={styles.specValue}>{selectedVehicle.mileage.toLocaleString()} miles</Text>
                            </View>
                            <View style={styles.specItem}>
                                <Text style={styles.specLabel}>Year</Text>
                                <Text style={styles.specValue}>{selectedVehicle.year}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>
                            This {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} features a {selectedVehicle.engineSize} {selectedVehicle.fuel} engine. 
                            With {selectedVehicle.mileage.toLocaleString()} miles on the clock, this vehicle represents excellent value for money.
                            
                            {'\n\n'}This vehicle has been thoroughly inspected and comes with a comprehensive service history. 
                            All major components are in excellent working condition, making it an ideal choice for your next purchase.
                            
                            {'\n\n'}Don&apos;t miss this opportunity to own a quality vehicle at an exceptional price. 
                            Place your bid before the auction ends to secure this fantastic deal.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.bidButton}>
                    <Text style={styles.bidButtonText}>Place Bid</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: height * 0.4,
        width: '100%',
    },
    carImage: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        padding: 20,
        marginTop: -20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    titleSection: {
        marginBottom: 20,
    },
    carTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    carYear: {
        fontSize: 18,
        color: '#666',
    },
    auctionSection: {
        backgroundColor: '#f0f7ff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    timerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2563eb',
        marginLeft: 8,
    },
    auctionDate: {
        fontSize: 14,
        color: '#666',
    },
    bidSection: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    bidLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    bidAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2563eb',
    },
    specsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    specRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    specItem: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    specLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    specValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    descriptionSection: {
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
    },
    bottomActions: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    bidButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    bidButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CarDetail;
