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
      
      // Get highlighted text using smart highlighting that works with fuzzy search
      const highlightedTitle = smartHighlightText(item.title, query, result);
      const highlightedExcerpt = smartHighlightText(getExcerpt(item.content, query), query, result);
      
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
            <a href="${item.url}">${highlightedTitle}</a>
          </h3>
          <p class="result-excerpt">${highlightedExcerpt}</p>
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

  // Smart highlighting that works with fuzzy search results
  function smartHighlightText(text, query, searchResult) {
    if (!text || !query) return text;
    
    // Split query into individual terms
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;
    
    // First, try to highlight exact matches and partial matches
    for (let i = 0; i < queryTerms.length; i++) {
      const term = queryTerms[i];
      if (term.length < 2) continue;
      
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Try different matching strategies in order of precision:
      // 1. Exact word match (most precise)
      let regex = new RegExp(`\\b(${escapedTerm})\\b`, 'gi');
      if (regex.test(highlightedText)) {
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        // Found exact match, return immediately - no fuzzy matching
        return highlightedText;
      }
      
      // 2. Partial word match (starts with - still precise)
      regex = new RegExp(`\\b(${escapedTerm}[a-zA-Z]*)`, 'gi');
      if (regex.test(highlightedText)) {
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        // Found partial match, return immediately - no fuzzy matching
        return highlightedText;
      }
      
      // 3. Very strict partial match (only if term is at start/end and very close in length)
      // This prevents false matches like "five-day" matching "meditation"
      const words = highlightedText.split(/\s+/);
      let foundStrictMatch = false;
      
      for (let j = 0; j < words.length; j++) {
        const word = words[j];
        const wordLower = word.toLowerCase().replace(/[^\w]/g, '');
        
        // Only match if the term is a significant part (at least 70% of the word)
        if (term.length >= 3 && wordLower.length >= 3) {
          // Check if term is at the start of the word
          if (wordLower.startsWith(term) && wordLower.length <= term.length + 1) {
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const wordRegex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
            highlightedText = highlightedText.replace(wordRegex, `<mark>${word}</mark>`);
            foundStrictMatch = true;
            break;
          }
          // Check if term is at the end of the word
          if (wordLower.endsWith(term) && wordLower.length <= term.length + 1) {
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const wordRegex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
            highlightedText = highlightedText.replace(wordRegex, `<mark>${word}</mark>`);
            foundStrictMatch = true;
            break;
          }
        }
      }
      
      if (foundStrictMatch) {
        return highlightedText;
      }
    }
    
    // If no exact/partial matches were found, try fuzzy matching for similar words
    highlightedText = highlightFuzzyMatches(text, queryTerms);
    
    // If still no highlights, try to find what Lunr.js actually matched
    if (!highlightedText.includes('<mark>')) {
      highlightedText = findLunrMatches(text, queryTerms);
    }
    
    return highlightedText;
  }
  
  // Fast fuzzy matching with multiple strategies
  function highlightFuzzyMatches(text, queryTerms) {
    let highlightedText = text;
    
    queryTerms.forEach(term => {
      if (term.length < 3) return;
      
      const words = text.split(/\s+/);
      const highlightedWords = words.map(word => {
        const wordLower = word.toLowerCase().replace(/[^\w]/g, '');
        
        // Use fast similarity scoring
        const similarity = fastSimilarity(term, wordLower);
        
        if (similarity >= 0.4) { // Much lower threshold for better fuzzy matching
          return word.replace(word, `<mark>${word}</mark>`);
        }
        
        return word;
      });
      
      highlightedText = highlightedWords.join(' ');
    });
    
    return highlightedText;
  }
  
  // Fast similarity calculation using multiple strategies
  function fastSimilarity(str1, str2) {
    if (str1 === str2) return 1.0;
    if (str1.length === 0 || str2.length === 0) return 0.0;
    
    // Strategy 1: Prefix/suffix matching (very fast)
    if (str1.length >= 4 && str2.length >= 4) {
      // Check if one is a prefix of the other
      if (str1.startsWith(str2.substring(0, Math.min(4, str2.length)))) return 0.8;
      if (str2.startsWith(str1.substring(0, Math.min(4, str1.length)))) return 0.8;
      
      // Check if one is a suffix of the other
      if (str1.endsWith(str2.substring(Math.max(0, str2.length - 4)))) return 0.8;
      if (str2.endsWith(str1.substring(Math.max(0, str1.length - 4)))) return 0.8;
    }
    
    // Strategy 2: Character frequency analysis (fast)
    const freq1 = getCharacterFrequency(str1);
    const freq2 = getCharacterFrequency(str2);
    const freqSimilarity = compareCharacterFrequency(freq1, freq2);
    
    if (freqSimilarity > 0.8) return freqSimilarity;
    
    // Strategy 3: Enhanced edit distance for better fuzzy matching
    const editSimilarity = enhancedEditDistance(str1, str2);
    if (editSimilarity > 0.5) return editSimilarity; // Lower threshold
    
    // Strategy 4: Soundex-like phonetic matching
    const soundex1 = getSimpleSoundex(str1);
    const soundex2 = getSimpleSoundex(str2);
    if (soundex1 === soundex2) return 0.7;
    
    // Strategy 5: N-gram similarity for longer strings
    if (str1.length >= 6 && str2.length >= 6) {
      const ngramSimilarity = getNgramSimilarity(str1, str2, 3);
      if (ngramSimilarity > 0.4) return ngramSimilarity; // Lower threshold
    }
    
    // Strategy 6: Pattern-based similarity for common typos
    const patternSimilarity = getPatternSimilarity(str1, str2);
    if (patternSimilarity > 0.4) return patternSimilarity;
    
    return Math.max(freqSimilarity, editSimilarity, patternSimilarity);
  }
  
  // Get character frequency for quick similarity
  function getCharacterFrequency(str) {
    const freq = {};
    for (let char of str) {
      freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
  }
  
  // Compare character frequencies
  function compareCharacterFrequency(freq1, freq2) {
    const allChars = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
    let matches = 0;
    let total = 0;
    
    for (let char of allChars) {
      const count1 = freq1[char] || 0;
      const count2 = freq2[char] || 0;
      matches += Math.min(count1, count2);
      total += Math.max(count1, count2);
    }
    
    return total > 0 ? matches / total : 0;
  }
  
  // Enhanced edit distance with better fuzzy matching
  function enhancedEditDistance(str1, str2) {
    if (str1 === str2) return 1.0;
    
    const len1 = str1.length;
    const len2 = str2.length;
    
    // Quick checks
    if (Math.abs(len1 - len2) > 3) return 0.0;
    
    // Use dynamic programming for better accuracy
    const matrix = [];
    
    // Initialize matrix
    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }
    
    // Fill matrix with enhanced scoring
    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2[i - 1] === str1[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          // Check for transposition (adjacent character swap)
          let transpositionCost = Infinity;
          if (i > 1 && j > 1 && str2[i - 1] === str1[j - 2] && str2[i - 2] === str1[j - 1]) {
            transpositionCost = matrix[i - 2][j - 2] + 1;
          }
          
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,     // substitution
            matrix[i][j - 1] + 1,         // insertion
            matrix[i - 1][j] + 1,         // deletion
            transpositionCost               // transposition
          );
        }
      }
    }
    
    const distance = matrix[len2][len1];
    const maxLen = Math.max(len1, len2);
    return Math.max(0, 1 - (distance / maxLen));
  }
  
  // N-gram similarity for longer strings
  function getNgramSimilarity(str1, str2, n = 3) {
    if (str1.length < n || str2.length < n) return 0.0;
    
    const ngrams1 = getNgrams(str1, n);
    const ngrams2 = getNgrams(str2, n);
    
    const intersection = new Set([...ngrams1].filter(x => ngrams2.has(x)));
    const union = new Set([...ngrams1, ...ngrams2]);
    
    return union.size > 0 ? intersection.size / union.size : 0.0;
  }
  
  // Get N-grams from string
  function getNgrams(str, n) {
    const ngrams = new Set();
    for (let i = 0; i <= str.length - n; i++) {
      ngrams.add(str.substring(i, i + n));
    }
    return ngrams;
  }
  
  // Pattern-based similarity for common typos and character substitutions
  function getPatternSimilarity(str1, str2) {
    if (str1.length !== str2.length) return 0.0;
    
    // Common typo patterns
    const typoPatterns = {
      'x': ['m', 'k', 's', 'z'],
      'm': ['x', 'n', 'w'],
      'n': ['m', 'b', 'h'],
      'b': ['n', 'v', 'g'],
      'v': ['b', 'f', 'w'],
      'f': ['v', 'p', 's'],
      'p': ['f', 'b', 'o'],
      'o': ['p', 'i', 'u'],
      'i': ['o', 'u', 'y'],
      'u': ['i', 'o', 'y'],
      'y': ['i', 'u', 'h'],
      'h': ['n', 'y', 'j'],
      'j': ['h', 'g', 'y'],
      'g': ['j', 'h', 'q'],
      'q': ['g', 'k', 'w'],
      'k': ['q', 'c', 'x'],
      'c': ['k', 's', 'x'],
      's': ['c', 'z', 'f'],
      'z': ['s', 'x', 'j'],
      'w': ['v', 'q', 'm'],
      'l': ['i', 'r', 't'],
      'r': ['l', 't', 'd'],
      't': ['r', 'l', 'd'],
      'd': ['t', 'r', 's'],
      'a': ['e', 'o', 'q'],
      'e': ['a', 'i', 'o']
    };
    
    let matches = 0;
    let total = str1.length;
    
    for (let i = 0; i < str1.length; i++) {
      const char1 = str1[i].toLowerCase();
      const char2 = str2[i].toLowerCase();
      
      if (char1 === char2) {
        matches++;
      } else {
        // Check if characters are similar according to typo patterns
        const similarChars = typoPatterns[char1] || [];
        if (similarChars.includes(char2)) {
          matches += 0.7; // Partial credit for similar characters
        }
      }
    }
    
    return matches / total;
  }
  
  // Find what Lunr.js actually matched by analyzing the search results
  function findLunrMatches(text, queryTerms) {
    let highlightedText = text;
    
    // For each query term, find ALL similar words in the text
    queryTerms.forEach(term => {
      if (term.length < 3) return;
      
      const words = text.split(/\s+/);
      const matches = [];
      
      words.forEach(word => {
        const wordLower = word.toLowerCase().replace(/[^\w]/g, '');
        if (wordLower.length < 3) return;
        
        // Use our similarity function to find similar words
        const similarity = fastSimilarity(term, wordLower);
        
        if (similarity > 0.3) { // Lower threshold for Lunr matches
          matches.push({ word, similarity });
        }
      });
      
      // Sort by similarity and highlight ALL matches above threshold
      matches.sort((a, b) => b.similarity - a.similarity);
      
      // Highlight all matches, but avoid double-highlighting
      matches.forEach(match => {
        if (!highlightedText.includes(`<mark>${match.word}</mark>`)) {
          const escapedMatch = match.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escapedMatch}\\b`, 'gi');
          highlightedText = highlightedText.replace(regex, `<mark>${match.word}</mark>`);
        }
      });
    });
    
    return highlightedText;
  }
  
  // Simple soundex-like algorithm
  function getSimpleSoundex(str) {
    if (!str) return '';
    
    const soundexMap = {
      'b': '1', 'f': '1', 'p': '1', 'v': '1',
      'c': '2', 'g': '2', 'j': '2', 'k': '2', 'q': '2', 's': '2', 'x': '2', 'z': '2',
      'd': '3', 't': '3',
      'l': '4',
      'm': '5', 'n': '5',
      'r': '6'
    };
    
    let result = str[0].toUpperCase();
    let prevCode = soundexMap[str[0].toLowerCase()] || '';
    
    for (let i = 1; i < str.length && result.length < 4; i++) {
      const char = str[i].toLowerCase();
      const code = soundexMap[char];
      
      if (code && code !== prevCode) {
        result += code;
        prevCode = code;
      }
    }
    
    while (result.length < 4) {
      result += '0';
    }
    
    return result;
  }

  // Get excerpt from content with improved partial matching
  function getExcerpt(content, query) {
    if (!content) return '';
    
    // Split query into individual terms
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    let bestIndex = -1;
    let bestScore = 0;
    
    // Find the best match position by scoring each term occurrence
    queryTerms.forEach(term => {
      if (term.length < 2) return;
      
      const contentLower = content.toLowerCase();
      let index = 0;
      
      while ((index = contentLower.indexOf(term, index)) !== -1) {
        // Score based on position and context
        let score = 0;
        
        // Prefer matches near the beginning
        if (index < 200) score += 10;
        else if (index < 500) score += 5;
        
        // Prefer matches that are part of complete words
        const beforeChar = index > 0 ? contentLower[index - 1] : ' ';
        const afterChar = index + term.length < contentLower.length ? contentLower[index + term.length] : ' ';
        
        if (beforeChar.match(/[a-z]/) && afterChar.match(/[a-z]/)) {
          // Middle of word - lower score
          score += 2;
        } else if (beforeChar.match(/[a-z]/) || afterChar.match(/[a-z]/)) {
          // Start or end of word - medium score
          score += 5;
        } else {
          // Complete word - highest score
          score += 8;
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
        
        index += 1;
      }
    });
    
    if (bestIndex === -1) {
      // No good match found, return beginning of content
      return content.substring(0, SEARCH_CONFIG.contentPreviewLength) + '...';
    }
    
    // Start from best match position and get surrounding context
    const start = Math.max(0, bestIndex - 60);
    const end = Math.min(content.length, bestIndex + SEARCH_CONFIG.contentPreviewLength);
    
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
