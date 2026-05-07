import type { FoodCategory, FoodItem, NutritionFacts } from "../types";

function nf(
  partial: Partial<NutritionFacts> &
    Pick<NutritionFacts, "servingSize" | "calories" | "proteinG">,
): NutritionFacts {
  return {
    totalFatG: 0,
    saturatedFatG: 0,
    transFatG: 0,
    cholesterolMg: 0,
    sodiumMg: 0,
    totalCarbG: 0,
    dietaryFiberG: 0,
    totalSugarsG: 0,
    ...partial,
  };
}

type DaySeed = {
  key: string;
  label: string;
  proteins: [string, string, number][];
  vegetables: [string, string, number][];
  sides: [string, string, number][];
};

const days: DaySeed[] = [
  {
    key: "sun",
    label: "Sunday",
    proteins: [
      [
        "Heritage roast chicken",
        "Free-range chicken; lemon; rosemary; garlic; olive oil; black pepper; sea salt",
        4200,
      ],
      [
        "Smoked paprika beef brisket",
        "Beef brisket; smoked paprika; brown sugar; tomato; onion; apple cider vinegar",
        5600,
      ],
      [
        "Cider-braised pork shoulder",
        "Pork shoulder; apple cider; thyme; bay; onion; carrot",
        4800,
      ],
      [
        "Wild mushroom turkey meatballs",
        "Ground turkey; shiitake; cremini; parsley; egg; oats; parmesan",
        3800,
      ],
      [
        "Coconut fish stew",
        "Cod; coconut milk; ginger; lime leaf; bell pepper; cilantro",
        4400,
      ],
    ],
    vegetables: [
      [
        "Roasted root vegetable medley",
        "Beets; carrots; parsnips; maple; thyme; olive oil",
        2200,
      ],
      [
        "Stuffed bell peppers (rice and herb)",
        "Bell peppers; jasmine rice; mint; dill; lemon; pine nuts",
        2600,
      ],
      ["Eggplant caponata", "Eggplant; celery; capers; olives; tomato; red wine vinegar", 2400],
    ],
    sides: [
      ["Buttermilk cornbread", "Cornmeal; buttermilk; butter; honey; baking powder", 900],
      ["Garlic green beans", "Green beans; garlic; olive oil; toasted almonds", 800],
    ],
  },
  {
    key: "mon",
    label: "Monday",
    proteins: [
      ["Maple mustard salmon", "Atlantic salmon; maple; grain mustard; dill; lemon", 5200],
      ["Herb-crusted chicken thighs", "Chicken thighs; parsley; sage; panko; dijon", 3900],
      ["Slow-simmered beef ragu", "Beef chuck; tomato; red wine; mirepoix; bay", 5100],
      [
        "Coconut chickpea and spinach curry (may contain traces of dairy in some batches)",
        "Chickpeas; spinach; coconut milk; madras curry; onion",
        3400,
      ],
      ["Lemon oregano lamb skewers", "Lamb leg; lemon; oregano; yogurt marinade; sumac", 5800],
    ],
    vegetables: [
      ["Charred broccoli with tahini", "Broccoli; tahini; lemon; garlic; sesame seeds", 2300],
      ["Wild rice and roasted squash", "Wild rice; butternut squash; sage; pepitas", 2500],
      ["Greek salad slab", "Cucumber; tomato; feta; kalamata; red onion; oregano", 2100],
    ],
    sides: [
      ["Rosemary focaccia", "Bread flour; rosemary; olive oil; sea salt", 950],
      [
        "Citrus fennel slaw",
        "Fennel; navel orange; mint; olive oil; white wine vinegar",
        850,
      ],
    ],
  },
  {
    key: "tue",
    label: "Tuesday",
    proteins: [
      ["Chipotle lime chicken", "Chicken breast; chipotle; lime; honey; cumin", 4000],
      ["Miso glazed cod", "Cod; white miso; mirin; scallion; sesame", 5400],
      ["Classic meatloaf (beef and pork)", "Ground beef; ground pork; breadcrumb; ketchup glaze; thyme", 3700],
      ["Shrimp etouffee", "Shrimp; butter; celery; bell pepper; creole spice; stock", 5500],
      ["Mushroom lentil loaf", "Brown lentils; cremini; walnut; tomato glaze; oats", 3200],
    ],
    vegetables: [
      ["Ratatouille bake", "Zucchini; eggplant; tomato; bell pepper; basil; olive oil", 2400],
      ["Creamy polenta (vegetarian)", "Polenta; parmesan; butter; black pepper", 2000],
      ["Kale caesar (dressing without anchovy)", "Kale; parmesan; lemon; garlic; crushed croutons", 2200],
    ],
    sides: [
      ["Jasmine rice pilaf", "Jasmine rice; shallot; parsley; vegetable stock", 700],
      ["Pickled cucumber ribbons", "Cucumber; rice vinegar; sugar; dill", 600],
    ],
  },
  {
    key: "wed",
    label: "Wednesday",
    proteins: [
      ["Peri-peri chicken quarters", "Chicken; peri-peri marinade; smoked paprika; garlic", 4100],
      ["Heritage pork tenderloin", "Pork tenderloin; apple; mustard seed; sage", 4900],
      [
        "Beef short rib bourguignon",
        "Beef short rib; red wine; pearl onion; mushroom; carrot",
        6200,
      ],
      [
        "Turkey and white bean chili",
        "Ground turkey; cannellini beans; green chile; cumin; oregano",
        3600,
      ],
      ["Tofu peanut satay", "Baked tofu; peanut sauce; coconut; lime; cilantro", 3100],
    ],
    vegetables: [
      [
        "Chimichurri cauliflower steaks",
        "Cauliflower; parsley; oregano; garlic; red wine vinegar",
        2600,
      ],
      [
        "Spinach and ricotta stuffed shells",
        "Pasta shells; spinach; ricotta; marinara; mozzarella",
        2800,
      ],
      ["Roasted beet and citrus salad", "Beets; arugula; orange; goat cheese; pistachio", 2400],
    ],
    sides: [
      ["Sourdough dinner rolls", "Sourdough starter; bread flour; butter; flaky salt", 880],
      ["Herbed potato salad", "Yukon gold; chive; dill; greek yogurt; celery", 920],
    ],
  },
  {
    key: "thu",
    label: "Thursday",
    proteins: [
      ["Harissa honey chicken", "Chicken; harissa; honey; yogurt; preserved lemon", 4200],
      ["Salmon pinwheels (with spinach feta)", "Salmon; spinach; feta; lemon zest; dill", 5600],
      ["Red wine pot roast", "Chuck roast; red wine; mirepoix; tomato paste; thyme", 5900],
      ["Turkey meatball marsala", "Turkey; marsala wine; mushroom; shallot; cream", 4000],
      ["Crispy tempeh bowls base", "Tempeh; tamari; maple; ginger; garlic", 3300],
    ],
    vegetables: [
      [
        "Balsamic grilled vegetable platter",
        "Zucchini; bell pepper; red onion; balsamic; basil",
        2300,
      ],
      ["Mac and cheese (three cheese)", "Cavatappi; cheddar; gruyere; parmesan; cream", 2700],
      ["Asparagus with preserved lemon", "Asparagus; preserved lemon; olive oil; mint", 2500],
    ],
    sides: [
      ["Arugula-pear salad", "Arugula; pear; pecan; sherry vinaigrette", 1100],
      ["Roasted fingerling potatoes", "Fingerling potatoes; rosemary; garlic confit", 900],
    ],
  },
  {
    key: "fri",
    label: "Friday",
    proteins: [
      [
        "Coconut curry shrimp",
        "Shrimp; coconut milk; thai basil; bell pepper; fish sauce",
        5800,
      ],
      [
        "Coffee-rubbed steak tips",
        "Sirloin tips; coffee; brown sugar; cumin; smoked paprika",
        6400,
      ],
      ["Cider molasses ribs", "Pork ribs; apple cider; molasses; mustard; black pepper", 7200],
      ["Sheet-pan citrus chicken", "Chicken leg quarters; orange; cilantro; cumin", 3900],
      [
        "Black bean enchilada casserole",
        "Black beans; corn tortilla; enchilada sauce; jack cheese; poblanos",
        3500,
      ],
    ],
    vegetables: [
      ["Elote-style street corn salad", "Grilled corn; cotija; lime; chili powder; cilantro", 2100],
      ["Caprese orzo", "Orzo; tomato; mozzarella; basil; balsamic reduction", 2600],
      [
        "Stuffed portobello with quinoa",
        "Portobello; quinoa; sun-dried tomato; basil; pine nuts",
        2900,
      ],
    ],
    sides: [
      ["Corn chips and fire-roasted salsa", "Tortilla chips; tomato; onion; jalapeño; lime", 750],
      ["Cilantro lime rice", "Jasmine rice; cilantro; lime; butter", 680],
    ],
  },
  {
    key: "sat",
    label: "Saturday",
    proteins: [
      [
        "Everything-spice roast turkey breast",
        "Turkey breast; everything seasoning; butter; thyme",
        4500,
      ],
      ["Seafood cioppino", "Mussels; clams; cod; tomato; fennel; white wine", 6800],
      ["Korean-style glazed meatballs", "Beef and pork blend; gochugaru; soy; ginger; pear", 4700],
      ["Lemon caper chicken piccata", "Chicken cutlets; capers; lemon; butter; parsley", 4100],
      ["Chana masala (protein-rich)", "Chickpeas; tomato; ginger; garam masala; cilantro", 3200],
    ],
    vegetables: [
      ["Saag paneer", "Spinach; paneer; fenugreek; cream; garam masala", 3000],
      [
        "Roasted pepper pasta primavera",
        "Penne; zucchini; cherry tomato; roasted peppers; basil",
        2700,
      ],
      [
        "Niçoise-inspired composed salad",
        "Green beans; potato; egg; olives; microgreens",
        2800,
      ],
    ],
    sides: [
      ["Brown butter sage dinner rolls", "Roll dough; brown butter; sage; flaky salt", 960],
      ["Lemon orzo with peas", "Orzo; pea; mint; parmesan; lemon zest", 860],
    ],
  },
];

