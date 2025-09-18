declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Todo = any;
}

declare module "*.md" {
  const content: string;
  export default content;
}

export {};
