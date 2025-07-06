import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getArticles } from "@/loaders/articles";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | RHL",
  description: "Thoughts, opinions, and experiences of Ryan Hopper-Lowe",
};

export default async function Home() {
  const articles = await getArticles();

  return (
    <div className="flex h-full flex-wrap justify-center gap-8 p-8">
      {articles.map((article) => (
        <Link
          href={`/blog/${article.id}`}
          key={article.id}
          className="w-full lg:w-sm"
        >
          <Card className="shadow-foreground/20 active:bg-foreground/20 flex-grow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95">
            <CardHeader>
              <h3>{article.title}</h3>
            </CardHeader>

            <CardContent>
              <p>{article.summary}</p>
            </CardContent>

            <CardFooter>
              <small>{article.createdAt.toLocaleDateString()}</small>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
