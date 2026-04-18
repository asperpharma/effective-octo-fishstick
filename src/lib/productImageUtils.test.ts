import {
  formatJOD,
  formatPriceJOD,
  getPlaceholderImage,
  getProductImage,
  getSmartProductImage,
} from "./productImageUtils";

describe("placeholder and product images", () => {
  it("selects keyword-based placeholder before category fallback", () => {
    const url = getPlaceholderImage("Skin Care", "Ultra Hydration Serum");
    expect(url).toBe("https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80");
  });

  it("uses category fallback when no keyword matches", () => {
    const url = getPlaceholderImage("Makeup", "Holiday collection");
    expect(url).toBe("https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80");
  });

  it("falls back to default when category and title do not match", () => {
    const url = getPlaceholderImage("Unknown", "Mystery item");
    expect(url).toBe("https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80");
  });

  it("returns provided image when available, otherwise uses placeholder", () => {
    expect(getProductImage("https://example.com/image.jpg", "Skin Care", "Serum")).toBe("https://example.com/image.jpg");
    expect(getProductImage("   ", "Skin Care", "Serum")).toBe("https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80");
  });

  it("builds smart product image query", () => {
    const url = getSmartProductImage("Rose Oil", "Hair Care");
    expect(url).toContain(encodeURIComponent("Hair Care Rose Oil product photography"));
  });
});

describe("price formatting helpers", () => {
  it("formats JOD amounts with three decimals", () => {
    expect(formatJOD(16)).toBe("16.000 JD");
    expect(formatJOD(2.5)).toBe("2.500 JD");
  });

  it("formats legacy price style for iHerb mode", () => {
    expect(formatPriceJOD(2.434, "iherb")).toBe("JOD 2.434");
  });

  it("defaults to BeautyBox formatting when style is omitted", () => {
    expect(formatPriceJOD(3.1)).toBe("3.100 JD");
  });
});
