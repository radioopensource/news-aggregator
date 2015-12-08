# news-aggregator

A function that scrapes a set of podcast RSS feeds for the latest mp3s. The function takes no inputs and returns a JS object that looks like this:

```
{
  npr: {
    url: "dangus.mp3",
    pubDate: "Tue, 08 Dec 2015 17:00:00 -0500"
  },
  pri: {
    url: "flerp.mp3",
    pubDate: "Mon, 07 Dec 2015 17:42:19 -0500"
  },
  bbc-global: {
    url: "blahblah.mp3",
    pubDate: "Tue, 08 Dec 2015 00:00:00 +0000"
  }
}
```

Adding another RSS feed to the function should be trivial if the RSS feed is well-formed. Otherwise, you may need to define an alternate parsing function; the NPR case is an example that uses an alternate parsing function (see 'nprApiParseFunction'), since we're making a call to their API (see 'rssParseFunction' for the default parser).

This code is hosted by the [AWS Lambda service](http://aws.amazon.com/lambda/) and is exposed via a public API endpoint. The primary client of the endpoint is [publicradio.info](https://github.com/radioopensource/dotinfo) where it serves the mp3s for the news module on the site.
