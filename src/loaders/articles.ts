import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "@/server/errors";
import { attempt } from "@ryact-utils/attempt";
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

export const articleSchema = articleMeta.extend({
  id: z.string(),
  content: z.string(),
});

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

const manifestSchema = z.object({ articles: z.string().array() });

const tryLoadArticlesFromFS = cache(
  attempt.create(async () => {
    const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";
    if (!isBuildTime) throw new Error("Build Time");

    const fs = await import("fs");
    const path = await import("path");

    const getPath = (filename = "") =>
      path.join(path.join(path.dirname("."), "public/articles"), filename);

    const dir = fs.readdirSync(getPath());

    return dir
      .map((filename) => {
        const fileText = fs.readFileSync(getPath(filename)).toString();
        return parseFileContent(filename, fileText);
      })
      .filter((f) => !!f);
  }),
);

const fetchManifest = async () => {
  if (process.env.NEXT_PUBLIC_BASE_URL === undefined) return [];

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/articles/manifest.json`,
    { cache: "force-cache" },
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();

  return manifestSchema.parse(data).articles;
};

const fetchFile = async (fileName: string) => {
  if (process.env.NEXT_PUBLIC_BASE_URL === undefined)
    throw new Error("No base url env variable");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/articles/${fileName}`,
    { cache: "force-cache" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch file: " + fileName);
  }

  return parseFileContent(fileName, await res.text());
};

const loadArticles = cache(async () => {
  const articlesFromFs = await tryLoadArticlesFromFS();

  if (articlesFromFs.ok) {
    return articlesFromFs.data;
  }

  const fileNames = await fetchManifest();

  const articles = await Promise.all(fileNames.map(fetchFile));

  return articles.filter((x) => !!x);
});

export const getArticle = cache(async (id: string) => {
  try {
    const articles = await loadArticles();
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
    return (await loadArticles())
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
