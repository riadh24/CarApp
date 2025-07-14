import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useVehicles, useVehicleSearch } from '../hooks/useApiHooks';
import useTheme from '../hooks/UseThemeHooks';
import { checkAPIHealth } from '../services/ApiService';

import {
    Button,
    CarsCard,
    EmptyState,
    FilterChip,
    FilterModal,
    Header,
    SearchBar
} from '../components';
import { setFilters as setReduxFilters } from '../Store';

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { theme } = useTheme();
    
    // Local state
    const [showFilters, setShowFilters] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [apiMode, setApiMode] = useState(false); // Toggle between API and Redux
    
    // API hooks
    const [filters, setFilters] = useState({
        make: '',
        model: '',
        minBid: 0,
        maxBid: 100000,
        showFavoritesOnly: false,
    });
    
    // Use API hooks
    const {
        vehicles: apiVehicles,
        loading: apiLoading,
        pagination,
    } = useVehicles(currentPage, 20, filters);
    
    const { search, results: searchResults, loading: searchLoading } = useVehicleSearch();
    
    // Redux fallback (existing data)
    const { filteredVehicles: reduxVehicles, filters: reduxFilters } = useSelector(state => state.vehicles);
    const allVehicles = useSelector(state => state.vehicles.allVehicles);
    
    // Check API health on component mount
    useEffect(() => {
        const checkAPI = async () => {
            const isHealthy = await checkAPIHealth();
            if (isHealthy) {
                setApiMode(true);
            } else {
                Alert.alert(
                    'API Server Not Running',
                    'The app is running in offline mode with local data.\n\nTo enable API features:\n1. Open a new terminal\n2. Run: npm run api\n3. Restart the app',
                    [
                        { text: 'Continue Offline', style: 'cancel' },
                        { text: 'View Setup Guide', onPress: () => {} }
                    ]
                );
            }
        };
        checkAPI();
    }, []);
    
    // Determine which data source to use
    const vehicles = apiMode ? (searchText ? searchResults : apiVehicles) : reduxVehicles;
    const loading = apiMode ? (searchText ? searchLoading : apiLoading) : false;
    const currentFilters = apiMode ? filters : reduxFilters;

    // Get unique makes for filter dropdown - memoized to prevent unnecessary rerenders
    const uniqueMakes = useMemo(() => {
        const vehicleList = apiMode ? apiVehicles : allVehicles;
        return [...new Set(vehicleList.map(v => v.make))];
    }, [apiMode, apiVehicles, allVehicles]);

    // Pagination logic for API mode
    const ITEMS_PER_PAGE = 20;
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    
    // Paginated vehicles for Redux mode
    const paginatedVehicles = useMemo(() => {
        if (apiMode) return vehicles; // API handles pagination
        return vehicles.slice(0, currentPage * ITEMS_PER_PAGE);
    }, [apiMode, vehicles, currentPage, ITEMS_PER_PAGE]);

    // Check if there are more items to load (Redux mode)
    const hasMoreItems = useMemo(() => {
        if (apiMode) return pagination?.hasNextPage || false;
        return vehicles.length > currentPage * ITEMS_PER_PAGE;
    }, [apiMode, pagination?.hasNextPage, vehicles.length, currentPage, ITEMS_PER_PAGE]);

    // Reset pagination when filters change
    const resetPagination = useCallback(() => {
        setCurrentPage(1);
    }, []);

    // Load more items when reaching end of list
    const loadMoreItems = useCallback(() => {
        if (apiMode) {
            // API mode: load next page
            if (pagination?.hasNextPage && !loading) {
                setCurrentPage(prev => prev + 1);
            }
        } else {
            // Redux mode: simulate loading with delay
            if (hasMoreItems && !isLoadingMore) {
                setIsLoadingMore(true);
                setTimeout(() => {
                    setCurrentPage(prev => prev + 1);
                    setIsLoadingMore(false);
                }, 300);
            }
        }
    }, [apiMode, pagination?.hasNextPage, loading, hasMoreItems, isLoadingMore]);

    // Filter count for badge
    const filterCount = useMemo(() => {
        let count = 0;
        if (currentFilters.make) count++;
        if (currentFilters.model) count++;
        if (currentFilters.showFavoritesOnly) count++;
        if (currentFilters.minBid > 0) count++;
        if (currentFilters.maxBid < 100000) count++;
        return count;
    }, [currentFilters]);

    const handleSearch = (text) => {
        setSearchText(text);
        resetPagination();
        
        if (apiMode) {
            // Use API search
            if (text.trim()) {
                search(text, filters);
            }
        } else {
            // Redux search logic (existing)
            dispatch(setReduxFilters({ 
                make: text.toLowerCase().includes('tesla') ? 'Tesla' : 
                      text.toLowerCase().includes('bmw') ? 'BMW' :
                      text.toLowerCase().includes('audi') ? 'Audi' : ''
            }));
        }
    };

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        resetPagination();
        if (apiMode) {
            setFilters(newFilters);
        } else {
            dispatch(setReduxFilters(newFilters));
        }
    };

    const renderVehicleItem = useCallback(({ item }) => (
        <CarsCard
            key={item.id}
            vehicle={item}
            onPress={() => {
                navigation.navigate('CarDetail', { vehicle: item });
            }}
        />
    ), [navigation]);

    // Key extractor for FlatList optimization
    const getItemKey = useCallback((item) => item.id.toString(), []);

    // Footer component for loading indicator
    const renderFooter = useCallback(() => {
        const showLoading = apiMode ? loading : isLoadingMore;
        if (!showLoading) return null;
        
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                    Loading more vehicles...
                </Text>
            </View>
        );
    }, [apiMode, loading, isLoadingMore, theme.colors.textSecondary]);

    const renderQuickFilters = () => {
        return (
            <View style={styles.quickFiltersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <FilterChip
                        label="Favorites"
                        icon="heart"
                        active={currentFilters.showFavoritesOnly}
                        onPress={() => {
                            resetPagination();
                            const newFilters = { ...currentFilters, showFavoritesOnly: !currentFilters.showFavoritesOnly };
                            handleFilterChange(newFilters);
                        }}
                    />
                    
                    {uniqueMakes.slice(0, 5).map(make => (
                        <FilterChip
                            key={make}
                            label={make}
                            active={currentFilters.make === make}
                            onPress={() => {
                                resetPagination();
                                const newFilters = { ...currentFilters, make: currentFilters.make === make ? '' : make };
                                handleFilterChange(newFilters);
                            }}
                        />
                    ))}
                </ScrollView>
            </View>
        );
    };

    const renderVehicleGrid = () => {
        if (vehicles.length === 0) {
            return (
                <EmptyState
                    icon={<Ionicons name="car-outline" size={64} color="#ccc" />}
                    title="No vehicles found"
                    description="Try adjusting your filters to see more results"
                >
                    <Button
                        title="Reset Filters"
                        onPress={() => {
                            resetPagination();
                            const resetFilters = {
                                make: '',
                                model: '',
                                minBid: 0,
                                maxBid: 100000,
                                showFavoritesOnly: false,
                            };
                            handleFilterChange(resetFilters);
                        }}
                        variant="primary"
                        size="small"
                    />
                </EmptyState>
            );
        }

        return (
            <View style={styles.vehicleGridContainer}>
                <Text style={[styles.resultsText, { color: theme.colors.textSecondary }]}>
                    {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} found
                    {paginatedVehicles.length !== vehicles.length && 
                        ` (showing ${paginatedVehicles.length})`
                    }
                </Text>
                <FlatList
                    data={paginatedVehicles}
                    renderItem={renderVehicleItem}
                    keyExtractor={getItemKey}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.vehicleGrid}
                    onEndReached={loadMoreItems}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={50}
                    initialNumToRender={10}
                    windowSize={10}
                    getItemLayout={(data, index) => ({
                        length: 280, // Approximate item height
                        offset: 280 * index,
                        index,
                    })}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header
                title="Vehicle Auction"
                leftIcon="menu"
                rightIcon="filter"
                onLeftPress={() => navigation.openDrawer()}
                onRightPress={() => setShowFilters(true)}
                showBadge={filterCount > 0}
                badgeCount={filterCount}
            />
            
            <SearchBar
                placeholder="Search by make or model..."
                value={searchText}
                onChangeText={handleSearch}
            />
            
            {renderQuickFilters()}
            {renderVehicleGrid()}
            
            <FilterModal
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                filters={currentFilters}
                onApplyFilters={(newFilters) => {
                    resetPagination();
                    handleFilterChange(newFilters);
                }}
                onResetFilters={() => {
                    resetPagination();
                    const resetFilters = {
                        make: '',
                        model: '',
                        minBid: 0,
                        maxBid: 100000,
                        showFavoritesOnly: false,
                    };
                    handleFilterChange(resetFilters);
                }}
                uniqueMakes={uniqueMakes}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    quickFiltersContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    vehicleGridContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    resultsText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    vehicleGrid: {
        paddingBottom: 20,
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default HomeScreen;
