import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { useVehicles, useVehicleSearch } from '../hooks/useApiHooks';
import { usePagination } from '../hooks/usePagination';
import useTheme from '../hooks/UseThemeHooks';
import { useTranslation } from '../hooks/useTranslation';
import { useVehicleFilters } from '../hooks/useVehicleFilters';
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

const HomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    
    const [showFilters, setShowFilters] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [apiMode, setApiMode] = useState(false);
    
    const {
        filters,
        filterCount,
        updateFilters,
        resetFilters,
        toggleFavorites,
        toggleMake,
        applySearchFilter,
    } = useVehicleFilters(apiMode);

    const {
        currentPage,
        isLoadingMore,
        resetPagination,
        loadMoreItems,
        getPaginatedData,
    } = usePagination(apiMode, 0, 20, pagination); // Will be updated after vehicles is defined
    
    // Use API hooks
    const {
        vehicles: apiVehicles,
        loading: apiLoading,
        pagination,
    } = useVehicles(currentPage, 20, filters);
    
    const { search, results: searchResults, loading: searchLoading } = useVehicleSearch();
    
    const { filteredVehicles: reduxVehicles = [] } = useSelector(state => state.vehicles);
    const allVehicles = useSelector(state => state.vehicles.allVehicles || []);
    
    useEffect(() => {
        const checkAPI = async () => {
            const isHealthy = await checkAPIHealth();
            if (isHealthy) {
                setApiMode(true);
            }
        };
        checkAPI();
    }, [t]);
    
    const vehicles = apiMode ? (searchText ? searchResults : apiVehicles) : reduxVehicles;
    const loading = apiMode ? (searchText ? searchLoading : apiLoading) : false;

    const uniqueMakes = useMemo(() => {
        const vehicleList = apiMode ? apiVehicles : allVehicles;
        if (!vehicleList || !Array.isArray(vehicleList)) return [];
        return [...new Set(vehicleList.map(v => v.make))];
    }, [apiMode, apiVehicles, allVehicles]);

    const paginatedVehicles = getPaginatedData(vehicles || []);

    const handleSearch = (text) => {
        setSearchText(text);
        resetPagination();
        
        if (apiMode) {
            // Use API search
            if (text.trim()) {
                search(text, filters);
            }
        } else {
            // Apply search filter using the hook
            applySearchFilter(text);
        }
    };

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        resetPagination();
        updateFilters(newFilters);
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
                    {t('home.loadMore')}
                </Text>
            </View>
        );
    }, [apiMode, loading, isLoadingMore, theme.colors.textSecondary, t]);

    const renderQuickFilters = () => {
        return (
            <View style={styles.quickFiltersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <FilterChip
                        label="Favorites"
                        icon="heart"
                        active={filters.showFavoritesOnly}
                        onPress={() => {
                            resetPagination();
                            toggleFavorites();
                        }}
                    />
                    
                    {uniqueMakes.slice(0, 5).map(make => (
                        <FilterChip
                            key={make}
                            label={make}
                            active={filters.make === make}
                            onPress={() => {
                                resetPagination();
                                toggleMake(make);
                            }}
                        />
                    ))}
                </ScrollView>
            </View>
        );
    };

    const renderVehicleGrid = () => {
        if (!vehicles || vehicles.length === 0) {
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
                            resetFilters();
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
                    {(vehicles || []).length} vehicle{(vehicles || []).length !== 1 ? 's' : ''} found
                    {(paginatedVehicles || []).length !== (vehicles || []).length && 
                        ` (showing ${(paginatedVehicles || []).length})`
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
                filters={filters}
                onApplyFilters={(newFilters) => {
                    resetPagination();
                    handleFilterChange(newFilters);
                }}
                onResetFilters={() => {
                    resetPagination();
                    resetFilters();
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