function item(
  dayKey: string,
  category: FoodCategory,
  idx: number,
  name: string,
  ingredientsRaw: string,
  priceCents: number,
): FoodItem {
  const id = `${dayKey}-${category}-${idx}`;
  const ingredients = ingredientsRaw
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  const imageUrl = `https://picsum.photos/seed/hkc-${id}/640/480`;
  const proteinHeavy = category === "protein";
  return {
    id,
    name,
    description:
      category === "protein"
        ? `${name}, prepared for pickup. Hearty protein centerpiece with balanced seasoning.`
        : category === "vegetarian"
          ? `${name}, vegetarian-friendly tray prepared fresh for your event.`
          : `${name}, crafted as a complementary side for your spread.`,
    ingredients,
    priceCents,
    maxOrderQty: proteinHeavy ? 8 : category === "vegetarian" ? 10 : 12,
    imageUrl,
    imageAlt: `Stylized food photo placeholder for ${name} as listed on the catering menu.`,
    category,
    nutrition: nf(
      proteinHeavy
        ? {
            servingSize: "1 tray (about 12 portions)",
            calories: 420,
            totalFatG: 18,
            saturatedFatG: 5,
            cholesterolMg: 95,
            sodiumMg: 620,
            totalCarbG: 12,
            dietaryFiberG: 2,
            totalSugarsG: 4,
            proteinG: 38,
          }
        : category === "vegetarian"
          ? {
              servingSize: "1 tray (about 10 portions)",
              calories: 260,
              totalFatG: 12,
              saturatedFatG: 3,
              cholesterolMg: 10,
              sodiumMg: 480,
              totalCarbG: 28,
              dietaryFiberG: 6,
              totalSugarsG: 8,
              proteinG: 12,
            }
          : {
              servingSize: "1 pan (about 14 portions)",
              calories: 210,
              totalFatG: 9,
              saturatedFatG: 3,
              cholesterolMg: 25,
              sodiumMg: 360,
              totalCarbG: 26,
              dietaryFiberG: 3,
              totalSugarsG: 6,
              proteinG: 7,
            },
    ),
  };
}

