(function() {
  // Search configuration
  const SEARCH_CONFIG = {
    contentPreviewLength: 150,
    maxResults: 20
  };

  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < Math.min(results.length, SEARCH_CONFIG.maxResults); i++) {  // Iterate over the results
        var item = store[results[i].ref];
        var relevance = Math.round(results[i].score * 100);
        
        // Get highlighted text using smart highlighting that works with fuzzy search
        var highlightedTitle = smartHighlightText(item.title, searchTerm, results[i]);
        var highlightedExcerpt = smartHighlightText(getExcerpt(item.content, searchTerm), searchTerm, results[i]);
        
        appendString += '<li class="search-result" data-relevance="' + relevance + '">';
        appendString += '<span class="post-meta">' + item.date + '</span>';
        appendString += '<a href="' + item.url + '"><h2>' + highlightedTitle + '</h2></a>';
        appendString += '<p>' + highlightedExcerpt + '</p>';
        appendString += '<div class="result-footer">';
        appendString += '<span class="result-relevance"><i class="fas fa-star"></i> Relevance: ' + relevance + '%</span>';
        appendString += '<a href="' + item.url + '" class="result-link"><i class="fas fa-external-link"></i> Read more</a>';
        appendString += '</div></li>';
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<li><h2>No results found</h2></li>';
    }
  }

  // Smart highlighting that works with fuzzy search results
  function smartHighlightText(text, query, searchResult) {
    if (!text || !query) return text;
    
    // Split query into individual terms
    var queryTerms = query.toLowerCase().split(/\s+/).filter(function(term) { return term.length > 0; });
    var highlightedText = text;
    
    // First, try to highlight exact matches and partial matches
    for (var i = 0; i < queryTerms.length; i++) {
      var term = queryTerms[i];
      if (term.length < 2) continue;
      
      var escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Try different matching strategies in order of precision:
      // 1. Exact word match (most precise)
      var regex = new RegExp('\\b(' + escapedTerm + ')\\b', 'gi');
      if (regex.test(highlightedText)) {
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        // Found exact match, return immediately - no fuzzy matching
        return highlightedText;
      }
      
      // 2. Partial word match (starts with - still precise)
      regex = new RegExp('\\b(' + escapedTerm + '[a-zA-Z]*)', 'gi');
      if (regex.test(highlightedText)) {
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        // Found partial match, return immediately - no fuzzy matching
        return highlightedText;
      }
      
      // 3. Very strict partial match (only if term is at start/end and very close in length)
      // This prevents false matches like "five-day" matching "meditation"
      var words = highlightedText.split(/\s+/);
      var foundStrictMatch = false;
      
      for (var j = 0; j < words.length; j++) {
        var word = words[j];
        var wordLower = word.toLowerCase().replace(/[^\w]/g, '');
        
        // Only match if the term is a significant part (at least 70% of the word)
        if (term.length >= 3 && wordLower.length >= 3) {
          // Check if term is at the start of the word
          if (wordLower.indexOf(term) === 0 && wordLower.length <= term.length + 1) {
            var escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var wordRegex = new RegExp('\\b' + escapedWord + '\\b', 'gi');
            highlightedText = highlightedText.replace(wordRegex, '<mark>' + word + '</mark>');
            foundStrictMatch = true;
            break;
          }
          // Check if term is at the end of the word
          if (wordLower.lastIndexOf(term) === wordLower.length - term.length && wordLower.length <= term.length + 1) {
            var escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var wordRegex = new RegExp('\\b' + escapedWord + '\\b', 'gi');
            highlightedText = highlightedText.replace(wordRegex, '<mark>' + word + '</mark>');
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
    if (highlightedText.indexOf('<mark>') === -1) {
      highlightedText = findLunrMatches(text, queryTerms);
    }
    
    return highlightedText;
  }
  
  // Fast fuzzy matching with multiple strategies
  function highlightFuzzyMatches(text, queryTerms) {
    var highlightedText = text;
    
    for (var i = 0; i < queryTerms.length; i++) {
      var term = queryTerms[i];
      if (term.length < 3) continue;
      
      var words = text.split(/\s+/);
      var highlightedWords = words.map(function(word) {
        var wordLower = word.toLowerCase().replace(/[^\w]/g, '');
        
        // Use fast similarity scoring
        var similarity = fastSimilarity(term, wordLower);
        
        if (similarity >= 0.4) { // Much lower threshold for better fuzzy matching
          return word.replace(word, '<mark>' + word + '</mark>');
        }
        
        return word;
      });
      
      highlightedText = highlightedWords.join(' ');
    }
    
    return highlightedText;
  }
  
  // Fast similarity calculation using multiple strategies
  function fastSimilarity(str1, str2) {
    if (str1 === str2) return 1.0;
    if (str1.length === 0 || str2.length === 0) return 0.0;
    
    // Strategy 1: Prefix/suffix matching (very fast)
    if (str1.length >= 4 && str2.length >= 4) {
      // Check if one is a prefix of the other
      if (str1.indexOf(str2.substring(0, Math.min(4, str2.length))) === 0) return 0.8;
      if (str2.indexOf(str1.substring(0, Math.min(4, str1.length))) === 0) return 0.8;
      
      // Check if one is a suffix of the other
      if (str1.lastIndexOf(str2.substring(Math.max(0, str2.length - 4))) === str1.length - Math.min(4, str2.length)) return 0.8;
      if (str2.lastIndexOf(str1.substring(Math.max(0, str1.length - 4))) === str2.length - Math.min(4, str1.length)) return 0.8;
    }
    
    // Strategy 2: Character frequency analysis (fast)
    var freq1 = getCharacterFrequency(str1);
    var freq2 = getCharacterFrequency(str2);
    var freqSimilarity = compareCharacterFrequency(freq1, freq2);
    
    if (freqSimilarity > 0.8) return freqSimilarity;
    
    // Strategy 3: Enhanced edit distance for better fuzzy matching
    var editSimilarity = enhancedEditDistance(str1, str2);
    if (editSimilarity > 0.5) return editSimilarity; // Lower threshold
    
    // Strategy 4: Soundex-like phonetic matching
    var soundex1 = getSimpleSoundex(str1);
    var soundex2 = getSimpleSoundex(str2);
    if (soundex1 === soundex2) return 0.7;
    
    // Strategy 5: N-gram similarity for longer strings
    if (str1.length >= 6 && str2.length >= 6) {
      var ngramSimilarity = getNgramSimilarity(str1, str2, 3);
      if (ngramSimilarity > 0.4) return ngramSimilarity; // Lower threshold
    }
    
    // Strategy 6: Pattern-based similarity for common typos
    var patternSimilarity = getPatternSimilarity(str1, str2);
    if (patternSimilarity > 0.4) return patternSimilarity;
    
    return Math.max(freqSimilarity, editSimilarity, patternSimilarity);
  }
  
  // Get character frequency for quick similarity
  function getCharacterFrequency(str) {
    var freq = {};
    for (var i = 0; i < str.length; i++) {
      var char = str[i];
      freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
  }
  
  // Compare character frequencies
  function compareCharacterFrequency(freq1, freq2) {
    var allChars = Object.keys(freq1).concat(Object.keys(freq2));
    var uniqueChars = allChars.filter(function(char, index) { return allChars.indexOf(char) === index; });
    var matches = 0;
    var total = 0;
    
    for (var i = 0; i < uniqueChars.length; i++) {
      var char = uniqueChars[i];
      var count1 = freq1[char] || 0;
      var count2 = freq2[char] || 0;
      matches += Math.min(count1, count2);
      total += Math.max(count1, count2);
    }
    
    return total > 0 ? matches / total : 0;
  }
  
  // Enhanced edit distance with better fuzzy matching
  function enhancedEditDistance(str1, str2) {
    if (str1 === str2) return 1.0;
    
    var len1 = str1.length;
    var len2 = str2.length;
    
    // Quick checks
    if (Math.abs(len1 - len2) > 3) return 0.0;
    
    // Use dynamic programming for better accuracy
    var matrix = [];
    
    // Initialize matrix
    for (var i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }
    for (var j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }
    
    // Fill matrix with enhanced scoring
    for (var i = 1; i <= len2; i++) {
      for (var j = 1; j <= len1; j++) {
        if (str2[i - 1] === str1[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          // Check for transposition (adjacent character swap)
          var transpositionCost = Infinity;
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
    
    var distance = matrix[len2][len1];
    var maxLen = Math.max(len1, len2);
    return Math.max(0, 1 - (distance / maxLen));
  }
  
  // N-gram similarity for longer strings
  function getNgramSimilarity(str1, str2, n) {
    n = n || 3;
    if (str1.length < n || str2.length < n) return 0.0;
    
    var ngrams1 = getNgrams(str1, n);
    var ngrams2 = getNgrams(str2, n);
    
    var intersection = [];
    for (var i = 0; i < ngrams1.length; i++) {
      if (ngrams2.indexOf(ngrams1[i]) !== -1) {
        intersection.push(ngrams1[i]);
      }
    }
    
    var union = ngrams1.concat(ngrams2).filter(function(ngram, index, arr) { 
      return arr.indexOf(ngram) === index; 
    });
    
    return union.length > 0 ? intersection.length / union.length : 0.0;
  }
  
  // Get N-grams from string
  function getNgrams(str, n) {
    var ngrams = [];
    for (var i = 0; i <= str.length - n; i++) {
      ngrams.push(str.substring(i, i + n));
    }
    return ngrams;
  }
  
  // Pattern-based similarity for common typos and character substitutions
  function getPatternSimilarity(str1, str2) {
    if (str1.length !== str2.length) return 0.0;
    
    // Common typo patterns
    var typoPatterns = {
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
    
    var matches = 0;
    var total = str1.length;
    
    for (var i = 0; i < str1.length; i++) {
      var char1 = str1[i].toLowerCase();
      var char2 = str2[i].toLowerCase();
      
      if (char1 === char2) {
        matches++;
      } else {
        // Check if characters are similar according to typo patterns
        var similarChars = typoPatterns[char1] || [];
        if (similarChars.indexOf(char2) !== -1) {
          matches += 0.7; // Partial credit for similar characters
        }
      }
    }
    
    return matches / total;
  }
  
  // Find what Lunr.js actually matched by analyzing the search results
  function findLunrMatches(text, queryTerms) {
    var highlightedText = text;
    
    // For each query term, find ALL similar words in the text
    for (var i = 0; i < queryTerms.length; i++) {
      var term = queryTerms[i];
      if (term.length < 3) continue;
      
      var words = text.split(/\s+/);
      var matches = [];
      
      for (var j = 0; j < words.length; j++) {
        var word = words[j];
        var wordLower = word.toLowerCase().replace(/[^\w]/g, '');
        if (wordLower.length < 3) continue;
        
        // Use our similarity function to find similar words
        var similarity = fastSimilarity(term, wordLower);
        
        if (similarity > 0.3) { // Lower threshold for Lunr matches
          matches.push({ word: word, similarity: similarity });
        }
      }
      
      // Sort by similarity and highlight ALL matches above threshold
      matches.sort(function(a, b) { return b.similarity - a.similarity; });
      
      // Highlight all matches, but avoid double-highlighting
      for (var k = 0; k < matches.length; k++) {
        var match = matches[k];
        if (highlightedText.indexOf('<mark>' + match.word + '</mark>') === -1) {
          var escapedMatch = match.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          var regex = new RegExp('\\b' + escapedMatch + '\\b', 'gi');
          highlightedText = highlightedText.replace(regex, '<mark>' + match.word + '</mark>');
        }
      }
    }
    
    return highlightedText;
  }
  
  // Simple soundex-like algorithm
  function getSimpleSoundex(str) {
    if (!str) return '';
    
    var soundexMap = {
      'b': '1', 'f': '1', 'p': '1', 'v': '1',
      'c': '2', 'g': '2', 'j': '2', 'k': '2', 'q': '2', 's': '2', 'x': '2', 'z': '2',
      'd': '3', 't': '3',
      'l': '4',
      'm': '5', 'n': '5',
      'r': '6'
    };
    
    var result = str[0].toUpperCase();
    var prevCode = soundexMap[str[0].toLowerCase()] || '';
    
    for (var i = 1; i < str.length && result.length < 4; i++) {
      var char = str[i].toLowerCase();
      var code = soundexMap[char];
      
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
    var queryTerms = query.toLowerCase().split(/\s+/).filter(function(term) { return term.length > 0; });
    var bestIndex = -1;
    var bestScore = 0;
    
    // Find the best match position by scoring each term occurrence
    for (var i = 0; i < queryTerms.length; i++) {
      var term = queryTerms[i];
      if (term.length < 2) continue;
      
      var contentLower = content.toLowerCase();
      var index = 0;
      
      while ((index = contentLower.indexOf(term, index)) !== -1) {
        // Score based on position and context
        var score = 0;
        
        // Prefer matches near the beginning
        if (index < 200) score += 10;
        else if (index < 500) score += 5;
        
        // Prefer matches that are part of complete words
        var beforeChar = index > 0 ? contentLower[index - 1] : ' ';
        var afterChar = index + term.length < contentLower.length ? contentLower[index + term.length] : ' ';
        
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
    }
    
    if (bestIndex === -1) {
      // No good match found, return beginning of content
      return content.substring(0, SEARCH_CONFIG.contentPreviewLength) + '...';
    }
    
    // Start from best match position and get surrounding context
    var start = Math.max(0, bestIndex - 60);
    var end = Math.min(content.length, bestIndex + SEARCH_CONFIG.contentPreviewLength);
    
    var excerpt = content.substring(start, end);
    
    // Add ellipsis if we're not at the beginning/end
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';
    
    return excerpt;
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('category');
      this.field('content');
    });

    for (var key in window.store) { // Add the data to lunr
      idx.add({
        'id': key,
        'title': window.store[key].title,
        'author': window.store[key].author,
        'category': window.store[key].category,
        'content': window.store[key].content
      });
    }

    var results = idx.search(searchTerm); // Get lunr to perform a search
    displaySearchResults(results, window.store); // We'll write this in the next section
  }
})();
