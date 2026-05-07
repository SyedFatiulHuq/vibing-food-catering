import type { MenuItem, MenuCategory, Weekday } from "../types";

function nf(partial: Partial<MenuItem["nutrition"]> & Pick<MenuItem["nutrition"], "calories">): MenuItem["nutrition"] {
  return {
    servingSize: partial.servingSize ?? "1 portion (estimate)",
    calories: partial.calories,
    totalFatG: partial.totalFatG ?? 0,
    saturatedFatG: partial.saturatedFatG ?? 0,
    cholesterolMg: partial.cholesterolMg ?? 0,
    sodiumMg: partial.sodiumMg ?? 0,
    totalCarbG: partial.totalCarbG ?? 0,
    dietaryFiberG: partial.dietaryFiberG ?? 0,
    totalSugarsG: partial.totalSugarsG ?? 0,
    proteinG: partial.proteinG ?? 0,
  };
}

function img(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/480`;
}

/** Price per guest for that menu selection */
function buildMenus(): Record<Weekday, MenuItem[]> {
  const m: Record<Weekday, MenuItem[]> = {
    monday: [
      {
        id: "mon-p1",
        name: "Slow Roasted Lemon Herb Chicken",
        category: "protein",
        pricePerPerson: 14.5,
        portionNote: "Per guest · carved tray",
        imageUrl: img("mon-p1"),
        description:
          "Bone-in chicken quarters roasted with lemon, garlic, and garden herbs until the skin is crisp and the meat stays juicy.",
        ingredients: [
          "Chicken",
          "Lemon",
          "Garlic",
          "Rosemary",
          "Thyme",
          "Olive oil",
          "Black pepper",
          "Kosher salt",
        ],
        nutrition: nf({
          servingSize: "1 portion (~6 oz meat)",
          calories: 420,
          totalFatG: 22,
          saturatedFatG: 6,
          cholesterolMg: 140,
          sodiumMg: 520,
          totalCarbG: 6,
          dietaryFiberG: 1,
          totalSugarsG: 1,
          proteinG: 46,
        }),
      },
      {
        id: "mon-p2",
        name: "Smoked Paprika Beef Brisket",
        category: "protein",
        pricePerPerson: 17.25,
        portionNote: "Per guest · sliced",
        imageUrl: img("mon-p2"),
        description:
          "Brisket rubbed with smoked paprika and brown sugar, braised low until fork tender with a glossy pan jus.",
        ingredients: [
          "Beef brisket",
          "Smoked paprika",
          "Brown sugar",
          "Tomato",
          "Onion",
          "Beef stock",
          "Bay leaf",
        ],
        nutrition: nf({
          calories: 510,
          totalFatG: 30,
          saturatedFatG: 11,
          cholesterolMg: 115,
          sodiumMg: 680,
          totalCarbG: 12,
          dietaryFiberG: 2,
          totalSugarsG: 6,
          proteinG: 42,
        }),
      },
      {
        id: "mon-p3",
        name: "Garlic Butter Salmon",
        category: "protein",
        pricePerPerson: 18.0,
        portionNote: "Per guest · fillet pieces",
        imageUrl: img("mon-p3"),
        description:
          "Atlantic salmon finished with brown butter, capers, and parsley — bright, savory, and party friendly.",
        ingredients: [
          "Salmon",
          "Butter",
          "Garlic",
          "Capers",
          "Parsley",
          "Lemon zest",
        ],
        nutrition: nf({
          calories: 445,
          totalFatG: 28,
          saturatedFatG: 9,
          cholesterolMg: 105,
          sodiumMg: 480,
          totalCarbG: 4,
          dietaryFiberG: 0,
          totalSugarsG: 0,
          proteinG: 40,
        }),
      },
      {
        id: "mon-p4",
        name: "Heritage Pork Carnitas",
        category: "protein",
        pricePerPerson: 15.75,
        portionNote: "Per guest · shredded",
        imageUrl: img("mon-p4"),
        description:
          "Pork shoulder cooked with citrus and warm spices until caramelized at the edges — perfect with salsa verde.",
        ingredients: [
          "Pork shoulder",
          "Orange",
          "Lime",
          "Cumin",
          "Oregano",
          "Onion",
          "Garlic",
        ],
        nutrition: nf({
          calories: 475,
          totalFatG: 26,
          saturatedFatG: 9,
          cholesterolMg: 110,
          sodiumMg: 590,
          totalCarbG: 5,
          dietaryFiberG: 1,
          totalSugarsG: 2,
          proteinG: 44,
        }),
      },
      {
        id: "mon-p5",
        name: "Tamarind Glazed Turkey Meatballs",
        category: "protein",
        pricePerPerson: 13.25,
        portionNote: "Per guest · bite-size",
        imageUrl: img("mon-p5"),
        description:
          "Lean turkey meatballs glazed with sweet-tangy tamarind and ginger — a lighter protein that still feels festive.",
        ingredients: [
          "Ground turkey",
          "Panko",
          "Egg",
          "Tamarind",
          "Ginger",
          "Soy sauce",
          "Scallions",
        ],
        nutrition: nf({
          calories: 380,
          totalFatG: 16,
          saturatedFatG: 4,
          cholesterolMg: 125,
          sodiumMg: 720,
          totalCarbG: 22,
          dietaryFiberG: 1,
          totalSugarsG: 12,
          proteinG: 36,
        }),
      },
      {
        id: "mon-v1",
        name: "Roasted Vegetable Lasagna",
        category: "vegetarian",
        pricePerPerson: 12.5,
        portionNote: "Per guest · square cut",
        imageUrl: img("mon-v1"),
        description:
          "Layers of roasted zucchini, ricotta, marinara, and mozzarella baked until bubbling with a golden top.",
        ingredients: [
          "Lasagna sheets",
          "Zucchini",
          "Bell pepper",
          "Ricotta",
          "Mozzarella",
          "Marinara",
          "Parmesan",
        ],
        nutrition: nf({
          calories: 410,
          totalFatG: 18,
          saturatedFatG: 9,
          cholesterolMg: 55,
          sodiumMg: 760,
          totalCarbG: 44,
          dietaryFiberG: 5,
          totalSugarsG: 9,
          proteinG: 18,
        }),
      },
      {
        id: "mon-v2",
        name: "Chickpea & Spinach Curry",
        category: "vegetarian",
        pricePerPerson: 11.25,
        portionNote: "Per guest · bowl",
        imageUrl: img("mon-v2"),
        description:
          "Creamy coconut curry with chickpeas, spinach, and warm spices — vegan friendly if ordered without dairy finishing.",
        ingredients: [
          "Chickpeas",
          "Spinach",
          "Coconut milk",
          "Tomato",
          "Garam masala",
          "Ginger",
          "Garlic",
        ],
        nutrition: nf({
          calories: 360,
          totalFatG: 18,
          saturatedFatG: 12,
          cholesterolMg: 0,
          sodiumMg: 640,
          totalCarbG: 38,
          dietaryFiberG: 9,
          totalSugarsG: 6,
          proteinG: 12,
        }),
      },
      {
        id: "mon-v3",
        name: "Grilled Halloumi & Quinoa Bowl",
        category: "vegetarian",
        pricePerPerson: 13.0,
        portionNote: "Per guest · composed plate",
        imageUrl: img("mon-v3"),
        description:
          "Grilled halloumi over lemon quinoa with cucumber, herbs, and a bright yogurt drizzle.",
        ingredients: [
          "Halloumi",
          "Quinoa",
          "Cucumber",
          "Mint",
          "Lemon",
          "Olive oil",
          "Greek yogurt",
        ],
        nutrition: nf({
          calories: 430,
          totalFatG: 22,
          saturatedFatG: 12,
          cholesterolMg: 45,
          sodiumMg: 820,
          totalCarbG: 36,
          dietaryFiberG: 4,
          totalSugarsG: 4,
          proteinG: 22,
        }),
      },
      {
        id: "mon-s1",
        name: "Charred Broccoli with Almonds",
        category: "sides",
        pricePerPerson: 5.5,
        portionNote: "Per guest · side",
        imageUrl: img("mon-s1"),
        description:
          "High-heat roasted broccoli finished with lemon, chili flakes, and toasted almonds.",
        ingredients: ["Broccoli", "Almonds", "Lemon", "Chili flake", "Olive oil"],
        nutrition: nf({
          calories: 160,
          totalFatG: 11,
          saturatedFatG: 1,
          cholesterolMg: 0,
          sodiumMg: 220,
          totalCarbG: 12,
          dietaryFiberG: 5,
          totalSugarsG: 3,
          proteinG: 6,
        }),
      },
      {
        id: "mon-s2",
        name: "Buttermilk Cornbread Muffins",
        category: "sides",
        pricePerPerson: 4.25,
        portionNote: "Per guest · 1 muffin",
        imageUrl: img("mon-s2"),
        description:
          "Tender muffins with a hint of honey — easy to serve and easy to love.",
        ingredients: ["Cornmeal", "Flour", "Buttermilk", "Egg", "Honey", "Butter"],
        nutrition: nf({
          calories: 240,
          totalFatG: 9,
          saturatedFatG: 4,
          cholesterolMg: 45,
          sodiumMg: 320,
          totalCarbG: 34,
          dietaryFiberG: 2,
          totalSugarsG: 10,
          proteinG: 5,
        }),
      },
    ],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  // Tuesday — fill programmatically from templates to save space
  const dayTemplates: Record<
    Exclude<Weekday, "monday">,
    { proteins: string[]; veg: string[]; sides: string[] }
  > = {
    tuesday: {
      proteins: [
        "Miso Ginger Glazed Chicken Thighs",
        "Coffee Rubbed Flank Steak",
        "Coconut Lime Shrimp Skewers",
        "Apple Cider Braised Pork",
        "Za’atar Spiced Lamb Kofta",
      ],
      veg: [
        "Wild Mushroom Risotto (veg)",
        "Stuffed Bell Peppers with Farro",
        "Crispy Tofu with Sesame Broccoli",
      ],
      sides: ["Roasted Rainbow Carrots", "Herbed Couscous Pilaf"],
    },
    wednesday: {
      proteins: [
        "Peri Peri Roasted Chicken",
        "Maple Chipotle Ribs",
        "Herb Crusted Cod",
        "Chorizo & Kidney Bean Chili (contains meat)",
        "Teriyaki Glazed Meatballs",
      ],
      veg: [
        "Eggplant Parmesan",
        "Lentil Shepherd’s Pie",
        "Caprese Orzo Salad",
      ],
      sides: ["Garlic Green Beans", "Classic Mac & Cheese"],
    },
    thursday: {
      proteins: [
        "Buttermilk Fried Chicken Tenders",
        "Red Wine Pot Roast",
        "Citrus Jalapeño Shrimp",
        "BBQ Pulled Chicken",
        "Blackened Catfish Bites",
      ],
      veg: [
        "Spinach & Ricotta Stuffed Shells",
        "Thai Peanut Noodle Bowl (veg)",
        "Roasted Beet & Goat Cheese Tart",
      ],
      sides: ["Potato Salad with Dill", "Corn on the Cob with Lime Butter"],
    },
    friday: {
      proteins: [
        "Garlic Prime Rib Slices",
        "Honey Sriracha Wings",
        "Lemon Caper Tilapia",
        "Smoky Pulled Pork",
        "Adobo Marinated Steak Tips",
      ],
      veg: [
        "Truffle Mushroom Flatbread (veg)",
        "Black Bean Enchilada Bake",
        "Mediterranean Falafel Platter",
      ],
      sides: ["Caesar Salad Kit", "Seasoned Rice Pilaf"],
    },
    saturday: {
      proteins: [
        "Sunday Supper Roast Chicken",
        "Spiced Beef Kebabs",
        "Garlic Shrimp Scampi",
        "Apple Mustard Pork Loin",
        "Buffalo Cauliflower “Wings” & Chicken Duo",
      ],
      veg: [
        "Four Cheese Baked Ziti (veg)",
        "Sweet Potato & Kale Gratin",
        "Summer Squash Ratatouille",
      ],
      sides: ["Watermelon Feta Mint Salad", "Cheesy Jalapeño Corn Bake"],
    },
    sunday: {
      proteins: [
        "Orange Marmalade Ham Slices",
        "Rosemary Garlic Lamb Chops",
        "Pan Seared Salmon with Dill Cream",
        "Chicken Tikka Skewers",
        "Tex Mex Beef Barbacoa",
      ],
      veg: [
        "Pumpkin Sage Ravioli",
        "Vegetable Pot Pie",
        "Pear Walnut Blue Cheese Salad (veg)",
      ],
      sides: ["Honey Roasted Sweet Potatoes", "Buttered Dinner Rolls"],
    },
  };

  (Object.keys(dayTemplates) as Exclude<Weekday, "monday">[]).forEach((day) => {
    const t = dayTemplates[day];
    const prefix = day.slice(0, 3);
    const proteins = t.proteins.map((name, i) =>
      makeProtein(`${prefix}-p${i + 1}`, name, 13.5 + i * 0.75),
    );
    const veg = t.veg.map((name, i) =>
      makeVeg(`${prefix}-v${i + 1}`, name, 11 + i * 0.5),
    );
    const sides = t.sides.map((name, i) =>
      makeSide(`${prefix}-s${i + 1}`, name, 4.5 + i * 0.75),
    );
    m[day] = [...proteins, ...veg, ...sides];
  });

  return m;
}

function makeProtein(id: string, name: string, price: number): MenuItem {
  return {
    id,
    name,
    category: "protein",
    pricePerPerson: Math.round(price * 100) / 100,
    portionNote: "Per guest · catering portion",
    imageUrl: img(id),
    description: `${name} — prepared fresh for your pickup window. Classic seasoning, balanced richness, and crowd-friendly plating.`,
    ingredients: ["House spice blend", "Fresh herbs", "Quality proteins", "Seasonal aromatics"],
    nutrition: nf({
      calories: 430 + id.length * 3,
      totalFatG: 22,
      saturatedFatG: 7,
      cholesterolMg: 95,
      sodiumMg: 560,
      totalCarbG: 8,
      dietaryFiberG: 1,
      totalSugarsG: 3,
      proteinG: 40,
    }),
  };
}

function makeVeg(id: string, name: string, price: number): MenuItem {
  return {
    id,
    name,
    category: "vegetarian",
    pricePerPerson: Math.round(price * 100) / 100,
    portionNote: "Per guest · vegetarian",
    imageUrl: img(id),
    description: `${name} — hearty vegetarian option with layered flavors and satisfying texture.`,
    ingredients: ["Seasonal vegetables", "Herbs", "Olive oil", "House sauces"],
    nutrition: nf({
      calories: 380,
      totalFatG: 16,
      saturatedFatG: 6,
      cholesterolMg: 25,
      sodiumMg: 620,
      totalCarbG: 42,
      dietaryFiberG: 7,
      totalSugarsG: 8,
      proteinG: 14,
    }),
  };
}

function makeSide(id: string, name: string, price: number): MenuItem {
  return {
    id,
    name,
    category: "sides",
    pricePerPerson: Math.round(price * 100) / 100,
    portionNote: "Per guest · side",
    imageUrl: img(id),
    description: `${name} — the perfect complement to your mains.`,
    ingredients: ["Farm staples", "Butter or olive oil", "Seasonal accents"],
    nutrition: nf({
      calories: 210,
      totalFatG: 10,
      saturatedFatG: 3,
      cholesterolMg: 15,
      sodiumMg: 340,
      totalCarbG: 26,
      dietaryFiberG: 3,
      totalSugarsG: 5,
      proteinG: 5,
    }),
  };
}

/** Human-readable category names (semantics / screen readers) */
export const MENU_CATEGORY_LABEL: Record<MenuCategory, string> = {
  protein: "Protein",
  vegetarian: "Vegetarian",
  sides: "Sides",
};

const menusByWeekday: Record<Weekday, MenuItem[]> = buildMenus();

const byId = new Map<string, MenuItem>();
for (const items of Object.values(menusByWeekday)) {
  for (const it of items) byId.set(it.id, it);
}

export function getMenuForWeekday(w: Weekday): MenuItem[] {
  return menusByWeekday[w];
}

export function getItemById(id: string): MenuItem | undefined {
  return byId.get(id);
}
