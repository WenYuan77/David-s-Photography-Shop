/**
 * Google Cloud Translation API v2 (Basic) - fill missing locale labels from a source text.
 * Uses GOOGLE_TRANSLATE_API_KEY from env. Server-side only.
 */

const LOCALES = ["en", "zh", "th", "es"] as const;
type Locale = (typeof LOCALES)[number];

const GOOGLE_LANG: Record<Locale, string> = {
  en: "en",
  zh: "zh-CN",
  th: "th",
  es: "es",
};

export async function translateText(
  text: string,
  sourceLang: Locale,
  targetLang: Locale
): Promise<string | null> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
  if (!key) return null;
  if (sourceLang === targetLang) return text;

  try {
    const url = new URL("https://translation.googleapis.com/language/translate/v2");
    url.searchParams.set("key", key);
    url.searchParams.set("q", text);
    url.searchParams.set("target", GOOGLE_LANG[targetLang]);
    url.searchParams.set("source", GOOGLE_LANG[sourceLang]);
    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) {
      console.error("translate api error", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as { data?: { translations?: { translatedText: string }[] } };
    const translated = data?.data?.translations?.[0]?.translatedText ?? null;
    return translated;
  } catch (err) {
    console.error("translate error", err);
    return null;
  }
}

export type CategoryLabels = {
  label_en: string | null;
  label_zh: string | null;
  label_th: string | null;
  label_es: string | null;
};

/**
 * Use the first non-empty locale as source and translate it into the other three,
 * overwriting them so all four stay in sync (e.g. 中文 "宠物" → en/th/es get translation).
 * Modifies the object in place.
 */
export async function fillMissingCategoryLabels(labels: CategoryLabels): Promise<void> {
  const entries: [Locale, keyof CategoryLabels][] = [
    ["en", "label_en"],
    ["zh", "label_zh"],
    ["th", "label_th"],
    ["es", "label_es"],
  ];
  let sourceLang: Locale | null = null;
  let sourceText: string | null = null;
  for (const [loc, key] of entries) {
    const v = labels[key];
    if (v != null && v.trim() !== "") {
      sourceLang = loc;
      sourceText = v.trim();
      break;
    }
  }
  if (!sourceLang || !sourceText) return;

  for (const [targetLang, key] of entries) {
    if (targetLang === sourceLang) continue;
    const translated = await translateText(sourceText, sourceLang, targetLang);
    if (translated) (labels as Record<string, string | null>)[key] = translated;
  }
}
