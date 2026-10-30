---
title: Why I built Hotpress
description: Hotpress is my own static site generator, designed for agents to build sites on.
date: 2026-10-30
image: hotpress.jpg
permalink: /work/why-i-built-hotpress/
---

I love static site generators and the speed of static HTML. I've used them since 2014, when I [moved this blog from WordPress to Jekyll](/work/how-i-migrated-from-wordpress-to-jekyll/).

This blog now runs on [Hotpress](https://github.com/bchadfield/hotpress), a static site generator I built to my exact requirements. So does the [Neighbourhood Finder website](https://neighbourhoodfinder.co.uk), which was on Astro.

## Why I built it

I felt the inspiration while on holiday. The wet weather forced me inside to relax. Rather than patch SEO-impacting bugs and deal with the latest vulnerability reports, I decided to birth my very own SSG exactly as I wanted it.

Most SSGs own the structure. Either your content folders become URLs and a theme sets the look, or a framework's route files decide which pages exist. You fill that structure in with content, templates and config. You get a lot for free, but you work inside the SSG's model.

Agents change that trade-off. With Claude Code it's easy to write exactly the site code I want: templates, URL schemes, ad slots, the odd rules every site picks up. The hard part is the engine. A big SSG has its own way of doing things, and the work goes on bending the site around it.

I wanted to do it differently. Hotpress lets an agent build the theme and structure a site needs, not the structure an SSG supports. Hotpress handles the generation: loading and validating content, rendering, bundling, writing the output, previewing it and checking it before it goes live. The site gets the freedom, and the builds stay deterministic.

Almost no site is a simple index and detail page structure. Hotpress makes it easy to build the structure you want, without constraints from the file or URL structure. URLs don't depend on where files live, and one file lists every page the site has, so nothing appears or disappears by accident. That's also what made the zero-diff migrations below possible.

The initial build is one thing, but I also wanted it to fit how I create and publish content. The Neighbourhood Finder website is the better example because there are over 8,000 pages. Most are the neighbourhood pages built from CSV data with a nested index structure covering country, county, local authority district, then neighbourhood. There are different types of neighbourhood page, some more editorial than others. There's also a blog, press and a few static pages.

Each week, I add new blog posts, tweak specific area pages and update the neighbourhood data. This is automated. Hermes, a self-hosted agent harness like OpenClaw, manages the content generation flow with Claude. The blog generation agent works with a lot of scripts and checks to make sure that changes are fine. I review and approve content updates, but I'm not checking 8,000 pages.

I wanted a partner for the publishing agent to rely on for the site rules. Most importantly, I wanted the updated site working well in the development environment before pushing for the production build. The agent owns the dev environment. It doesn't need to ask permission and can work until the goal is reached. Its workflow instructions are cut right back, because it can rely on the existing content structure and the Hotpress checks to make sure everything works.

## What makes Hotpress different

### Built for agents to build on

Hotpress ships an `AGENTS.md` that tells coding agents how to build a site on it. Every error says what's wrong, where (file, row or URL) and how to fix it. With `--json` the errors come out as structured problems with a stable code, so an agent can fix them and run again.

There's no plugin system because it's easy for LLMs to build what they need. The site's own code is the extension. Hotpress loads and validates content, renders it, bundles assets, writes the output, previews it and checks it. Everything specific to a site lives in one `hotpress.site.tsx` file and the components it imports. Sites own their experience, and the engine stays simple. The site's codebase then becomes the definition the LLM works within to create updates.

### Deterministic builds

The same checkout gives the same bytes. A build never reads the clock, file modification times or git history. Publish and update dates come from content, so this blog's build fails if a post has no `date`. `hotpress check --twice` builds twice and compares the output.

This matters for SEO. Neighbourhood Finder's Astro build dated its data pages from the CSV file's modification time, so a deploy made thousands of unchanged pages look updated. Google kept recrawling them. 8,000 pages builds quickly, but most of them don't change from week to week. On Hotpress, a page's date only changes when its content does. It's too early to see the effect in Google Search Console.

### What you preview is what ships

The advantage of a statically generated site is that HTML has very few environmental dependencies. However, HTML isn't the start and end of a site. `hotpress dev` serves a production build the way the host serves it: redirects, headers, trailing-slash redirects and the 404 page with a real 404 status. The only differences are live reload, and leaving out analytics and ads so previews don't send traffic. Preview builds go into a cache folder, never `dist/`, so a preview can't be deployed by mistake.

### Checks before anything goes live

`hotpress publish` commits, builds that exact commit in a clean worktree, and checks it. It looks for broken links, missing titles, descriptions and canonicals, URLs that disappeared without a redirect, and content that changed without a new date. If anything fails, it undoes the commit, keeps your changes and prints the problems. If everything passes, it pushes. Building the commit rather than the working tree catches files you forgot to add.

Sites add their own checks as tasks. Neighbourhood Finder has one that records each data page's content hash and the date it last changed, which is how its sitemap dates stay honest. Its Netlify build runs `hotpress build --check`, so a change that skipped the checks fails to deploy and the previous version stays live.

### One bad entry fails the build

Markdown, MDX, CSV and JSON all become the same entry shape, validated by a schema. If one entry is wrong, the whole build fails with the file and line. I'd rather the site isn't updated than a single page goes out broken.

### JSX without the framework

Templates are TSX components rendered straight to HTML strings. Typed props, escaping by default, no virtual DOM and no hydration. Pages ship zero JavaScript unless a component opts in with `<Script>`.

Neighbourhood Finder's interactive Recharts charts work this way. React and Recharts load only on the blog posts that have a chart.

### Upgrades don't change your HTML

Each site sets a `compat` date. It pins the defaults that shape output, like escaping and whitespace. A new version of Hotpress keeps the old behaviour for old `compat` dates, so upgrading never changes a site's HTML until the site bumps the date.

### Migrations you can prove

My rule for both migrations was that Google shouldn't notice. No URL or metadata changes. `hotpress diff` compares two builds on everything search engines care about: the URL set, titles, descriptions, canonicals, Open Graph tags, JSON-LD, sitemaps, feeds, robots.txt, redirects, headers, status codes and internal links.

This blog came out with zero diffs across its 36 pages. Neighbourhood Finder came out with zero diffs across 8,218 pages, three sitemaps, status codes for 16,490 paths and 318,365 internal links.

## What other SSGs share

I'm not trying to be original. I wanted these principles, and most of them already exist somewhere. I compared Hotpress with the popular SSGs, plus a couple of newer ones built for agents, and each principle shows up somewhere else:

- **The site is code.** In [Hakyll](https://jaspervdj.be/hakyll), your site is a Haskell program built on the library.
- **Built for agents.** [seite](https://github.com/seite-sh/seite) writes an `AGENTS.md` and runs an MCP server. Its agent writes the content. In Hotpress the agent writes the site, and the content.
- **Schemas that fail the build, and zero JavaScript by default.** [Astro](https://astro.build) does both, and it's where Neighbourhood Finder came from.
- **JSX rendered to strings.** This is common. Lume supports it, and several small JSX runtimes do the same.
- **Output pinned to a date.** Nuxt and Nitro have a `compatibilityDate` setting.
- **Comparing two versions of a site.** [SiteDiff](https://github.com/evolvingweb/sitediff) does this for migrations and upgrades.

In the SSGs I looked at, I didn't find all of these together. A few pieces I didn't find at all: builds that never take dates from the clock, file times or git (Hugo can set dates from git), a compat date in an SSG, a publish command that builds the exact commit and checks for removed URLs and stale dates, and a diff that focuses on what search engines see.

## How to use it yourself

Hotpress isn't for someone looking for an SSG that gives them everything out of the box. You either need to be opinionated about your site or happy to leave those decisions to your agent. It's also early: version 0.2.1, running two sites.

It's unlikely that you'll have the same requirements I did, but if you do, Hotpress is open source under the MIT license and on npm as [@benchadfield/hotpress](https://www.npmjs.com/package/@benchadfield/hotpress).

```bash
npm install --save-dev @benchadfield/hotpress typescript @types/node
npx hotpress init --origin https://example.com
npm run dev
```

`init` writes a small blog that builds and passes `hotpress check` as it is.

A site module that loads Markdown posts and CSV data looks like this:

```tsx
import { defineSite, markdown, csv, s } from "@benchadfield/hotpress";
import { Layout } from "./src/Layout.tsx";

export default defineSite({
  origin: "https://example.com",
  compat: "2026-10-29",
  async build(site) {
    const posts = await site.load(markdown("content/posts", {
      schema: { title: s.string(), date: s.date() }
    }));
    const places = await site.load(csv("data/places.csv", {
      schema: { slug: s.slug(), name: s.string(), population: s.number().int() }
    }));

    for (const post of posts) {
      site.page(`/blog/${post.slug}/`, () => (
        <Layout title={post.data.title}>{post.body}</Layout>
      ), { updated: post.data.date });
    }
    for (const place of places) {
      site.page(`/places/${place.slug}/`, () => (
        <Layout title={place.data.name}><p>Population {place.data.population}</p></Layout>
      ));
    }
  }
});
```

Every page is a `site.page()` call, whether it comes from a Markdown file or a CSV row. The [README](https://github.com/bchadfield/hotpress) covers the content model and commands.
