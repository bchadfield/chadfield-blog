// Site-wide data (was src/_data/*.js).
export const meta = {
  url: "https://chadfield.org",
  siteName: "Problem First",
  siteDescription: "Problem First is a blog by Ben Chadfield about Product Management, Leadership, Technology, and Life.",
  siteType: "Person", // schema
  locale: "en_EN",
  lang: "en",
  skipContent: "Skip to content",
  author: "Ben Chadfield",
  authorEmail: "",
  authorWebsite: "https://chadfield.org",
  themeColor: "#DD4462",
  themeBgColor: "#F3F3F3",
  opengraphDefault: "/assets/images/opengraph-default.jpg",
  blog: {
    name: "Problem First",
    description: "Problem First is a blog by Ben Chadfield about Product Management, Leadership, Technology, and Life."
  },
  analyticsId: "G-HN8KY7L9JS"
};

export const navigation = [
  { text: "Blog", url: "/" },
  { text: "Descendants", url: "/descendants/" },
  { text: "About", url: "/about/" }
];

export const social = [
  { platform: "linkedin", url: "https://www.linkedin.com/in/benchadfield/", icon: "linkedin" },
  { platform: "github", url: "https://github.com/bchadfield", icon: "github" },
  { platform: "rss", url: "/feed.xml", icon: "rss" }
];
