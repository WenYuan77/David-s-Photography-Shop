/**
 * Translation: DeepL (priority) and Google Cloud Translation API v2 (fallback).
 * Uses DEEPL_AUTH_KEY and/or GOOGLE_TRANSLATE_API_KEY from env. Server-side only.
 */

const LOCALES = ["en", "zh", "th", "es"] as const;
type Locale = (typeof LOCALES)[number];

const GOOGLE_LANG: Record<Locale, string> = {
  en: "en",
  zh: "zh-CN",
  th: "th",
  es: "es",
};

const DEEPL_LANG: Record<Locale, string> = {
  en: "EN",
  zh: "ZH",
  th: "TH",
  es: "ES",
};

function getDeepLBaseUrl(authKey: string): string {
  return authKey.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";
}

async function translateWithDeepL(
  text: string,
  sourceLang: Locale,
  targetLang: Locale
): Promise<string | null> {
  const key = process.env.DEEPL_AUTH_KEY?.trim();
  if (!key) return null;
  if (sourceLang === targetLang) return text;

  try {
    const base = getDeepLBaseUrl(key);
    const res = await fetch(`${base}/v2/translate`, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        source_lang: DEEPL_LANG[sourceLang],
        target_lang: DEEPL_LANG[targetLang],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.warn("[translate] DeepL error", res.status, sourceLang, "->", targetLang, body.slice(0, 200));
      return null;
    }
    const data = (await res.json()) as { translations?: { text?: string }[] };
    const translated = data?.translations?.[0]?.text ?? null;
    return translated || null;
  } catch (err) {
    console.warn("[translate] DeepL exception", sourceLang, "->", targetLang, err);
    return null;
  }
}

async function translateWithGoogle(
  text: string,
  sourceLang: Locale,
  targetLang: Locale
): Promise<string | null> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
  if (!key) {
    console.warn("[translate] skipped: GOOGLE_TRANSLATE_API_KEY not set");
    return null;
  }
  if (sourceLang === targetLang) return text;

  try {
    const url = new URL("https://translation.googleapis.com/language/translate/v2");
    url.searchParams.set("key", key);
    url.searchParams.set("q", text);
    url.searchParams.set("target", GOOGLE_LANG[targetLang]);
    url.searchParams.set("source", GOOGLE_LANG[sourceLang]);
    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) {
      console.error("[translate] Google api error", res.status, sourceLang, "->", targetLang, await res.text());
      return null;
    }
    const data = (await res.json()) as { data?: { translations?: { translatedText: string }[] } };
    const translated = data?.data?.translations?.[0]?.translatedText ?? null;
    if (translated == null) {
      console.warn("[translate] Google empty result:", sourceLang, "->", targetLang);
    }
    return translated;
  } catch (err) {
    console.error("[translate] Google error", sourceLang, "->", targetLang, err);
    return null;
  }
}

/** Try DeepL first; if it returns null, fall back to Google. */
export async function translateText(
  text: string,
  sourceLang: Locale,
  targetLang: Locale
): Promise<string | null> {
  if (sourceLang === targetLang) return text;

  const deepl = await translateWithDeepL(text, sourceLang, targetLang);
  if (deepl != null && deepl !== "") return deepl;

  return translateWithGoogle(text, sourceLang, targetLang);
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

  const delayMs = 350;
  let first = true;
  for (const key of LABEL_KEYS) {
    const targetLang = LOCALE_BY_KEY[key];
    if (targetLang === sourceLocale) continue;
    if (!first) await new Promise((r) => setTimeout(r, delayMs));
    first = false;
    const translated = await translateText(trimmed, sourceLocale, targetLang);
    // Only set when translation succeeds; otherwise leave null so we don't show source language (e.g. 活动) on Thai site
    if (translated) (labels as Record<string, string | null>)[key] = translated;
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
