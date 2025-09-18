---
title: I might be ditching React 🤯
createdAt: 2025-02-27
summary: My take on a newer framework
draft: false
ids: [4]
---

# I might be ditching React 🤯

The past year for me has been a whirlwind of learning. For the first 3.5 years of my career, all I knew was SPAs built in React. Fast forward to a year and a half ago, I was introduced to fullstack react frameworks like Next.js, then a few months later, I was introduced to Remix and I thought I had learned all there was to know. Then I found Svelte. Now a mere 2 months into my Svelte journey, I think I might be a convert.

## Why I tried Svelte

The company I work for now is a small startup run by mostly cloud developers (specializing in Go). We maintain 2 Frontends, the one I own and maintain is built in React/React-Router, and the other one was built primarily by a backend developer who hates React with every fiber of his being. Ditching any notion of a shared codebase, he went a completely different direction and built his UI in Svelte. At the time I thought this was a horrible idea. 2 Frontends in 2 different stacks sounded like a nightmare in terms of design synergy and maintenance. To be honest, I still agree with that sentiment. The only difference is now I think I'd rather switch my frontend to Svelte than the other way around.

## The problems with React

I've been working with React for over 5 years total, and I'm realizing how much I've started taking my experience for granted. Over the years, I've started becoming frustrated with the lack of proficiency in the React ecosystem, often times adding extreme safeguards to my code to prevent other developers (and myself) from breaking the logic. For a long time, I attributed that to the idea that most JavaScript developers just tend to suck at what they do. (of course, I'm not saying I'm not one of them)

I'm starting to think that React is just hard.

### What's hard about React?

The first thing that comes to mind here is the sheer amount of framework knowledge you need to have to be productive without shooting yourself in the foot. Here's a far from comprehensive list of things that I've had to learn to produce high quality, performant, and maintainable React code:

