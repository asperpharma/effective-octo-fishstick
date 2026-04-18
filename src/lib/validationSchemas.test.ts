import {
  checkoutFormSchema,
  contactFormSchema,
  newsletterSchema,
  orderTrackingSchema,
  sanitizeInput,
  searchInputSchema,
} from "./validationSchemas";

describe("sanitizeInput", () => {
  it("strips tags, dangerous characters, and trims", () => {
    const dirty = "  <script>alert('x');</script> Hello;world  ";
    expect(sanitizeInput(dirty)).toBe("alert(x) Helloworld");
  });

  it("enforces a maximum length of 1000 characters", () => {
    const long = "a".repeat(1200);
    expect(sanitizeInput(long)).toHaveLength(1000);
  });
});

describe("contact and search validation", () => {
  it("accepts valid contact form data", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Looking for a hydrating serum.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid names", () => {
    const result = contactFormSchema.safeParse({
      name: "J",
      email: "jane@example.com",
      message: "Too short name",
    });
    expect(result.success).toBe(false);
    expect(result.success ? "" : result.error.issues[0].message).toContain("at least 2");
  });

  it("sanitizes search input during validation", () => {
    const result = searchInputSchema.safeParse('<div>retinol serum</div>');
    expect(result.success).toBe(true);
    expect(result.success ? result.data : "").toBe("retinol serum");
  });
});

describe("checkout and order tracking schemas", () => {
  it("validates a complete checkout payload", () => {
    const result = checkoutFormSchema.safeParse({
      customerName: "Amani Saleh",
      customerPhone: "0791234567",
      customerEmail: "",
      deliveryAddress: "123 Amman Street, Building 5",
      city: "Amman",
      notes: "Leave at reception",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    const result = checkoutFormSchema.safeParse({
      customerName: "Amani Saleh",
      customerPhone: "071234",
      customerEmail: "amani@example.com",
      deliveryAddress: "123 Amman Street, Building 5",
      city: "Amman",
      notes: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts well-formed order tracking queries", () => {
    const result = orderTrackingSchema.safeParse({
      orderNumber: "ORD-12345",
      token: "abc123",
    });
    expect(result.success).toBe(true);
  });
});

describe("newsletter schema", () => {
  it("validates newsletter subscriptions", () => {
    const result = newsletterSchema.safeParse({
      email: "subscriber@example.com",
    });
    expect(result.success).toBe(true);
  });
});
