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

const LABEL_KEYS: (keyof CategoryLabels)[] = ["label_en", "label_zh", "label_th", "label_es"];
const LOCALE_BY_KEY: Record<keyof CategoryLabels, Locale> = {
  label_en: "en",
  label_zh: "zh",
  label_th: "th",
  label_es: "es",
};

/**
 * Build all 4 labels from a single source (e.g. admin types "机车" in 中文; we translate to en/th/es).
 * Use this when the UI has only one input; sourceLocale is the current admin locale.
 */
export async function fillCategoryLabelsFromOne(
  sourceText: string,
  sourceLocale: Locale
): Promise<CategoryLabels> {
  const labels: CategoryLabels = {
    label_en: null,
    label_zh: null,
    label_th: null,
    label_es: null,
  };
  const trimmed = sourceText.trim();
  if (!trimmed) return labels;

  (labels as Record<string, string | null>)[`label_${sourceLocale}`] = trimmed;

  for (const key of LABEL_KEYS) {
    const targetLang = LOCALE_BY_KEY[key];
    if (targetLang === sourceLocale) continue;
    const translated = await translateText(trimmed, sourceLocale, targetLang);
    (labels as Record<string, string | null>)[key] = translated ?? trimmed;
  }
  return labels;
}

/**
 * Use the first non-empty locale as source and translate into the other three (overwrite).
 * When preferredLocale is set, use that as source if it has a value.
 */
export async function fillMissingCategoryLabels(
  labels: CategoryLabels,
  preferredLocale?: Locale
): Promise<void> {
  const entries: [Locale, keyof CategoryLabels][] = [
    ["en", "label_en"],
    ["zh", "label_zh"],
    ["th", "label_th"],
    ["es", "label_es"],
  ];
  let sourceLang: Locale | null = null;
  let sourceText: string | null = null;
  if (preferredLocale) {
    const key = `label_${preferredLocale}` as keyof CategoryLabels;
    const v = labels[key];
    if (v != null && v.trim() !== "") {
      sourceLang = preferredLocale;
      sourceText = v.trim();
    }
  }
  if (!sourceLang || !sourceText) {
    for (const [loc, key] of entries) {
      const v = labels[key];
      if (v != null && v.trim() !== "") {
        sourceLang = loc;
        sourceText = v.trim();
        break;
      }
    }
  }
  if (!sourceLang || !sourceText) return;

  for (const [targetLang, key] of entries) {
    if (targetLang === sourceLang) continue;
    const translated = await translateText(sourceText, sourceLang, targetLang);
    if (translated) (labels as Record<string, string | null>)[key] = translated;
  }
}
