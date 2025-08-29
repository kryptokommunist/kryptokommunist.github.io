(function() {
  'use strict';

  // DOM elements
  const searchLink = document.getElementById('search-link');
  const searchOverlay = document.getElementById('search-overlay');
  const closeSearch = document.getElementById('close-search');
  const overlaySearchInput = document.getElementById('overlay-search-input');
  const overlaySearchResults = document.getElementById('overlay-search-results');

  // Search state
  let isOverlayOpen = false;
  let searchIndex = null;
  let searchStore = null;
  let debounceTimer = null;

  // Initialize search overlay
  function initSearchOverlay() {
    if (!searchLink || !searchOverlay) return;

    // Add event listeners
    searchLink.addEventListener('click', openSearchOverlay);
    closeSearch.addEventListener('click', closeSearchOverlay);
    
    // Close overlay when clicking outside
    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) {
        closeSearchOverlay();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Load search data
    loadSearchData();
  }

  // Open search overlay
  function openSearchOverlay(e) {
    e.preventDefault();
    
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus search input after animation
    setTimeout(() => {
      overlaySearchInput.focus();
    }, 300);
    
    isOverlayOpen = true;
  }

  // Close search overlay
  function closeSearchOverlay() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear search
    overlaySearchInput.value = '';
    showOverlayPlaceholder();
    
    isOverlayOpen = false;
  }

  // Handle keyboard shortcuts
  function handleKeyboardShortcuts(e) {
    // Cmd/Ctrl + K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (!isOverlayOpen) {
        openSearchOverlay(e);
      }
    }
    
    // Escape to close search
    if (e.key === 'Escape' && isOverlayOpen) {
      closeSearchOverlay();
    }
  }

  // Load search data
  function loadSearchData() {
    fetch('/search.json')
      .then(response => response.json())
      .then(data => {
        searchStore = data;
        buildSearchIndex();
      })
      .catch(error => {
        console.warn('Search index not found, using fallback data:', error);
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

  // Build search index
  function buildSearchIndex() {
    if (!searchStore) return;

    searchIndex = lunr(function() {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author', { boost: 5 });
      this.field('category', { boost: 3 });
      this.field('tags', { boost: 3 });
      this.field('content', { boost: 1 });
      
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

    // Add input event listener after index is built
    overlaySearchInput.addEventListener('input', handleOverlaySearchInput);
  }

  // Handle search input in overlay
  function handleOverlaySearchInput(e) {
    const query = e.target.value.trim();
    
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    if (query.length === 0) {
      showOverlayPlaceholder();
      return;
    }
    
    if (query.length >= 2) {
      showOverlayLoading();
    }
    
    debounceTimer = setTimeout(() => {
      performOverlaySearch(query);
    }, 300);
  }

  // Perform search in overlay
  function performOverlaySearch(query) {
    if (!searchIndex || !searchStore || query.length < 2) {
      showOverlayPlaceholder();
      return;
    }

    try {
      const results = searchIndex.search(query);
      displayOverlaySearchResults(results.slice(0, 10), query);
    } catch (error) {
      console.error('Search error:', error);
      showOverlayNoResults();
    }
  }

  // Display search results in overlay
  function displayOverlaySearchResults(results, query) {
    if (!results || results.length === 0) {
      showOverlayNoResults();
      return;
    }

    const resultsHTML = results.map(result => {
      const item = searchStore[result.ref];
      const relevance = Math.round(result.score * 100);
      
      return `
        <article class="overlay-search-result" data-relevance="${relevance}">
          <div class="overlay-result-meta">
            <span class="overlay-result-date"><i class="fas fa-calendar"></i> ${formatDate(item.date)}</span>
            ${item.author ? `<span class="overlay-result-author"><i class="fas fa-user"></i> ${item.author}</span>` : ''}
            ${item.category ? `<span class="overlay-result-category"><i class="fas fa-folder"></i> ${item.category}</span>` : ''}
          </div>
          <h4 class="overlay-result-title">
            <a href="${item.url}" onclick="closeSearchOverlay()">${highlightText(item.title, query)}</a>
          </h4>
          <p class="overlay-result-excerpt">${highlightText(getExcerpt(item.content, query), query)}</p>
        </article>
      `;
    }).join('');

    overlaySearchResults.innerHTML = resultsHTML;
  }

  // Show overlay placeholder
  function showOverlayPlaceholder() {
    overlaySearchResults.innerHTML = `
      <div class="search-overlay-placeholder">
        <i class="fas fa-search"></i>
        <p>Start typing to search...</p>
        <p class="search-tip"><i class="fas fa-lightbulb"></i> Use ⌘K to quickly open search</p>
      </div>
    `;
  }

  // Show overlay loading
  function showOverlayLoading() {
    overlaySearchResults.innerHTML = `
      <div class="search-overlay-loading">
        <div class="spinner"></div>
        <p><i class="fas fa-spinner fa-spin"></i> Searching...</p>
      </div>
    `;
  }

  // Show overlay no results
  function showOverlayNoResults() {
    overlaySearchResults.innerHTML = `
      <div class="search-overlay-no-results">
        <i class="far fa-frown"></i>
        <p>No results found</p>
        <p class="search-tip"><i class="fas fa-info-circle"></i> Try different keywords or check your spelling</p>
      </div>
    `;
  }

  // Highlight search terms
  function highlightText(text, query) {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Get excerpt from content
  function getExcerpt(content, query) {
    if (!content) return '';
    
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    const queryIndex = contentLower.indexOf(queryLower);
    
    if (queryIndex === -1) {
      return content.substring(0, 100) + '...';
    }
    
    const start = Math.max(0, queryIndex - 30);
    const end = Math.min(content.length, queryIndex + 70);
    
    let excerpt = content.substring(start, end);
    
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

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchOverlay);
  } else {
    initSearchOverlay();
  }
})();
