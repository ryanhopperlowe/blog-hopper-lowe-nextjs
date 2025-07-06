---
title: You're using useRef wrong
createdAt: 2024-12-18
summary: Some fun facts about the useRef hook in React.
draft: false
ids: [2]
---

# You're using useRef wrong!

## Introduction

With the upcoming release of the [React compiler](https://react.dev/learn/react-compiler), the React team released a new set of linter rules that must be satisfied in order for it to work.
As someone who absolutely HATES the monotonous task of memoization and render optimization, I was very excited to start the process.
We've been pretty strict at following the [rules of react](https://react.dev/reference/rules) hooks, so there weren't too many issues to fix.
We weren't perfect though, and I noticed 2 common errors that would break the compiler:

1. There were several instances where we had disabled the `exhaustive-deps` rule. (born purely out of laziness, and time constraints)
2. (A bit more shockingly) There were a slew of red squiggles related to the `useRef` hook.

Now I pride myself on being pretty knowledgeable about the [rules of react](https://react.dev/reference/rules) (even if I don't always follow them), so initially I was a bit confused. That confusion, however led me to do some soul searching and allowed me to completely rethink the way I used refs in my code!

## Let's start with the basics

### What is `useRef` ([docs here](https://react.dev/reference/react/useRef))?

`useRef` essentially provides a component with a way to store a value that is not used for rendering.
This exempts it from some rules related to dependencies and memoization, but it also comes with some caveats.

### The Caveat: do not use a ref value during rendering.

Most tutorials will tell you not to do this:

```tsx
const Component = () => {
  const ref = useRef("some value"); // ref is assigned
  ...
  return <div>{ref.current}</div>; // access ref.current during rendering (no-no)
};
```

and this would make sense! Since `ref` is not used for rendering, it won't trigger a re-render when the `.current` property is changed.

**This is where most tutorials stop**.

Going a bit deeper, a common misconception is that "rendering" only happens anywhere there is JSX. That's not true! Here's another example of accessing a ref during rendering:

```tsx
const Component = () => {
  const ref = useRef(10);

  const doubled = ref.current * 2; // also bad!

  return <div>{doubled}</div>;
};
```

and here's another

```tsx
const Component = () => {
  const ref = useRef(10);

  useHookThatUsesRefValue(ref.current); // sorry, still BAD!

  return <div>No Ref here!</div>;
};
```

And here's the one I see the most (usually in my own code):

```tsx
const Component = () => {
  const ref = useRef<HTMLElement | null>(null);

  return (
    <>
      <div ref={ref}>My Anchor Element</div>

      <SomeDialogComponent
        anchorElement={ref.current} // BAD!
      />
    </>
  );
};
```

Now I know what you're thinking...

**"How the hell do I get my ref value into my custom component without breaking the compiler??"**

Well you've got a couple of options, but here's the one that's worked best for me:

### The Solution: You might not need a ref 🤯

Refs are great for storing values outside of rendering... but the second you pass the `current` value as a prop to a component, you're inherently telling React that the value IS used for rendering. This is because React uses the props of a component to determine if it should re-render (the same reason why refs can't be used in dependency arrays).

**"Ok so how do I store the node for an HTMLElement?" (I asked myself this too)**

#### The answer? Ref Init functions!

Did you know you can pass a function to a component's `ref` prop? I didn't until recently, and it's a game changer. Take this code for example:

```tsx
const Component = () => {
  const ref = useRef<HTMLElement | null>(null);

  return (
    <div
      ref={(node) => {
        ref.current = node;
      }}
    />
  );
};
```

beleive it or not, this is actually what React is doing under the hood when you pass a ref to a component!

So now when we want to store the node and pass it to ANOTHER component, we can just replace `useRef` with `useState` and an init function!

```tsx
const Component = () => {
  // because we're using a state, we can use this anywhere in our component where rendering is happening
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  useHookThatUsesRefValue(anchorElement); // this is fine because it's a state value

  useEffect(() => {
    console.log(anchorElement);
  }, [anchorElement]); // this value can now be used as a dependency

  return <>
      <div ref={(node) => {
          setAnchorElement(node);
        }}
      >
        My Anchor Element
      </div>

      <SomeDialogComponent
        anchorElement={anchorElement} // this is also fine now!
      />
    </>
  );
};
```

This is a much more flexible solution, and now your component can be optimized by the compiler!

**"But what if I still need to access the ref value from `useEffect` without passing it as a dependency?"**

Sometimes we need to access a value in `useEffect` without passing it as a dependency. This is where useRef can still be handy. But that's also why init functions are so great!

```tsx
const Component = () => {
  // state variable to be used during rendering
  const [anchorElement, _setAnchorElement] = useState<HTMLElement | null>(null);

  // ref to be used outside of rendering
  const anchorRef = useRef<HTMLElement | null>(null);

  const setAnchorElement = useCallback((node: HTMLElement | null) => {
    // we can set both the state and ref and pass this function to the div's ref prop
    _setAnchorElement(node);
    anchorRef.current = node;
  }, []);


  return <>
      <div ref={setAnchorElement}>My Anchor Element</div>

      <SomeDialogComponent
        anchorElement={anchorElement} // this is also fine now!
      />
    </>
  );
};
```

As you can see, we now get the best of both worlds! We can use the ref value in `useEffect` without passing it as a dependency, and we can also use the state value in any part of our component where rendering occurs.

## Conclusion

Refs are great for storing values outside of rendering, but they can be tricky to use correctly.
By using init functions and state, we can create a more flexible and optimized solution that satisfies the compiler's rules.

I hope this helps you understand how to use refs more effectively in your React code. Happy Compiling!
