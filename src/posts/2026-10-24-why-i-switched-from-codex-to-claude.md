---
title: Why I switched from Codex to Claude
date: 2026-10-24
image: switching-to-claude.jpg
permalink: /work/why-i-switched-from-codex-to-claude/
---

I built Neighbourhood Finder with Codex. The backend, the web app, and the data pipelines that turn public datasets into neighbourhood reports. Around two hundred commits, almost all of them written in the evenings around a day job.

I didn't expect to switch. A tool you've built a product with has a pull. You learn its habits, where it goes wrong, and how to phrase things so it doesn't. Starting again with something else feels like a cost you don't need to pay.

Then I started working on Customer Engine.

The idea is simple. Independent trades, starting with EV charger installers, should be able to give their customers the kind of experience big national companies offer. A homeowner is guided through the job on the installer's own website and sees an indicative price and installation time, instead of filling in a basic enquiry form and waiting.

Before building the product, I needed to know whether installers wanted it. That meant a landing page and a short film showing how it works. Both had to look like something a business would trust with its customers. Not a side project.

## Testing on real work

Shortly after Opus 5.5 came out, I tried it on that work alongside Astra, OpenAI's flagship model.

It wasn't close. Opus used fewer tokens to get there, and the output was leagues ahead in polish and in the level it was working at.

Here are the two films. Same product, same brief, a week apart.

<div class="grid" data-layout="50-50" style="--grid-min-item-size: 14rem">
  <figure>
    <iframe class="youtube-embed" width="100%" src="https://player.vimeo.com/video/1239140908" title="Trade overview film made with Codex" frameborder="0" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>
    <figcaption>Codex with Astra, 27 September</figcaption>
  </figure>
  <figure>
    <iframe class="youtube-embed" width="100%" src="https://player.vimeo.com/video/1232593124" title="Trade overview film made with Claude Code" frameborder="0" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>
    <figcaption>Claude Code with Opus 5.5, 3 October</figcaption>
  </figure>
</div>

Fewer tokens matters more than it sounds. I get two or three hours on a weekday evening. A model that gets to a better result with less back and forth gives me more of those hours back.

The polish mattered more. The landing page and film were the first things installers would see. If they looked unfinished, the experiment would be testing my design skills, not whether the idea was any good.

## What changed

I haven't used Codex since.

Claude now builds the Trade product. It also does most of the work around it: researching installers, checking them against Companies House, drafting outreach, testing different ways of positioning the offer, and keeping records of what's been sent and what came back. I approve anything that goes out under my name.

That's a lot more than writing code. It's closer to having a small team that works when I do.

## Don't get attached to your tools

The lesson I took from this isn't that one model is better than another. That will change, probably soon.

It's that the tool you built your last thing with isn't automatically the right one for the next. The only way to know is to compare them on the same terms, on real work that matters to you, and be willing to act on what you see.

It's the same way I try to think about bigger decisions. Make the trade-offs visible, compare consistently, then commit. Switching cost me a little familiarity. It gave me back time and a better result, and for a side project run in the evenings, that's the trade that matters.
