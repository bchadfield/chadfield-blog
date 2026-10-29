# Migration to Hotpress

Branch `hotpress`. Parity with production (the committed `dist/` at `origin/main` 03bab96) is
checked with:

```bash
git -C ../chadfield-blog worktree add --detach /tmp/blog-baseline 03bab96   # once
npm run build
npx hotpress diff /tmp/blog-baseline/dist dist --strict-whitespace
```

Result: **zero diffs** on the URL set, per-page metadata, sitemap, robots.txt, the Atom feed,
status codes and internal links. Visible page text is identical on all 36 pages.

## What changed in the repo

- Eleventy, Nunjucks templates, `src/_data`, `config/` and `scripts/` are replaced by
  `hotpress.site.tsx` and TSX layouts in `src/site/`. The Markdown renderer keeps the same markdown-it plugins and options.
- `src/assets/fonts` and `src/assets/images` moved to `public/assets/` (same URLs).
- `dist/` is no longer committed. GitHub Actions builds it (`npm ci && npm run build`) and deploys
  to Pages. See `.github/workflows/static.yml`.
- Pages without a frontmatter date used to get one from git history ("git Created"). Their dates are
  now written into frontmatter, using the exact timestamps production shows, and a date is required.

## Output differences (none affect search)

- `<meta name="generator" content="Eleventy v3.1.2">` is gone. It isn't one of the parity fields, and
  it would no longer be true.
- The footer year is the year of the newest post rather than the build date, so builds stay
  deterministic. It's 2026 either way today.
- `global.css` lost two Tailwind utilities (`.filter`, `.inline`) that Tailwind had picked up from words in the
  old Nunjucks/JS files. No page uses them.
- GA4 is left out of `npm run dev` previews only. Production builds include it, as before.

## Known issues kept for parity (fix after cutover)

- `<link rel="author" href="humans.txt">` is relative, and `<base href>` makes it 404 on every page except `/`.
- `og:image` and the JSON-LD image point at `/assets/images/opengraph-default.jpg`, which doesn't exist.
- The BlogPosting JSON-LD has `"@id": ""`.
- `_redirects` is empty, and GitHub Pages ignores it anyway.
