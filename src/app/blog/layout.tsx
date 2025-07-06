import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ReactNode } from "react";

export default async function BlogLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-full w-full overflow-auto">
      <div className="shadow-foreground/30 bg-secondary/40 sticky top-4 z-100 mx-auto flex max-h-16 w-[90%] items-center justify-between rounded-lg px-4 shadow-sm backdrop-blur-md">
        <Link href="/">
          <h1 className="mb-0 text-2xl font-bold">Ryan Hopper-Lowe</h1>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Button variant="link" asChild>
                  <Link href="/blog">Blog</Link>
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <main className="pt-6">{children}</main>
    </div>
  );
}
