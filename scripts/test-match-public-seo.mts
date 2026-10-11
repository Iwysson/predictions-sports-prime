// Verifies, for every published match page, that:
//  - the Open Graph / Twitter tags belong to the page itself (never the homepage) and equal the canonical URL;
//  - nothing a crawler or a share preview can read (title, description, OG, Twitter, JSON-LD, public context)
//    contains the VIP prediction, its odds or premium analysis text;
//  - the public context of PRIME VIP pages is built only from the allowlisted sections.
// Run: npx tsx scripts/test-match-public-seo.mts
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { hasMatchPage } from "../src/lib/match-page-lifecycle.ts";
import { matchSlug } from "../src/lib/match-access.ts";
import { buildMatchPageModel } from "../src/lib/match-page-model.ts";
import { buildMatchPageMetadata } from "../src/lib/match-page-seo.ts";
import { buildPublicMatchContext, splitSections, textLeaksSelection, PUBLIC_CONTEXT_ALLOWED_HEADINGS } from "../src/lib/match-public-context.ts";
import { resolveAccess } from "../src/lib/vip.ts";
import { absoluteUrl } from "../src/lib/site-config.ts";
import type { EditorialPrediction } from "../src/types/index.ts";

function publicContextText(context: { summary: string[]; availability: { markdown: string } | null; statisticalCore: { markdown: string } | null; sources: Array<{ name: string; url: string }> } | null) {
  if (!context) return "";
  return [...context.summary, context.availability?.markdown ?? "", context.statisticalCore?.markdown ?? "", ...context.sources.map((source) => `${source.name} ${source.url}`)].join(" | ");
}

let failures = 0;
const fail = (message: string) => { failures += 1; console.log(`FAIL ${message}`); };
const pass = (message: string) => console.log(`PASS ${message}`);

const pages = (editorialPredictions as EditorialPrediction[]).filter((prediction) => hasMatchPage(prediction));
let vipPages = 0;
let withContext = 0;
let withCore = 0;
let withReportedNews = 0;
let withoutAnyContext = 0;

for (const prediction of pages) {
  const slug = matchSlug(prediction);
  const model = buildMatchPageModel(prediction, "en");
  if (!model) { fail(`${slug}: no model`); continue; }
  const canonical = absoluteUrl(`/match/${slug}/`);
  const metadata = buildMatchPageMetadata({ prediction, model, slug, locale: "en", indexable: true });
  const og = metadata.openGraph as { url?: string; title?: string; description?: string } | undefined;
  const twitter = metadata.twitter as { title?: string; description?: string } | undefined;
  const canonicalUrl = (metadata.alternates as { canonical?: string } | undefined)?.canonical;

  if (canonicalUrl !== canonical) fail(`${slug}: canonical ${canonicalUrl} != ${canonical}`);
  if (og?.url !== canonical) fail(`${slug}: og:url ${og?.url} != canonical`);
  if (og?.url === absoluteUrl("/")) fail(`${slug}: og:url is the homepage`);
  const title = typeof metadata.title === "object" && metadata.title && "absolute" in metadata.title ? (metadata.title as { absolute: string }).absolute : String(metadata.title);
  if (og?.title !== title || twitter?.title !== title) fail(`${slug}: og/twitter title differs from the page title`);
  if (!og?.description || og.description !== metadata.description || twitter?.description !== metadata.description) fail(`${slug}: og/twitter description differs from the page description`);
  if (!title.includes(prediction.homeTeam.split(" ")[0]) && !title.includes(prediction.awayTeam.split(" ")[0])) fail(`${slug}: title does not name the teams`);

  const access = resolveAccess(prediction);
  const surfaces = {
    title,
    description: String(metadata.description),
    og: JSON.stringify(metadata.openGraph),
    twitter: JSON.stringify(metadata.twitter),
    jsonLd: JSON.stringify(model.jsonLd),
    publicContext: publicContextText(model.publicContext),
  };

  if (access.prediction !== "free") {
    for (const [name, text] of Object.entries(surfaces)) {
      if (textLeaksSelection(text, prediction)) fail(`${slug}: ${name} exposes the VIP selection or price`);
    }
  }

  if (access.analysis !== "free") {
    vipPages += 1;
    // No premium analysis paragraph may travel with the public model.
    const paragraphs = (prediction.analysis ?? []).join("\n\n").split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length >= 80);
    const allowedHeadings = new Set(PUBLIC_CONTEXT_ALLOWED_HEADINGS);
    const protectedParagraphs = splitSections((prediction.analysis ?? []).join("\n\n"))
      .filter((section) => ![...allowedHeadings].some((prefix) => section.heading.toLowerCase().startsWith(prefix)))
      .flatMap((section) => section.own.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length >= 80 && !p.startsWith("|")));
    // A paragraph that sits inside a nested allowed section (the Statistical Core under "Match analysis") is public by design.
    const publicBlob = publicContextText(model.publicContext);
    for (const paragraph of protectedParagraphs) {
      const probe = paragraph.slice(0, 70);
      if (publicBlob.includes(probe)) fail(`${slug}: protected paragraph present in public context: ${probe}`);
    }
    void paragraphs;
    if (!model.gate?.showAnalysis) fail(`${slug}: VIP analysis page without a gate`);
    if (model.staticAnalysis) fail(`${slug}: VIP analysis rendered statically`);
    const context = buildPublicMatchContext(prediction);
    if (context) {
      withContext += 1;
      if (context.statisticalCore) withCore += 1;
      if (context.availability?.kind === "reported") withReportedNews += 1;
      if (context.statisticalCore && /^\s*\|\s*(?:\*\*)?over\b/im.test(context.statisticalCore.markdown)) fail(`${slug}: market row in public Core table`);
    } else {
      withoutAnyContext += 1;
    }
    const article = (model.jsonLd.find((item) => item["@type"] === "Article") ?? {}) as Record<string, unknown>;
    if (article.isAccessibleForFree !== false) fail(`${slug}: gated Article is not marked isAccessibleForFree=false`);
    if (!Array.isArray(article.hasPart)) fail(`${slug}: gated Article has no paywalled hasPart`);
  } else {
    const article = (model.jsonLd.find((item) => item["@type"] === "Article") ?? {}) as Record<string, unknown>;
    if (access.prediction === "free" && article.isAccessibleForFree !== true) fail(`${slug}: free Article is not marked isAccessibleForFree=true`);
  }
}

console.log(`pages: ${pages.length}, PRIME VIP analysis pages: ${vipPages}, with public context: ${withContext} (Core table: ${withCore}, reported team news: ${withReportedNews}), without any: ${withoutAnyContext}`);
if (failures === 0) pass(`all ${pages.length} match pages: own OG/Twitter, no VIP selection in any public surface`);
else console.log(`${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