- The Component lifecycle (because you need to know why your app is rerendering)
- Rules of Hooks (because useEffect is a bitch)
- Context API (because prop drilling sucks)
- Redux (because Context API is boring)
- React Router (because no one knows how client side routing works)
- React Query (for high volume data fetching)
- Next.js or Remix (because SPAs are lame now)
- Suspense (because loading states shouldn't be managed by state...?)
- Server Components (because why learn one framework when you can learn 2?)
- React Hook Form (forms were too easy... so we made them hard)
- 100+ Component libraries (because we forgot how a button works)
- ShadCN (Because component libraries suck, but accessibility is hard) (I actually really like ShadCN)
- Imutable state
- Pure functions
- memoization

I could go on, but I think you get the point.

One thing that you might notice there is a lot of the stuff on that list arent even related to React as a framework. That's because react is difficult enough that we need to rely on external libraries to abstract away the complexity. The result of this is that you have to learn a new library for every new problem you encounter. It also creates a lot of learned helplessness in the developer community (a large reason the React pool gets such a bad rap).

I'm not saying React is a bad framework, but it's hard to justify the complexity of the framework when there are so manny other simpler frameworks.

### Problems with React Metaframeworks

I won't go into too much detail here. I have another article detailing the my problems with Next.js which you can read [here](/blog/1).

#### Problems with Next.js

- Super weird dance between client and server logic ("use server", "use client", is weird)
- SUPER annoying file based routing conventions. I'm sure I could udpate my searching process, but I always get tripped up when I search for `page` in vscode and I'm prompted with a list of 35 `page.tsx` files and I don't know which one I'm looking for.
- Default caching mechanisms were a NIGHTMARE (before Next.js 15)

I spent a while trying to figure out how to make Next.js work for me, but I just couldn't get over the mental overhead of the framework. So I switched to Remix.

#### Problems with Remix

Overall MUCH better experience than Next.js (in my humble opinion). But just not quite there in a few areas.

My biggest gripe is typesafety. They have a lot of workarounds in their API, but it's a lot of subtle typecasting that leaves a lot to be desired for a TypeScript nut like me. Also, you can only have 1 action per route, which means you have to do a lot of conditional logic to determine the "intent" of a form submission. (this gets tedious when you have pages capable of lots of different actions)

That's really it in terms of major issues with Remix/React Router as a framework. Overall I love the vision and I think it's the best option by a landslide in the React ecosystem. But let's move on to the real reason we're here.

## What's so great about Svelte?

Svelte is a framework that is built on the idea that the framework should be as simple as possible. It really shines a light on how powerful raw HTML, CSS, and JavaScript can be (something I've been extremely reluctant to learn throughout my career).

### Svelte is simple

They don't try to reinvent the wheel. They essentially took the same raw DOM apis that have ruled the web since the beginning of time, and threw in a few new concepts to make reactivity easier. The cool thing now is that with the introduction of runes in Svelte 5, the bridge from React to Svelte is actually SUPER manageable.

The fun thing about the simplicity of Svelte is that it allows it to be FAST. I haven't done anything too crazy, but I've noticed that I've never once had to worry about performance. Even when rendering huge lists of complex information, Svelte is able to keep up with just about anything I've thrown at it.

#### Performance aside, my favorite part of Svelte is the list of things I DON'T have to worry about.

Virtual DOM? Nope. Components are compiled directly to DOM nodes so any change you make has a direct impact on what the user sees.

Memoization? What's that? Component code is only run once, when the component is mounted, from there on Svelte just watches for changes in stateful variables and updates the DOM accordingly. This means that you don't have to worry about optimizing rerenders because Svelte is already doing it for you!

Immutable state? Gone! Svelte watches for changes in state so you can just mutate it directly. This is actually a much bigger win than it sounds becuase it means that you can program exactly the same way you would in any other environment. It removes a ton of mental overhead and allows you to focus on the problem instead of the framework.

Another big win is Svelte gives you global state for free! Much like signals in Solid, Svelte runes are not subject to the same tyranny as React hooks. They can exist anywhere inside or outside of a component. As a result you get free global state without having to pull in one of 300 libraries to manage it. Now you can treat your global state the exact same way you would treat component state (which is exactly how you would treat any variable in any other non-frontend environment).

At the end of the day, it just feels like you're writing JavaScript (which turns out not to be all that bad).

I think the coolest thing about this simplicity is that it allows people to become productive without having to be a senior level engineer. As I mentioned I work with mostly cloud developers, and I've seen that they are very productive in the Svelte codebase, and refuse to touch the React codebase with a 10ft pole. Keep in mind, that most of them have worked with React FAR more than they have with Svelte.

And don't even get me started on the builtin animation support! I won't go into it too much, but I've been able to create some extremely powerful, smooth animations in half the code with NO external libraries whatsoever. That alone is a game changer.

The list here goes on and on, but in the interest of time, let's get to the next thing.

### Let's talk about SvelteKit

It wouldn't be a modern discussion of JavaScript frameworks if I didn't mention the Metaframeworks. And I feel like SvelteKit is everything I love about Remix, with none of the crap I hate about React. To be fair, it does have the same gross file based routing conventions as Next.js, but I'm willing to overlook that for the joy of working with Svelte.

One thing I love about sveltekit is how much inspiration it obviously took from Remix. The api is very similar. Loaders load data and pass it to the page as props, actions handle form submissions, and you can even have multiple actions per page (a subtle but very important distinction in my opinion). Additionally, SvelteKit supports Restful api routes just like Next.js Route handlers or Remix's resource routes enabling you to build a REST API alongside your frontend.

On top of that, their compiler works wonders with typesafety between the server and client code. I've found that I am writing around 50-60% fewer types in my SvelteKit codebase than I would in any of the other frameworks I've used.

What's crazy here is that between the server side abstractions, and Svelte actions (which deserve their own article entirely), I've found myself writing wayyy fewer Components than I ever had before. It's a weird realization, that I DON'T need to abstract away so much. The bottom line is that I'm able to write some shared logic and behaviors, but the actual UI is mostly just raw HTML with a few svelty bits sprinkled in.

## Conclusion

A few years ago I would have told you React is the standard, and it always will be. Now I'm realizing it's starting to feel more comparable to the Java of the frontend world. Previously I would have given a much more modern sentiment. It's still extremely relevant and I'd imagine it will be for the next 20 years (much like Java), but I no longer think it is the best framework out there. I've only been working with Svelte for about a couple of months now, but I've found that I'm feeling more productive than I have in a long time. We'll see if it sticks, but as of right now I'm all in!
