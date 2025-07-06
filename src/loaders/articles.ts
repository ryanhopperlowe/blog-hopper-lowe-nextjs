import path from "path";
import fs from "fs";
import parseMD from "parse-md";
import z from "zod";
import {
  NotFoundError,
  ForbiddenError,
  InternalServerError,
} from "@/server/errors";
import { cache } from "react";

const articleMeta = z.object({
  title: z.string(),
  summary: z.string(),
  createdAt: z.date(),
  author: z.string().catch("Ryan Hopper-Lowe"),
  draft: z.boolean().catch(false),
  ids: z.string().array().catch([]),
});

export const articleSchema = articleMeta.extend({
  id: z.string(),
  content: z.string(),
});

const formatId = (val: string) =>
  val.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");

const getPath = (filename = "") =>
  path.join(path.join(path.dirname("."), "public/articles"), filename);

const loadArticles = cache(() => {
  const dir = fs.readdirSync(getPath());

  const x = dir
    .map((filename) => {
      const { content, metadata } = parseMD(
        fs.readFileSync(getPath(filename)).toString(),
      );
      const { data: meta, error } = articleMeta.safeParse(metadata);

      if (error) {
        // console.error(error.flatten().fieldErrors);
        return null;
      }

      return { ...meta, id: formatId(filename), content: content };
    })
    .filter((f) => !!f);

  return x;
});

export const getArticle = cache(async (id: string) => {
  try {
    const articles = loadArticles();
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
    return loadArticles()
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
