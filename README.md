# [kryptokommun.ist](https://kryptokommun.ist)

Personal blog powered by [Jekyll](https://jekyllrb.com) and [GitHub Pages](https://pages.github.com).

## Branch Structure

- `jekyll` - Source files (posts, templates, images)
- `master` - Built static site (published to GitHub Pages)

## Quick Start

### Local Development

```bash
# Serve locally with Docker
docker run --rm -v "$(pwd):/srv/jekyll" -w /srv/jekyll -p 4000:4000 jekyll/jekyll:4 jekyll serve --host 0.0.0.0
```

Visit http://localhost:4000

### Build Site

```bash
docker run --rm -v "$(pwd):/srv/jekyll" -w /srv/jekyll jekyll/jekyll:4 jekyll build
```

Built site outputs to `_site/`.

## Publishing

See [CLAUDE.md](CLAUDE.md) for detailed build and publish workflow.

## Adding Content

- Posts: `_posts/<category>/YYYY-MM-DD-slug.md`
- Images: `images/`
- Portfolio projects: `_posts/portfolio/projects/`
