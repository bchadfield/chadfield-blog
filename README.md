# Problem First (chadfield.org)

Ben Chadfield's blog, built with [Hotpress](https://github.com/bchadfield/hotpress) and deployed to
GitHub Pages by GitHub Actions on every push to `main`.

```bash
npm ci
npm run dev      # production build served like GitHub Pages, reloads on change
npm run build    # build to dist/ and print what changed
```

- Posts: `src/posts/*.md` (`title`, `date`, `image`, `permalink`, optional `description`)
- Descendants stories: `src/stories/*.md` (`title`, `date`, `timeline`, `characters`)
- Pages: `src/pages/*.md` (`title`, `date`, `permalink`, `layout`)
- Templates: `src/site/*.tsx`; site wiring: `hotpress.site.tsx`
- Static files: `public/`

Every page needs an explicit `date`; the build fails without one.
