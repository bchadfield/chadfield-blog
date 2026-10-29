// Page layouts, ported from the Nunjucks templates (base, page, post, story, home, descendants).
// Metadata output matches the previous build exactly, including its whitespace, so search
// engines see no change. Body markup is equivalent.
import { raw, usePage, type Child, type Entry } from "@benchadfield/hotpress";
import { meta, navigation, social } from "./data.ts";
import darkModeSvg from "./svg/dark-mode.svg";
import githubIcon from "./icons/social-github.svg";
import linkedinIcon from "./icons/social-linkedin.svg";
import rssIcon from "./icons/social-rss.svg";

const icons: Record<string, string> = { github: githubIcon, linkedin: linkedinIcon, rss: rssIcon };

export interface PageData {
  title?: string;
  description?: string;
  date: Date;
  image?: string;
  timeline?: string;
}

export type BlogEntry = Entry<PageData>;

/** Nunjucks autoescape, used where the old templates interpolated into raw text (JSON-LD). */
export function njk(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const isoDate = (d: Date) => d.toISOString();
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const longDate = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

function baseSchema() {
  return raw(`<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "${njk(meta.url)}#website",
        "url": "${njk(meta.url)}",
        "name": "${njk(meta.siteName)}",
        "description": "${njk(meta.siteDescription)}",
        "inLanguage": "${njk(meta.locale)}"
      }
    ]
  }
</script>`);
}

function blogPostSchema(data: PageData) {
  // "@id" was rendered from an undefined variable, so it has always been empty.
  return raw(`<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage"
    },
    "isPartOf": {
      "@id": "${njk(meta.url)}#website"
    },
    "@id": "",
    "headline": "${njk(data.title || meta.siteName)}",
    "description": "${njk(data.description || meta.siteDescription)}",
    "image": "${njk(meta.url)}${njk(meta.opengraphDefault)}",
    "inLanguage": "${njk(meta.locale)}",
    "publisher": {
      "@type": "${njk(meta.siteType)}",
      "name": "${njk(meta.author)}",
      "url": "${njk(meta.url)}"
    },
    "author": {
      "@type": "Person",
      "name": "${njk(meta.author)}"
    },
    "datePublished": "${isoDate(data.date)}"
  }
</script>`);
}

const THEME_SCRIPT = `
      const theme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (theme === 'dark' || (!theme && prefersDark)) {
        document.documentElement.setAttribute('dark', '');
      }
    `;

const GA_SCRIPT = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${meta.analyticsId}');
    `;

export const assets = { css: "/assets/css/global.css", js: "/assets/scripts/app.js" };

function Menu() {
  const page = usePage();
  return (
    <>
      <nav id="mainnav" class="navbar menu" aria-label="Main">
        <ul>
          {navigation.map((item) => (
            <li>
              <a
                class="nav"
                href={item.url}
                aria-current={item.url === page.url ? "page" : undefined}
                data-state={item.url.length > 1 && page.url.startsWith(item.url) ? "active" : undefined}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <template id="burger-template">
        <button type="button" aria-expanded="false" aria-label="Menu" aria-controls="mainnav">
          <span>Menu</span>
        </button>
      </template>
    </>
  );
}

function Header() {
  return (
    <>
      <a href="#main" class="skip-link">
        {meta.skipContent}
      </a>
      <header class="site-head ontop" role="banner">
        <Menu />
        <div class="site-head-right">
          <nav class="navbar">
            <ul>
              <li>
                <a href="/" class="nav">
                  Ben Chadfield
                </a>
              </li>
            </ul>
          </nav>
          <div class="dark-toggle">
            <label for="toggle" class="toggle__label">
              <span class="toggle__text">Toggle Dark Mode</span>
              <input type="checkbox" name="toggle" id="toggle" class="toggle__checkbox" />
              {raw(darkModeSvg)}
            </label>
          </div>
        </div>
      </header>
    </>
  );
}

function Footer(props: { year: number }) {
  const page = usePage();
  return (
    <footer class="site-foot" role="contentinfo">
      <div class="wrapper">
        <div class="site-foot__inner">
          <nav id="footernav" class="site-foot__inner" aria-label="Footer">
            &copy; {props.year}{" "}
            <a href="/" aria-current={page.url === "/" ? "page" : undefined}>
              {meta.siteName}
            </a>
          </nav>
          <nav id="social" class="site-foot__inner" aria-label="Social links">
            {social.map((item) =>
              item.platform === "rss" ? (
                <a href={`${meta.url}${item.url}`} rel="alternate" type="application/rss+xml" target="_blank">
                  <span class="sr-only">{item.platform}</span>
                  <div aria-hidden="true">{raw(icons[item.icon])}</div>
                </a>
              ) : (
                <a href={item.url} rel="me" target="_blank">
                  <span class="sr-only">{item.platform}</span>
                  <div aria-hidden="true">{raw(icons[item.icon])}</div>
                </a>
              )
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export interface BaseProps {
  data: PageData;
  /** BlogPosting JSON-LD (posts and stories). */
  blogSchema?: boolean;
  /** Extra font preload (posts and stories). */
  preloadMono?: boolean;
  /** Copyright year: the year of the newest post, so builds don't depend on the clock. */
  year: number;
  children?: Child;
}

export function Base(props: BaseProps) {
  const page = usePage();
  const { data } = props;
  const title = data.title || meta.siteName;
  const description = data.description || meta.siteDescription;
  return (
    <>
      {raw("<!DOCTYPE html>")}
      <html lang={meta.lang}>
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>{`\n      \n      ${title}\n      \n    `}</title>
          {baseSchema()}
          {props.blogSchema && blogPostSchema(data)}
          <script>{THEME_SCRIPT}</script>
          <link rel="stylesheet" href={assets.css} />
          <link rel="preload" href="/assets/fonts/notoserif/noto-serif-normal-400.woff2" as="font" type="font/woff2" crossorigin />
          <link rel="preload" href="/assets/fonts/overpassmono/overpass-mono-normal-400.woff2" as="font" type="font/woff2" crossorigin />
          {props.preloadMono && (
            <link rel="preload" href="/assets/fonts/robotomono/robotomono-variablefont_wght-webfont.woff2" as="font" type="font/woff2" crossorigin />
          )}
          <script type="module" src={assets.js} defer></script>
          <base href={page.url} />
          <meta name="description" content={`\n  \n  ${description}\n  \n  `} />
          <meta name="theme-color" content={meta.themeColor} />
          <meta name="robots" content="index,follow" />
          <meta name="googlebot" content="index,follow" />
          <meta name="format-detection" content="telephone=no" />
          <link rel="canonical" href={`${meta.url}${page.url}`} />
          <link rel="author" href="humans.txt" />
          <meta property="og:url" content={`${meta.url}${page.url}`} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={title} />
          <meta property="og:image" content={`${meta.url}${meta.opengraphDefault}`} />
          <meta property="og:description" content={description} />
          <meta property="og:site_name" content={meta.siteName} />
          <meta property="og:locale" content={meta.locale} />
          <meta property="article:author" content={meta.author} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:dnt" content="on" />
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛸</text></svg>"
          />
          {page.mode === "build" && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${meta.analyticsId}`}></script>
              <script>{GA_SCRIPT}</script>
            </>
          )}
        </head>
        <body class="relative">
          <Header />
          <main id="main" class="relative">
            {props.children}
          </main>
          <Footer year={props.year} />
        </body>
      </html>
    </>
  );
}

