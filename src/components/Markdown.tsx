"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";

import { ReactNode } from "react";
import { Prism as Highlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { HashLink } from "@/components/HashLink";

type CodeProps = {
  className?: string;
  children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Code = ({ className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || "");

  return match && typeof children === "string" ? (
    <Highlighter PreTag="div" style={vscDarkPlus} language={match[1]}>
      {children}
    </Highlighter>
  ) : (
    <code
      className={
        className +
        " bg-foreground-200 rounded-md p-1 before:content-[''] after:content-['']"
      }
      {...props}
    >
      {children}
    </code>
  );
};

export function Markdown({ children }: { children: string }) {
  const Components: Components = {
    code({ ...props }) {
      return <Code {...props} />;
    },
    h1({ children, node }) {
      return (
        <HashLink node={node} as="h1">
          {children}
        </HashLink>
      );
    },
    h2({ children, node }) {
      return (
        <HashLink node={node} as="h2">
          {children}
        </HashLink>
      );
    },
    h3({ children, node }) {
      return (
        <HashLink node={node} as="h3">
          {children}
        </HashLink>
      );
    },
    h4({ children, node }) {
      return (
        <HashLink node={node} as="h4">
          {children}
        </HashLink>
      );
    },
    a({ children, node }) {
      return (
        <a {...node?.properties} className="text-primary transition-colors">
          {children}
        </a>
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }]]}
      components={Components}
    >
      {children}
    </ReactMarkdown>
  );
}
