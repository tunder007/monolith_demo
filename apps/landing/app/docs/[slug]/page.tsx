import { notFound } from "next/navigation";

import { getDoc, getManifest } from "@/lib/docs";

export function generateStaticParams() {
  return getManifest().map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  return { title: doc ? `${doc.meta.title} — Softeneers Framework` : "Not found" };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  return <article className="prose-docs" dangerouslySetInnerHTML={{ __html: doc.html }} />;
}