function PostDate(props: { date: Date }) {
  return <time datetime={isoDate(props.date)}>{longDate(props.date)}</time>;
}

export function PageLayout(props: { entry: BlogEntry; year: number }) {
  const { entry } = props;
  return (
    <Base data={entry.data} year={props.year}>
      <article class="region">
        <div class="wrapper flow prose">
          <h1>{entry.data.title}</h1>
          {entry.body}
        </div>
      </article>
    </Base>
  );
}

export function PostLayout(props: { entry: BlogEntry; year: number }) {
  const { entry } = props;
  return (
    <Base data={entry.data} year={props.year} blogSchema preloadMono>
      <article class="region blog">
        <div class="wrapper flow">
          <img class="header" src={`/assets/images/posts/${entry.data.image}`} />
          <div class="wrapper flow prose">
            <h1>{entry.data.title}</h1>
            <PostDate date={entry.data.date} />
            {entry.body}
          </div>
        </div>
      </article>
    </Base>
  );
}

export function StoryLayout(props: { entry: BlogEntry; year: number }) {
  const { entry } = props;
  return (
    <Base data={entry.data} year={props.year} blogSchema preloadMono>
      <article class="region story">
        <div class="wrapper flow prose">
          <h1>{entry.data.title}</h1>
          <time>{entry.data.timeline}</time>
          {entry.body}
        </div>
      </article>
    </Base>
  );
}

export function HomeLayout(props: { entry: BlogEntry; year: number; posts: { entry: BlogEntry; url: string }[] }) {
  return (
    <Base data={props.entry.data} year={props.year}>
      <article class="wrapper region">
        <ul class="mt-l-xl" role="list">
          {props.posts.map(({ entry, url }) => (
            <li class="grid card" data-layout="50-50">
              <div class="card-image">
                <img src={`/assets/images/posts/${entry.data.image}`} />
              </div>
              <div class="card-content content-end">
                <h2>
                  <a href={url}>{entry.data.title}</a>
                </h2>
                <PostDate date={entry.data.date} />
                <a class="text-button" href={url}>
                  <span class="link-text">Read</span> <span class="pulse">&gt;</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </Base>
  );
}

export function DescendantsLayout(props: { entry: BlogEntry; year: number; stories: { entry: BlogEntry; url: string }[] }) {
  return (
    <Base data={props.entry.data} year={props.year}>
      <article class="wrapper region">
        <div class="prose">
          Exploring the similarities and differences of humankind over 4000 years, from 2000 years in the past to 2000 years into the future. How
          does family life, birth, death, and daily life compare in Iron Age Britain compare to modern day life? What will life be like 2000 years
          into the future?
        </div>
        <ul class="grid mt-l-xl" role="list" data-layout="50-50">
          {props.stories.map(({ entry, url }) => (
            <li class="card">
              <div class="card-content story">
                <h2>
                  <a href={url}>{entry.data.title}</a>
                </h2>
                <time>{entry.data.timeline}</time>
                <a class="text-button" href={url}>
                  <span class="link-text">Read</span> <span class="pulse">&gt;</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </Base>
  );
}
