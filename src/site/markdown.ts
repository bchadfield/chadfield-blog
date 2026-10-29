// The blog's Markdown renderer: markdown-it with the same plugins and options as before the
// move to Hotpress, so post HTML (and the Atom feed content) is unchanged.
import markdownIt from "markdown-it";
import markdownItAbbr from "markdown-it-abbr";
import markdownItAnchor from "markdown-it-anchor";
import markdownItClass from "@toycode/markdown-it-class";
import markdownItEmoji from "markdown-it-emoji";
import markdownItFootnote from "markdown-it-footnote";
import markdownItLinkAttributes from "markdown-it-link-attributes";
import markdownItMark from "markdown-it-mark";
import markdownItPrism from "markdown-it-prism";
import slugify from "slugify";

/** Converts a string to a slug (used for heading anchors). */
export const slugifyString = (str: string): string =>
  slugify(str, {
    replacement: "-",
    remove: /[#,&,+()$~%.'":*?<>{}]/g,
    lower: true
  });

const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
})
  .disable("code")
  .use(markdownItPrism, {
    defaultLanguage: "plaintext"
  })
  .use(markdownItAnchor, {
    slugify: slugifyString,
    tabIndex: false,
    permalink: markdownItAnchor.permalink.headerLink({
      class: "heading-anchor"
    })
  })
  .use(markdownItClass, {
    ol: "list",
    ul: "list"
  })
  .use(markdownItLinkAttributes, [
    {
      // match external links
      matcher(href: string) {
        return href.match(/^https?:\/\//);
      },
      attrs: {
        target: "_blank",
        rel: "noopener"
      }
    }
  ])
  .use(markdownItEmoji)
  .use(markdownItFootnote)
  .use(markdownItMark)
  .use(markdownItAbbr);

export const renderMarkdown = (source: string): string => md.render(source);
