---
author: Ryan Hopper-Lowe
title: Why I left Next.js in the dust
summary: My personal journey through the world of React metaframeworks.
createdAt: 2024-12-15
draft: false
ids: [1]
---

# Why I left Next.js in the dust

6 months ago, if you were to ask me what to use for a new project, 9 times out of 10 I would have recommended Next.js. I've been using Next both personally and professionally since the major crash of Sillicon Valley Bank in early 2023 (a story for another time). For me at the time, the concept of colocating backend and frontend code was a total game changer, and (being a huge TypeScript nut) full stack typesafety felt like a dream come true. I mostly used the Pages Router (at work) and dabbled in the App Router for most of my web-based personal projects and I have to say, I was very happy with the experience.

### So what changed?

I wanted to love the App Router (I really did), but for whatever reason, I just couldn't get there. Since the first time Dan Abramov showcased the `"use client"`/`"use server"`([link here](https://www.youtube.com/watch?v=zMf_xeGPn6s)) directives, they felt a little hacky to me. I'm not sure if it was the fact that I was used to the simplicity of the Pages Router, or the idea of having to manually manage the client/server split, but I just couldn't get used to the dance between client state and server state. This was compounded by the not-so-subtle push towards server components. If you don't specify a client component, it runs on the server. However it will be converted into a client component when imported into another client component with no errors or warnings (...????). I felt like I had to re-learn everything I had spent the past four years learning about React.

Another thing that felt off here was my familiarity with api caching libraries like `react-query` and `swr`. I've been using these libraries for years and I still think they provide the best UX/DX for managing server state on the client. I love the Stale-While-Revalidating (SWR) pattern in general (more on that in a future post), and I just couldn't replicate that experience in Next.js. If I'm being honest, the more I used it the closer I felt to finding the right patters, but it felt like there was way too much room for error and I wasn't satisfied with how much trial and error it took to find those patterns.

### Enter Remix

As usual I joined the party late with Remix, finally giving it a try in mid-2024, and right away I could tell it was what I had been looking for. I loved the simplicity of it: loaders load data and pre-render the page, actions handle mutations and retrigger loaders after completion. Everything else is is just React the way it was meant to be. The thing that mad Remix feel so right was that it comes with all of the opinions baked right into the framework. After reading the documnetation I felt like I was able to handle the most complex of problems with the simplest of solutions without having to spend hours of trial and error to get there on my own. They didn't push me towards the server by changing the rules out from under me, but they DID provide the tools and documentation to do so in a way that felt natural. The Route module is extremely powerful and they provide a ton of useful utilities to give your app the reactivity it needs while still operating exactly as you'd want it to with JavaScript disabled.

Going back to the SWR pattern, you can 100% accomplish the same effect with Remix's `useFetcher` hook. The best part is that it's built into the framework and you don't have to worry about breaking SSR or displaying loading states. (I even gave a talk about this at a Remix meetup in Austin! [link here](https://www.youtube.com/watch?v=pkcqumHpL8w))

### Conclusion

I'm not saying that Next.js is a bad framework by any means! If I were building a static website that needed some serious SEO, I would most likely still reach for it. However, applications are rarely fortunate enough to remain static, and SEO can be handled just as nicely with Remix. I'm also not saying that Remix is perfect: it leaves a lot to be desired in terms of typesafety within it's router, and I'm not a huge fan of only having 1 action per route (even if it pushes me towards better practices and logically nested routes) and having to manually differentiate the intents of different forms. That being said, the simplicity and intention behind each feature of Remix makes it a breeze to learn and an absolute joy to use. I've convinced my current employer to give it a try and we're loving every minute of it. I don't know that it will be the end-all be-all framework, but as of right now, I'm not going anywhere else.
