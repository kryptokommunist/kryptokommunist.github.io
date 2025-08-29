(function() {
  'use strict';

  // Search configuration
  const SEARCH_CONFIG = {
    minQueryLength: 2,
    debounceDelay: 300,
    maxResults: 20,
    contentPreviewLength: 150
  };

  // DOM elements
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchLoading = document.getElementById('search-loading');
  const noResults = document.getElementById('no-results');

  // Search index and store
  let searchIndex = null;
  let searchStore = null;
  let debounceTimer = null;

  // Initialize search functionality
  function initSearch() {
    if (!searchInput) return;
    
    // Load search data
    loadSearchData();
    
    // Add event listeners
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', handleSearchFocus);
    searchInput.addEventListener('blur', handleSearchBlur);
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', handleKeydown);
    
    // Focus search input on page load
    searchInput.focus();
  }

  // Load search data from Jekyll-generated JSON
  function loadSearchData() {
    console.log('🔍 Loading search data...');
    // Try to load from Jekyll-generated search index
    fetch('/search.json')
      .then(response => {
        console.log('📡 Search.json response:', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('✅ Search data loaded:', data);
        searchStore = data;
        buildSearchIndex();
      })
      .catch(error => {
        console.warn('⚠️ Search index not found, using fallback data:', error);
        // Fallback: create some sample data for testing
        searchStore = createFallbackData();
        buildSearchIndex();
      });
  }

  // Create fallback search data for testing
  function createFallbackData() {
    return {
      'fallback-1': {
        id: 'fallback-1',
        title: 'Welcome to the Search Demo',
        author: 'Marcus Ding',
        category: 'demo',
        tags: ['demo', 'search'],
        content: 'This is a demonstration of the search functionality. You can type in the search box above to see how it works.',
        url: '/',
        date: new Date().toISOString()
      },
      'fallback-2': {
        id: 'fallback-2',
        title: 'Search Features',
        author: 'Marcus Ding',
        category: 'features',
        tags: ['search', 'features'],
        content: 'The search includes real-time results, highlighting, and smart content matching. Try searching for different terms!',
        url: '/search/',
        date: new Date().toISOString()
      }
    };
  }

  // Build Lunr search index
  function buildSearchIndex() {
    if (!searchStore) return;

    searchIndex = lunr(function() {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author', { boost: 5 });
      this.field('category', { boost: 3 });
      this.field('tags', { boost: 3 });
      this.field('content', { boost: 1 });
      
      // Enable partial word matching and fuzzy search
      this.pipeline.remove(lunr.stemmer);
      this.pipeline.remove(lunr.stopWordFilter);
      
      // Add documents to index
      Object.keys(searchStore).forEach(key => {
        const item = searchStore[key];
        this.add({
          id: key,
          title: item.title || '',
          author: item.author || '',
          category: item.category || '',
          tags: Array.isArray(item.tags) ? item.tags.join(' ') : (item.tags || ''),
          content: item.content || ''
        });
      });
    });
  }

  // Handle search input with debouncing
  function handleSearchInput(event) {
    const query = event.target.value.trim();
    
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Show loading state for longer queries
    if (query.length >= SEARCH_CONFIG.minQueryLength) {
      showLoading();
    }
    
    // Debounce search
    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, SEARCH_CONFIG.debounceDelay);
    
    // Handle empty query
    if (query.length === 0) {
      showPlaceholder();
    }
  }

  // Perform the actual search
  function performSearch(query) {
    console.log('🔍 Performing search for:', query);
    console.log('🔍 Search index exists:', !!searchIndex);
    console.log('🔍 Search store exists:', !!searchStore);
    console.log('🔍 Query length:', query.length, 'Min required:', SEARCH_CONFIG.minQueryLength);
    
    if (!searchIndex || !searchStore || query.length < SEARCH_CONFIG.minQueryLength) {
      console.log('⚠️ Search conditions not met, showing placeholder');
      showPlaceholder();
      return;
    }

    try {
      // Try exact search first
      let results = searchIndex.search(query);
      
      // If no results, try fuzzy search with wildcards
      if (results.length === 0) {
        const wildcardQuery = query.split(' ').map(term => `*${term}*`).join(' ');
        results = searchIndex.search(wildcardQuery);
      }
      
      // If still no results, try fuzzy search with edit distance
      if (results.length === 0) {
        results = searchIndex.search(query + '~2');
      }
      
      console.log('✅ Search results:', results);
      displaySearchResults(results.slice(0, SEARCH_CONFIG.maxResults), query);
    } catch (error) {
      console.error('❌ Search error:', error);
      showNoResults();
    }
  }

  // Display search results
  function displaySearchResults(results, query) {
    if (!results || results.length === 0) {
      showNoResults();
      return;
    }

    hideLoading();
    
    const resultsHTML = results.map(result => {
      const item = searchStore[result.ref];
      const relevance = Math.round(result.score * 100);
      
              const isPortfolio = item.type === 'portfolio';
        const portfolioBadge = isPortfolio ? '<span class="portfolio-badge"><i class="fas fa-briefcase"></i> Portfolio</span>' : '';
        
        return `
        <article class="search-result ${isPortfolio ? 'portfolio-result' : ''}" data-relevance="${relevance}">
          <div class="result-meta">
            ${portfolioBadge}
            <span class="result-date"><i class="fas fa-calendar"></i> ${formatDate(item.date)}</span>
            ${item.author ? `<span class="result-author"><i class="fas fa-user"></i> ${item.author}</span>` : ''}
            ${item.category ? `<span class="result-category"><i class="fas fa-folder"></i> ${item.category}</span>` : ''}
            ${item.tags && item.tags.length ? `<span class="result-tags"><i class="fas fa-tags"></i> ${item.tags.join(', ')}</span>` : ''}
          </div>
          <h3 class="result-title">
            <a href="${item.url}">${highlightText(item.title, query)}</a>
          </h3>
          <p class="result-excerpt">${highlightText(getExcerpt(item.content, query), query)}</p>
          <div class="result-footer">
            <span class="result-relevance"><i class="fas fa-star"></i> Relevance: ${relevance}%</span>
            <a href="${item.url}" class="result-link"><i class="fas fa-external-link"></i> Read more</a>
          </div>
        </article>
      `;
    }).join('');

    searchResults.innerHTML = resultsHTML;
    searchResults.style.display = 'block';
  }

  // Highlight search terms in text
  function highlightText(text, query) {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Get excerpt from content
  function getExcerpt(content, query) {
    if (!content) return '';
    
    // Find the first occurrence of the query
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    const queryIndex = contentLower.indexOf(queryLower);
    
    if (queryIndex === -1) {
      // Query not found, return beginning of content
      return content.substring(0, SEARCH_CONFIG.contentPreviewLength) + '...';
    }
    
    // Start from query position and get surrounding context
    const start = Math.max(0, queryIndex - 50);
    const end = Math.min(content.length, queryIndex + SEARCH_CONFIG.contentPreviewLength);
    
    let excerpt = content.substring(start, end);
    
    // Add ellipsis if we're not at the beginning/end
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';
    
    return excerpt;
  }

  // Format date
  function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  // Show loading state
  function showLoading() {
    hideAllStates();
    searchLoading.innerHTML = `
      <div class="spinner"></div>
      <p><i class="fas fa-spinner fa-spin"></i> Searching...</p>
    `;
    searchLoading.style.display = 'block';
  }

  // Show placeholder state
  function showPlaceholder() {
    hideAllStates();
    searchResults.innerHTML = `
      <div class="search-placeholder">
        <i class="fas fa-search"></i>
        <p>Start typing to search...</p>
        <p class="search-tip"><i class="fas fa-lightbulb"></i> Try searching for topics, authors, or keywords</p>
      </div>
    `;
    searchResults.style.display = 'block';
  }

  // Show no results state
  function showNoResults() {
    hideAllStates();
    noResults.innerHTML = `
      <i class="far fa-frown"></i>
      <p>No results found</p>
      <p class="suggestion"><i class="fas fa-info-circle"></i> Try different keywords or check your spelling</p>
    `;
    noResults.style.display = 'block';
  }

  // Hide loading state
  function hideLoading() {
    searchLoading.style.display = 'none';
  }

  // Hide all UI states
  function hideAllStates() {
    searchLoading.style.display = 'none';
    noResults.style.display = 'none';
  }

  // Handle search input focus
  function handleSearchFocus() {
    searchInput.parentElement.classList.add('focused');
  }

  // Handle search input blur
  function handleSearchBlur() {
    searchInput.parentElement.classList.remove('focused');
  }

  // Handle keyboard navigation
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      searchInput.value = '';
      showPlaceholder();
      searchInput.blur();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
