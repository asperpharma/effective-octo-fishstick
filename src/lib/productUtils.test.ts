import {
  extractKeyBenefits,
  getLocalizedCategory,
  getLocalizedDescription,
  getProductCategory,
  summarizeDescription,
  translateTitle,
} from "./productUtils";

describe("summarizeDescription", () => {
  it("removes html and keeps first meaningful sentences", () => {
    const text = "<p>Glow serum!</p> Provides intense hydration. Smooth finish.";
    expect(summarizeDescription(text)).toBe("Glow serum. Provides intense hydration");
  });

  it("truncates long summaries and adds ellipsis", () => {
    const long = "Nourishing cream with vitamins. ".repeat(10);
    const result = summarizeDescription(long, 60);
    expect(result.length).toBeLessThanOrEqual(60);
    expect(result.endsWith("...")).toBe(true);
  });
});

describe("translateTitle and localization helpers", () => {
  it("returns original title for English", () => {
    expect(translateTitle("Vichy Liftactiv", "en")).toBe("Vichy Liftactiv");
  });

  it("translates title to Arabic when requested", () => {
    expect(translateTitle("Vichy lipstick", "ar")).toContain("فيشي");
    expect(translateTitle("Vichy lipstick", "ar")).toContain("أحمر شفاه");
  });

  it("localizes description and applies Arabic translation", () => {
    const description = "<p>Hydrating day cream with SPF.</p>";
    const localized = getLocalizedDescription(description, "ar", 80);
    expect(localized).toMatch(/[\u0600-\u06FF]/);
    expect(localized).toContain("حماية");
    expect(localized.length).toBeLessThanOrEqual(80);
  });

  it("localizes categories with known translations or falls back to Arabic conversion", () => {
    expect(getLocalizedCategory("Skin Care", "ar")).toBe("العناية بالبشرة");
    expect(getLocalizedCategory("Bright Glow", "ar")).toContain("مشرق");
  });
});

describe("extractKeyBenefits", () => {
  it("extracts up to four ordered English benefits", () => {
    const text = "A hydrating, anti-aging serum with SPF 50 that nourishes and soothes skin.";
    const benefits = extractKeyBenefits(text, "en");
    expect(benefits).toEqual([
      "Deep Hydration",
      "Anti-Aging",
      "Sun Protection",
      "Nourishing",
    ]);
  });

  it("returns Arabic benefits when requested", () => {
    const text = "Hydrating brightening lotion with SPF for sensitive skin.";
    const benefits = extractKeyBenefits(text, "ar");
    expect(benefits).toEqual([
      "ترطيب عميق",
      "تفتيح",
      "حماية من الشمس",
      "تركيبة لطيفة",
    ]);
  });
});

describe("getProductCategory", () => {
  it("prefers product type then vendor then default", () => {
    expect(getProductCategory("Serum", "Vichy")).toBe("Serum");
    expect(getProductCategory(undefined, "Vichy")).toBe("Vichy");
    expect(getProductCategory(undefined, undefined)).toBe("Beauty");
  });
});
