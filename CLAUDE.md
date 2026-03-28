# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a GitHub Pages blog built with Jekyll using the [Chirpy theme](https://github.com/cotes2020/jekyll-theme-chirpy/) (gem-based, v7.5+). It uses the Chirpy Starter template, meaning theme layouts/includes/sass come from the gem — only config, tabs, plugins, posts, and assets live in this repo.

## Common Commands

```bash
# Install dependencies
bundle install

# Local development server (with live reload)
bash tools/run.sh                    # serves at http://127.0.0.1:4000
bash tools/run.sh -H 0.0.0.0        # bind to all interfaces
bash tools/run.sh -p                 # production mode

# Build and test (production build + htmlproofer)
bash tools/test.sh

# Build only
JEKYLL_ENV=production bundle exec jekyll b -d _site
```

## Architecture

- **Theme**: `jekyll-theme-chirpy` gem — do not add `_layouts/`, `_includes/`, or `_sass/` unless overriding theme defaults.
- **Posts**: Markdown files in `_posts/` following Jekyll naming: `YYYY-MM-DD-title.md` with YAML front matter (`layout: post`, `comments: true`, `toc: true` are defaults).
- **Tabs**: `_tabs/` contains sidebar navigation pages (about, archives, categories, tags). Each has `layout: page` and an `order` field for sorting.
- **Static assets**: `assets/` with a git submodule at `assets/lib` pointing to `chirpy-static-assets`.
- **Plugin**: `_plugins/posts-lastmod-hook.rb` auto-sets `last_modified_at` from git history.
- **Config**: `_config.yml` holds all site settings (theme mode, comments provider, analytics, PWA, SEO).

## Deployment

Pushes to `main` trigger `.github/workflows/pages-deploy.yml` which builds with Jekyll, runs htmlproofer, and deploys to GitHub Pages. Ruby 3.4 is used in CI.

## Key Conventions

- Post permalink pattern: `/posts/:title/`
- Drafts go in `_drafts/` (comments disabled by default)
- The `assets/lib` submodule must be initialized for full static asset support (`git submodule update --init`)