function buildDay(weekdayIndex: number): FoodItem[] {
  const day = days[weekdayIndex];
  const out: FoodItem[] = [];
  let pi = 0;
  for (const [name, ing, price] of day.proteins) {
    pi += 1;
    out.push(item(day.key, "protein", pi, name, ing, price));
  }
  let vi = 0;
  for (const [name, ing, price] of day.vegetables) {
    vi += 1;
    out.push(item(day.key, "vegetarian", vi, name, ing, price));
  }
  let si = 0;
  for (const [name, ing, price] of day.sides) {
    si += 1;
    out.push(item(day.key, "side", si, name, ing, price));
  }
  return out;
}

/** Sunday = 0 through Saturday = 6 (`Date.getDay()`). */
export const MENU_BY_WEEKDAY: Record<number, FoodItem[]> = {
  0: buildDay(0),
  1: buildDay(1),
  2: buildDay(2),
  3: buildDay(3),
  4: buildDay(4),
  5: buildDay(5),
  6: buildDay(6),
};

export function getMenuForDate(d: Date): FoodItem[] {
  return MENU_BY_WEEKDAY[d.getDay()] ?? [];
}

export function getFoodItemForDate(
  d: Date,
  itemId: string,
): FoodItem | undefined {
  return getMenuForDate(d).find((x) => x.id === itemId);
}
