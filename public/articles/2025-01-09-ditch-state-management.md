---
title: You probably never needed Zustand
summary: A look at why React state management libraries are a waste of time.
createdAt: 2025-01-09
draft: false
ids: [3]
---

# You probably never needed Zustand

TLDR;

> My main problem with libraries like Redux, and Zustand is that they often times get reached for long before the complexity rises to the point where they're needed. 95% of the time, you should be able to solve your issues with simpler methods.

For years, I used to swear by state management. Along with most of the React community, I thought of it as the silver bullet I could use to solve all of my problems. I've since changed my tune. After years of using them (Redux, Zustand, MobX, Jotai, Context API, and more), I've come to the conclusion that they're (mostly) a waste of my time as a developer.

## What is state management?

For those of you who are newer to React, state management libraries are not far off from how they sound. If you've ever used the Context API, you've already used state management. I won't go into the details of how it works, but if you're interested, you can read more about it [here](https://react.dev/reference/react/createContext).

### So why do we use state management in the first place?

First and foremost, it's super convenient. One of the most tedious parts of building with react is prop drilling, and state management gives you an easy way to drill state down to components without having to pass props through multiple levels. It's a great high. But like most drugs, it comes with a cost.

Another benefit is that it can improve performance quite a bit, by making it easier to memoize data and functions within the central store. On top of this, it provides a great place to quarantine expensive operations and and provide a single source of truth for your data.

## Why you don't need your state management library...

Anytime you introduce a new tool into your codebase, you're adding complexity. That's just the way it works. This is not always a bad thing, but you'd be hard pressed to convince me that your state management library is worth the complexity it adds.

Why do I say this?

_Because it's probably not the only state management tool in your codebase._

The thing about state management is that **everyone** uses it. Expecially the people who are building the tools you use everyday.

- Are you using `react-hook-form`? Boom, state management.
- Maybe you're using `@tanstack/react-query`? Also state management.
- How about `react-router`? Again, state management.

Let's take it up a notch... Are you using url query params? How about local storage? Cookies? Session storage?
You may not have guessed it, but these are all forms of state management.

State management is already everywhere. My question here is do you really need **MORE**?

### Let me tell you a story

At my previous company, I was on the frontend team for a Logistics based CRM.
The primary feature of this crm was the ability to effectively display and interact with a series of complex grids (each with hundreds of thousands of rows) which included server side pagination, sorting, and filtering.
Every piece of client state was managed by Zustand stores. And when I say every piece of state, I mean everything:

- api state
- form state
- auth state
- just about anything more complex than a `useState` hook.

Initially, I loved it.
The api was simple, TypeScript was good, and I was able to get some GREAT render optimizations.
As we were developing this application though, we started naturally noticing some areas for improvement...

- First, managing api state got tedious, and we found adding `@tanstack/react-query` allowed us to manage it way better while boosting performance, and cutting down on code. **So we migrated some state to `react-query`.**
- Also, we wanted a more streamlined way to perform form validation. Turns out it was simpler to just use `react-hook-form` with `yup` than a zustand store. **So we migrated some form state to `react-hook-form`.**
- Then we noticed we could cut out a lot of code by ditching our auth store and just storing our session in a cookie. **Another migration.**
- Then the brokers started complaining that they couldn't share their searches with each other, so we replaced our grid stores with query params. **You can probably see where this is going.**

Suddenly, there were wasn't a single zustand store anywhere in our codebase.

It was almost an erie feeling, but I soon realized how much healthier the code was.
What's crazy is that we had removed THOUSANDS of lines of code in the process, and our codebase was 10x easier to maintain and 100x easier to read.
The truth of the matter is that we were leaning on a single tool to manage all forms of state, often ignoring the **right tool for the job** out of convenience.
When everything was in a zustand store, the lines so easily got blurred and it became hard to discern one type of state from another.
There was truly no separation of concerns.
Not only that, but every component had access to all state at every level to the point where you couldn't trigger a single event without affecting several other parts of the app. Reusing a component at this point was a pipe dream.

If you have been in the ecosystem long enough, you'll know that the best components are the **dumbest** components, and state management libraries often provide the perfect breeding ground for extremely smart, impure, and **dangerous** components.

## The alternative

You can still use state management, but it's important to make sure it's solving a **specific** problem. Don't just bring it in because you think it'll make your life easier. Here are some examples of how you can solve **real** problems by using the right tool for the job.

### 1. Api State

Use something like `@tanstack/react-query` to manage your api state. Out of the box it will likely solve about 90% (if not all) of your global state problems. It combines the best parts of a state management library with api caching to make sure your data is always synced with the server. I can't recommend this enough.

### 2. Form State

For the most part, form state can be ignored completely if you're able to implement validation on the server. If you need client side form state, `react-hook-form` and `zod` provide a fantastic way of managing **complex** form state on the client, but I'd argue you probably don't need it every time.

### 3. Persistent State

For persistent state, I tend to mostly reach for URL query params. They're extremely easy to use, inherently accessible anywhere in your app, they persist between page loads, are navigable through browser history, and they can be saved as bookmarks and shared between users. This should be the go-to for all things filtering, sorting, pagination, and anything else that needs to be persisted.

In the case where persistent data needs to be more complex (as long as it doesn't need to be sharable between users), you can then reach for things like local storage or cookies (but I rarely have to go here).

### 4. Auth State

Just store it in a damn cookie and call it a day 🤦.

## Brass tacks

Now I understand that some problems are inherently more complex than others, and there are absolutely times where that catch-all state management library can be a godsend (Especially when render performance is a concern). Additionally, I think tools like this can drastically increase the velocity of development, and if you're goal is to get a product out the door, it can be extremely helpful.

...

...

...

BUT!!!

I also think that you should be careful about how hard you lean on it. Very few problems are actually complex enough to warrant a state management library, and the consequences can far outweigh the benefits in most codebases.
Once you add a single Redux store, you'll be amazed at how fast it begins to replicate and infect the rest of your codebase. And it's not easy to remove.

For you and me, it's probably not that big of a deal. After all, perfect 10x engineers like us know how to manage such complexity while still following best practices. The issue here is that no matter how great you may be, patterns like this do not scale to bigger teams where experience and opinions are not uniform.

Whenever you use a tool that is unopinionated in nature, you are forced to apply **your own opinions** to solve the problem. 99% of developers will not be able to intuit your thought process and continue in the same direction. Expecting them to is a bad idea.

This article isn't a smear campaign against all state management, but it is a warning to think twice before pulling in another state management library.
