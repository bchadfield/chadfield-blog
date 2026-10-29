// chadfield.org: posts, Descendants stories and standalone pages from Markdown.
import { absoluteUrl, atom, defineSite, markdown, robots, s, sitemaps, type Entry } from "hotpress";
import { buildCss } from "./src/site/css.ts";
import { meta } from "./src/site/data.ts";
import { absolutizeFeedHtml } from "./src/site/feed.ts";
import { assets, DescendantsLayout, HomeLayout, PageLayout, PostLayout, StoryLayout, type PageData } from "./src/site/layouts.tsx";
import { renderMarkdown } from "./src/site/markdown.ts";

const base = {
  title: s.string(),
  description: s.string().optional(),
  // Every page has an explicit date: it drives sitemap lastmod, JSON-LD and ordering.
  date: s.date()
};

/** "/about/index.html" -> "/about/" (permalinks were written as output paths). */
const permalinkToUrl = (permalink: string) => permalink.replace(/index\.html$/, "");

interface Item {
  entry: Entry<PageData>;
  url: string;
  noindex: boolean;
  render: () => unknown;
}

export default defineSite({
  origin: meta.url,
  compat: "2026-10-29",
  check: {
    // Known issues carried over from the Eleventy site, kept for SEO parity. Fix, then remove.
    allow: [
      // <link rel="author" href="humans.txt"> is relative, and <base href> makes it /<page>/humans.txt.
      "link-broken:/**/humans.txt",
      // The default OG image has never existed.
      "link-broken:/assets/images/opengraph-default.jpg"
    ]
  },
  async build(site) {
    assets.css = await site.css("src/assets/css/global.css", { output: "assets/css/global.css", build: buildCss });
    assets.js = await site.script("src/assets/scripts/app.js", { output: "assets/scripts/app.js", format: "iife" });

    const posts = await site.load(
      markdown("src/posts", { schema: { ...base, image: s.string(), permalink: s.string() }, render: renderMarkdown })
    );
    const stories = await site.load(
      markdown("src/stories", { schema: { ...base, timeline: s.string(), characters: s.array(s.string()).default([]) }, render: renderMarkdown })
    );
    const pages = await site.load(
      markdown("src/pages", {
        schema: { ...base, permalink: s.string(), layout: s.enum(["home", "page", "descendants"]), noindex: s.boolean().default(false) },
        render: renderMarkdown
      })
    );

    // Oldest first, ties by source path: the order the site has always used for lists and the sitemap.
    const byDate = <T extends { entry: Entry<PageData> }>(list: T[]) =>
      [...list].sort((a, b) => a.entry.data.date.getTime() - b.entry.data.date.getTime() || (a.entry.source.file < b.entry.source.file ? -1 : 1));

    const postItems = byDate(posts.map((entry) => ({ entry, url: permalinkToUrl(entry.data.permalink) })));
    const storyItems = byDate(stories.map((entry) => ({ entry, url: `/stories/${entry.slug}/` })));
    const newestFirst = [...postItems].reverse();
    const year = newestFirst[0].entry.data.date.getUTCFullYear();

    const items: Item[] = [
      ...postItems.map(({ entry, url }) => ({ entry, url, noindex: false, render: () => <PostLayout entry={entry} year={year} /> })),
      ...storyItems.map(({ entry, url }) => ({ entry, url, noindex: false, render: () => <StoryLayout entry={entry} year={year} /> })),
      ...pages.map((entry) => {
        const url = permalinkToUrl(entry.data.permalink);
        const layout = entry.data.layout;
        const render =
          layout === "home"
            ? () => <HomeLayout entry={entry} year={year} posts={newestFirst} />
            : layout === "descendants"
              ? () => <DescendantsLayout entry={entry} year={year} stories={storyItems} />
              : () => <PageLayout entry={entry} year={year} />;
        return { entry, url, noindex: entry.data.noindex, render };
      })
    ];

    const ordered = byDate(items);
    for (const item of ordered) {
      site.page(item.url, item.render as () => never, { published: item.entry.data.date, updated: item.entry.data.date, noindex: item.noindex });
    }

    const sitemap = sitemaps(
      "sitemap.xml",
      site.origin,
      ordered.filter((i) => !i.noindex).map((i) => ({ loc: absoluteUrl(site.origin, i.url), lastmod: i.entry.data.date }))
    );
    for (const [file, xml] of Object.entries(sitemap)) site.file(file, xml);

    site.file("robots.txt", robots({ rules: [{ userAgent: "*", disallow: ["/404.html"] }], sitemaps: [`${site.origin}/sitemap.xml`] }));
    const feedContent = await Promise.all(
      newestFirst.map(({ entry, url }) => absolutizeFeedHtml(String(entry.body), absoluteUrl(site.origin, url)))
    );
    site.file(
      "feed.xml",
      atom({
        title: meta.blog.name,
        subtitle: meta.blog.description,
        link: `${site.origin}/`,
        self: `${site.origin}/feed.xml`,
        id: `${site.origin}/`,
        author: { name: meta.author, email: meta.authorEmail },
        attributes: { "xml:base": `${site.origin}/` },
        entries: newestFirst.map(({ entry, url }, i) => {
          const href = absoluteUrl(site.origin, url);
          return {
            title: entry.data.title,
            url: href,
            updated: entry.data.date,
            // The old template referenced an undefined locale here, hence the empty xml:lang.
            contentAttributes: { "xml:lang": "" },
            content: feedContent[i]
          };
        })
      })
    );
    site.file("humans.txt", `\n/* TEAM */\nDeveloper: ${meta.author}\nContact: ${meta.authorEmail}\nSite: ${meta.authorWebsite}\n\n\n/* SITE */\nDoctype: HTML5\n`);
    site.file(
      "site.webmanifest",
      JSON.stringify(
        {
          name: `${meta.siteName} - ${meta.siteDescription}`,
          short_name: meta.siteName,
          start_url: meta.url,
          theme_color: meta.themeColor,
          background_color: meta.themeBgColor,
          display: "standalone"
        },
        null,
        2
      )
    );
    // GitHub Pages ignores this file; it is kept so the published file set doesn't change.
    site.file("_redirects", "");
  }
});
