/**
 * Preview catalogue used before the live product records load.
 * Titles, prices and imagery here are clearly replaceable samples —
 * they are editable and deletable from the admin dashboard.
 */
export const SAMPLE_PRODUCTS = [
  {
    id: "sample-french",
    name: "Milky French",
    slug: "milky-french",
    description:
      "Soft milky tips on a sheer nude base — the quiet classic that suits every occasion.",
    price: 3200,
    category: "French",
    image: "/assets/products/blue-lemon-set.jpg",
    shapes: ["Almond", "Square", "Oval"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "sample-minimal",
    name: "Gold Line Minimal",
    slug: "gold-line-minimal",
    description:
      "Sheer nude squares traced with a single champagne gold line. Barely there, entirely intentional.",
    price: 2800,
    category: "Minimalist",
    image: "/assets/products/pop-girls-set.jpg",
    shapes: ["Square", "Oval"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "sample-royal",
    name: "Royal Crescent",
    slug: "royal-crescent",
    description:
      "Deep royal blue with delicate gold crescents and fine foil veins on a medium almond.",
    price: 3600,
    category: "Elegant",
    image: "/assets/products/anime-star-set.jpg",
    shapes: ["Almond", "Coffin", "Oval"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "sample-champagne",
    name: "Champagne Glam",
    slug: "champagne-glam",
    description:
      "Glittered champagne ombré with hand-set crystals and metallic detailing for the evenings that deserve it.",
    price: 4200,
    category: "Glam",
    image: "/assets/products/gem-stiletto-set.jpg",
    shapes: ["Coffin", "Stiletto", "Almond"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "sample-everyday",
    name: "Soft Everyday",
    slug: "soft-everyday",
    description:
      "Short rounded nails in a milky rose nude — light, glossy and comfortable from morning to night.",
    price: 2500,
    category: "Everyday",
    image: "/assets/products/bee-rabbit-set.jpg",
    shapes: ["Oval", "Square"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "sample-marble",
    name: "Lavender Marble",
    slug: "lavender-marble",
    description:
      "A custom marble of lavender and cream with gold leaf flakes and one royal blue accent nail.",
    price: 3900,
    category: "Custom",
    image: "/assets/products/other-one-set.jpg",
    shapes: ["Almond", "Coffin", "Square", "Oval", "Stiletto"],
    sizes: ["XS", "S", "M", "L"],
  },
];

export const COLLECTIONS = [
  {
    name: "French",
    slug: "French",
    description: "Timeless tips, reimagined in soft milky tones.",
  },
  {
    name: "Minimalist",
    slug: "Minimalist",
    description: "Barely-there finishes with a single precious detail.",
  },
  {
    name: "Elegant",
    slug: "Elegant",
    description: "Sculpted almond shapes in deep, jewel-toned polish.",
  },
  {
    name: "Glam",
    slug: "Glam",
    description: "Champagne glitter, crystals and metallic shine.",
  },
  {
    name: "Everyday",
    slug: "Everyday",
    description: "Short, glossy and made for every day of the week.",
  },
  {
    name: "Custom",
    slug: "Custom",
    description: "Your own composition, drawn from your inspiration.",
  },
];