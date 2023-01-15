module.exports = {
  url: process.env.URL || 'http://localhost:8080',
  siteName: 'Ben Chadfield Blog',
  siteDescription:
    "Ben Chadfield's blog about Product Management, Leadership, Technology, and Life.",
  siteType: 'Person', // schema
  locale: 'en_EN',
  lang: 'en',
  skipContent: 'Skip to content',
  author: 'Ben Chadfield', 
  authorEmail: '', 
  authorWebsite: 'https://chadfield.org',
  themeColor: '#DD4462', 
  themeBgColor: '#F3F3F3',
  meta_data: {
    opengraph_default: '/assets/images/opengraph-default.jpg',
    twitterSite: '', 
    twitterCreator: '', 
    mastodonProfile: '' 
  },
  blog: {
    // this is for the rss feed
    name: 'Ben Chadfield Blog',
    description:
    "Ben Chadfield's blog about Product Management, Leadership, Technology, and Life.",
  },
  pagination: {
    itemsPerPage: 20
  },
  menu: {
    closedText: 'Menu'
  }
};
