"use server";

import manifest from "@/articles/manifest.json";
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "@/server/errors";
import parseMD from "parse-md";
import { cache } from "react";
import z from "zod";

const articleMeta = z.object({
  title: z.string(),
  summary: z.string(),
  createdAt: z.date(),
  author: z.string().catch("Ryan Hopper-Lowe"),
  draft: z.boolean().catch(false),
  ids: z.string({ coerce: true }).array().catch([]),
});

const manifestSchema = z.object({ articles: z.string().array() });

const fetchManifest = async () => {
  return manifestSchema.parse(manifest).articles;
};

const formatId = (val: string) =>
  val.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");

const parseFileContent = (filename: string, text: string) => {
  const { content, metadata } = parseMD(text);

  const { data: meta, error } = articleMeta.safeParse(metadata);

  if (error) {
    // console.error(error.flatten().fieldErrors);
    return null;
  }

  return { ...meta, id: formatId(filename), content: content };
};

const fetchFile = cache(async (fileName: string) => {
  try {
    const x = await import(`../articles/${fileName}`);

    return parseFileContent(fileName, x.default);
  } catch (e) {
    console.log(e);
  }
});

const loadArticles = cache(async () => {
  const fileNames = await fetchManifest();

  const articles = await Promise.all(fileNames.map(fetchFile));

  return articles.filter((x) => !!x);
});

const fetchArticles = async () => loadArticles();

export const getArticle = cache(async (id: string) => {
  try {
    const articles = await fetchArticles();
    const article = articles.find(
      (article) => article.id === id || article.ids.includes(id),
    );

    if (!article) throw new NotFoundError("Article not found");

    if (process.env.NODE_ENV !== "development" && article.draft)
      throw new ForbiddenError(
        "This article has not been published yet, please check back later",
      );

    return article;
  } catch (e) {
    if (e instanceof Error) throw e;
    throw new InternalServerError("Failed to read article");
  }
});

export const getArticles = cache(async () => {
  try {
    return (await fetchArticles())
      .filter((a) => process.env.NODE_ENV === "development" || !a.draft)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  } catch (e) {
    console.error(e);
    throw new InternalServerError("Failed to load Articles");
  }
});
