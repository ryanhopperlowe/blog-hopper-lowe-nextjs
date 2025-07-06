import { Markdown } from "@/components/Markdown";
import { getArticle } from "@/loaders/articles";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(id);

  return (
    <article className="mx-auto max-w-2xl gap-2 p-4">
      <Markdown>{article.content}</Markdown>
      <cite>
        {article.author} - {article.createdAt.toLocaleDateString()}
      </cite>
    </article>
  );
}
