import { useCallback, useMemo, useState } from 'react';

export const usePagination = (apiMode = false, totalItems = 0, itemsPerPage = 20, apiPagination = null) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const getPaginatedData = useCallback((data) => {
    if (apiMode) return data;
    return data.slice(0, currentPage * itemsPerPage);
  }, [apiMode, currentPage, itemsPerPage]);

  const hasMoreItems = useMemo(() => {
    if (apiMode) {
      return apiPagination?.hasNextPage || false;
    }
    return totalItems > currentPage * itemsPerPage;
  }, [apiMode, apiPagination?.hasNextPage, totalItems, currentPage, itemsPerPage]);

  // Load more items
  const loadMoreItems = useCallback(async () => {
    if (apiMode) {
      if (apiPagination?.hasNextPage && !isLoadingMore) {
        setCurrentPage(prev => prev + 1);
      }
    } else {
      if (hasMoreItems && !isLoadingMore) {
        setIsLoadingMore(true);
        // Simulate network delay
        setTimeout(() => {
          setCurrentPage(prev => prev + 1);
          setIsLoadingMore(false);
        }, 300);
      }
    }
  }, [apiMode, apiPagination?.hasNextPage, hasMoreItems, isLoadingMore]);

  // Get pagination info for display
  const paginationInfo = useMemo(() => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return {
      currentPage,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      startItem,
      endItem,
      totalItems,
      itemsPerPage,
      isFirstPage: currentPage === 1,
      isLastPage: !hasMoreItems,
    };
  }, [currentPage, itemsPerPage, totalItems, hasMoreItems]);

  // Go to specific page (mainly for local mode)
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  }, [paginationInfo.totalPages]);

  // Go to next page
  const nextPage = useCallback(() => {
    if (hasMoreItems) {
      loadMoreItems();
    }
  }, [hasMoreItems, loadMoreItems]);

  // Go to previous page
  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  return {
    // Current state
    currentPage,
    isLoadingMore,
    hasMoreItems,
    paginationInfo,
    
    // Actions
    resetPagination,
    loadMoreItems,
    goToPage,
    nextPage,
    previousPage,
    getPaginatedData,
    setIsLoadingMore,
  };
};

export default usePagination;
