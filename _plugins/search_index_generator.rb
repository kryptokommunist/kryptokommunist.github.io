module Jekyll
  class SearchIndexGenerator < Generator
    safe true
    priority :low

    def generate(site)
      search_data = {}
      
      # Add posts (including portfolio posts)
      site.posts.docs.each do |post|
        # Get the full path to determine if it's a portfolio post
        full_path = post.path
        is_portfolio = full_path.include?('portfolio/')
        
        search_data[post.id] = {
          'id' => post.id,
          'title' => post.data['title'] || '',
          'author' => post.data['author'] || site.config['author'] || '',
          'category' => post.data['category'] || (is_portfolio ? 'portfolio' : ''),
          'tags' => post.data['tags'] || [],
          'content' => post.content.gsub(/\{%\s*include[^%]*%\}/, '').gsub(/<[^>]*>/, '').gsub(/\s+/, ' ').gsub(/["\\]/, '').strip,
          'url' => post.url,
          'date' => post.date.iso8601,
          'type' => is_portfolio ? 'portfolio' : 'post'
        }
      end
      
      # Add pages (excluding search page itself)
      site.pages.each do |page|
        next if page.name == 'search.html' || page.name == 'search.md'
        next unless page.data['title'] && page.data['title'] != 'Search'
        
        search_data[page.name] = {
          'id' => page.name,
          'title' => page.data['title'] || '',
          'author' => page.data['author'] || site.config['author'] || '',
          'category' => page.data['category'] || '',
          'tags' => page.data['tags'] || [],
          'content' => page.content.gsub(/\{%\s*include[^%]*%\}/, '').gsub(/<[^>]*>/, '').gsub(/\s+/, ' ').gsub(/["\\]/, '').strip,
          'url' => page.url,
          'date' => page.data['date'] ? page.data['date'].iso8601 : ''
        }
      end
      
      # Create search.json file
      site.pages << SearchIndexPage.new(site, site.source, '', 'search.json', search_data)
    end
  end

  class SearchIndexPage < Page
    def initialize(site, base, dir, name, search_data)
      @site = site
      @base = base
      @dir = dir
      @name = name
      
      self.process(@name)
      self.data = {}
      self.content = search_data.to_json
    end
    
    def render(layouts, site_payload)
      self.content
    end
    
    def render_with_liquid?
      false
    end
  end
end
