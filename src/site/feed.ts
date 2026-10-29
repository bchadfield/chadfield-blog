// Feed content keeps the exact HTML the feed has always had: every URL made absolute against the
// post URL, serialised by posthtml (the same libraries eleventy-plugin-rss used).
import posthtml from "posthtml";
import urls from "@11ty/posthtml-urls";

const absolute = (url: string, base: string) => {
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
};

export async function absolutizeFeedHtml(html: string, base: string): Promise<string> {
  const result = await posthtml()
    .use(urls({ eachURL: (url: string) => absolute(url.trim(), base) }))
    .process(html, { closingSingleTag: "slash" });
  return result.html;
}
