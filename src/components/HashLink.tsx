"use client";

import Link from "next/link";
import { useHash } from "@/hooks/use-hash";
import { ReactNode, useEffect, useRef } from "react";
import { ExtraProps } from "react-markdown";
import { usePathname, useRouter } from "next/navigation";

type Element = NonNullable<ExtraProps["node"]>;

type HashLinkProps = {
  node?: Element;
  children: ReactNode;
  as: keyof React.JSX.IntrinsicElements;
};

export function HashLink({ node, children, as: Comp }: HashLinkProps) {
  const hash = useHash();
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const id = node?.children[0]?.type === "text" ? node.children[0].value : "";

  useEffect(() => {
    if (hash && decodeURIComponent(hash) === "#" + id) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [id, hash]);

  return id ? (
    <Link
      id={id}
      href={`#${id}`}
      replace
      ref={ref}
      onClick={(e) => {
        e.preventDefault();

        if (Comp === "h1") {
          router.replace(pathname, { scroll: true });
          return;
        }

        ref.current?.scrollIntoView({ behavior: "smooth" });

        history.pushState(null, "", `#${id}`);
      }}
    >
      <Comp className="text-foreground-700 decoration-foreground-400 flex items-start gap-2 underline-offset-8 hover:underline">
        {Comp !== "h1" && "#"} {children}
      </Comp>
    </Link>
  ) : (
    <>{children}</>
  );
}
