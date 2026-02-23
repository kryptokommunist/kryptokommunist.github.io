# Claude Code Instructions

This is a Jekyll-based personal blog hosted on GitHub Pages.

## Branch Structure

- `jekyll` - Source branch containing Jekyll source files, posts, and images
- `master` - Built/published branch containing the static site (served by GitHub Pages)

## Building and Publishing

### 1. Make changes on the `jekyll` branch

All source changes (posts, images, config) should be made on the `jekyll` branch.

### 2. Build the site with Docker

```bash
# Restore images first (they get removed during branch switching)
git checkout -- images/

# Build with Docker (uses Jekyll 4)
docker run --rm -v "$(pwd):/srv/jekyll" -w /srv/jekyll jekyll/jekyll:4 jekyll build
```

The built site will be in `_site/`.

### 3. Commit and push the jekyll branch

```bash
git add <changed-files>
git commit -m "Description of changes"
git push origin jekyll
```

### 4. Update the master branch

**IMPORTANT:** The master branch must be completely replaced with fresh build files to avoid duplicate file accumulation. Do NOT use rsync which can leave stale files.

```bash
# Copy _site to temp location BEFORE switching branches
cp -R _site /tmp/_site_backup

# Clean up images (they conflict between branches due to encoding differences)
rm -rf images/

# Switch to master
git checkout master

# Remove ALL files except .git and CNAME
cp CNAME /tmp/CNAME_backup
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} \;
cp /tmp/CNAME_backup CNAME

# Copy build files from backup
cp -R /tmp/_site_backup/* .

# Add .nojekyll to prevent GitHub Pages from rebuilding with Jekyll
touch .nojekyll

# Commit and push
git add -A
git commit -m "Rebuild site with <description>"
git push origin master
```

### 5. Return to jekyll branch

```bash
rm -rf images/
git checkout jekyll
```

**Why this approach?**
- Using rsync or incremental copies causes duplicate files (e.g., `file.md` and `file 2.md`) to accumulate
- The `.nojekyll` file is required because GitHub Pages would otherwise try to rebuild with Jekyll, which fails due to source files in _posts/
- The master branch should ONLY contain: CNAME, .nojekyll, and the static site files from _site/

## Local Development

```bash
# Serve locally with live reload
docker run --rm -v "$(pwd):/srv/jekyll" -w /srv/jekyll -p 4000:4000 jekyll/jekyll:4 jekyll serve --host 0.0.0.0
```

Then visit http://localhost:4000

## Adding New Posts

Posts go in `_posts/` subdirectories by category:
- `_posts/tech/` - Technical posts
- `_posts/portfolio/projects/` - Portfolio project pages
- `_posts/travel/` - Travel posts
- etc.

Filename format: `YYYY-MM-DD-slug.md`

## Adding Images

Images go in `images/` directory. Reference them in posts as `/images/filename.png`.

## Notes

- The `images/` directory has encoding differences between branches (umlauts), which causes conflicts during checkout. Always `rm -rf images/` before switching branches.
- Ruby 4.0 (Homebrew default in 2026) is too new for Jekyll 3.x - use Docker instead.
