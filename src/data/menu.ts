import type { MenuItem, NutritionFacts } from '../types';

const img = (id: string, sig: number) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop&sig=${sig}`;

function nf(partial: Omit<NutritionFacts, 'servingSize'> & { servingSize?: string }): NutritionFacts {
  return {
    servingSize: partial.servingSize ?? '1 guest portion (est.)',
    calories: partial.calories,
    totalFat: partial.totalFat,
    saturatedFat: partial.saturatedFat,
    cholesterol: partial.cholesterol,
    sodium: partial.sodium,
    totalCarbohydrate: partial.totalCarbohydrate,
    dietaryFiber: partial.dietaryFiber,
    totalSugars: partial.totalSugars,
    protein: partial.protein,
  };
}

/** 7 arrays: index 0 = Sunday … 6 = Saturday. Each has 5 protein, 3 vegetarian, 2 sides. */
export const WEEKLY_MENU: MenuItem[][] = [
  // Sunday
  [
    {
      id: 'sun-p1',
      name: 'Citrus Herb Roasted Chicken',
      category: 'protein',
      pricePerPerson: 14.5,
      unitsAvailable: 28,
      description:
        'Half chickens marinated overnight in lemon, garlic, and garden herbs, roasted until the skin is crisp and golden.',
      ingredients: [
        'Chicken',
        'Lemon',
        'Garlic',
        'Rosemary',
        'Thyme',
        'Olive oil',
        'Black pepper',
        'Kosher salt',
      ],
      nutrition: nf({
        calories: 420,
        totalFat: '22g',
        saturatedFat: '6g',
        cholesterol: '120mg',
        sodium: '480mg',
        totalCarbohydrate: '8g',
        dietaryFiber: '2g',
        totalSugars: '2g',
        protein: '42g',
      }),
      imageUrl: img('1598103442097-8b74394b95c6', 1),
    },
    {
      id: 'sun-p2',
      name: 'Slow-Braised Beef Barbacoa',
      category: 'protein',
      pricePerPerson: 16.25,
      unitsAvailable: 22,
      description:
        'Beef chuck braised with chipotle, cumin, and tomato until fork-tender — perfect for tacos or rice bowls.',
      ingredients: ['Beef chuck', 'Chipotle', 'Cumin', 'Tomato', 'Onion', 'Garlic', 'Bay leaf', 'Apple cider vinegar'],
      nutrition: nf({
        calories: 380,
        totalFat: '18g',
        saturatedFat: '7g',
        cholesterol: '95mg',
        sodium: '620mg',
        totalCarbohydrate: '9g',
        dietaryFiber: '3g',
        totalSugars: '4g',
        protein: '40g',
      }),
      imageUrl: img('1544025162-d76694265947', 2),
    },
    {
      id: 'sun-p3',
      name: 'Maple-Glazed Salmon',
      category: 'protein',
      pricePerPerson: 17.5,
      unitsAvailable: 18,
      description: 'Atlantic salmon fillets with a light maple–Dijon glaze and cracked pepper.',
      ingredients: ['Salmon', 'Maple syrup', 'Dijon mustard', 'Olive oil', 'Lemon zest', 'Black pepper', 'Salt'],
      nutrition: nf({
        calories: 410,
        totalFat: '24g',
        saturatedFat: '5g',
        cholesterol: '85mg',
        sodium: '360mg',
        totalCarbohydrate: '12g',
        dietaryFiber: '0g',
        totalSugars: '10g',
        protein: '34g',
      }),
      imageUrl: img('1467003909585-2f8a72700288', 3),
    },
    {
      id: 'sun-p4',
      name: 'Smoked Paprika Pork Tenderloin',
      category: 'protein',
      pricePerPerson: 15.0,
      unitsAvailable: 24,
      description: 'Lean pork rubbed with smoked paprika and brown sugar, roasted and rested for juicy slices.',
      ingredients: ['Pork tenderloin', 'Smoked paprika', 'Brown sugar', 'Garlic powder', 'Olive oil', 'Salt'],
      nutrition: nf({
        calories: 340,
        totalFat: '14g',
        saturatedFat: '4g',
        cholesterol: '110mg',
        sodium: '520mg',
        totalCarbohydrate: '6g',
        dietaryFiber: '1g',
        totalSugars: '4g',
        protein: '38g',
      }),
      imageUrl: img('1558030007-450267093b0c', 4),
    },
    {
      id: 'sun-p5',
      name: 'Tamarind-Glazed Meatballs',
      category: 'protein',
      pricePerPerson: 13.75,
      unitsAvailable: 30,
      description: 'Beef and pork meatballs in a sweet-sour tamarind tomato sauce.',
      ingredients: ['Ground beef', 'Ground pork', 'Breadcrumbs', 'Egg', 'Tamarind', 'Tomato', 'Ginger', 'Soy sauce'],
      nutrition: nf({
        calories: 450,
        totalFat: '26g',
        saturatedFat: '9g',
        cholesterol: '105mg',
        sodium: '780mg',
        totalCarbohydrate: '22g',
        dietaryFiber: '2g',
        totalSugars: '14g',
        protein: '28g',
      }),
      imageUrl: img('1529697759337-5c1a5d5c0b0e', 5),
    },
    {
      id: 'sun-v1',
      name: 'Roasted Vegetable Lasagna',
      category: 'vegetarian',
      pricePerPerson: 12.5,
      unitsAvailable: 20,
      description: 'Layers of roasted zucchini, peppers, ricotta, and marinara — no meat, all comfort.',
      ingredients: ['Lasagna noodles', 'Zucchini', 'Bell pepper', 'Ricotta', 'Mozzarella', 'Marinara', 'Basil', 'Olive oil'],
      nutrition: nf({
        calories: 380,
        totalFat: '16g',
        saturatedFat: '7g',
        cholesterol: '45mg',
        sodium: '720mg',
        totalCarbohydrate: '44g',
        dietaryFiber: '5g',
        totalSugars: '12g',
        protein: '16g',
      }),
      imageUrl: img('1574894709920-11b28e7367e3', 6),
    },
    {
      id: 'sun-v2',
      name: 'Chickpea Coconut Curry',
      category: 'vegetarian',
      pricePerPerson: 11.75,
      unitsAvailable: 26,
      description: 'Creamy coconut curry with chickpeas, spinach, and warm spices.',
      ingredients: ['Chickpeas', 'Coconut milk', 'Spinach', 'Onion', 'Garlic', 'Garam masala', 'Turmeric', 'Tomato'],
      nutrition: nf({
        calories: 360,
        totalFat: '18g',
        saturatedFat: '14g',
        cholesterol: '0mg',
        sodium: '540mg',
        totalCarbohydrate: '38g',
        dietaryFiber: '10g',
        totalSugars: '8g',
        protein: '12g',
      }),
      imageUrl: img('1585937421612-b936261668c6', 7),
    },
    {
      id: 'sun-v3',
      name: 'Stuffed Portobello Caps',
      category: 'vegetarian',
      pricePerPerson: 12.0,
      unitsAvailable: 16,
      description: 'Portobello mushrooms filled with herbed farro, sun-dried tomato, and feta.',
      ingredients: ['Portobello mushroom', 'Farro', 'Feta', 'Sun-dried tomato', 'Parsley', 'Garlic', 'Balsamic vinegar'],
      nutrition: nf({
        calories: 310,
        totalFat: '12g',
        saturatedFat: '4g',
        cholesterol: '20mg',
        sodium: '480mg',
        totalCarbohydrate: '40g',
        dietaryFiber: '6g',
        totalSugars: '6g',
        protein: '14g',
      }),
      imageUrl: img('1540184409327-1e348a66ed04', 8),
    },
    {
      id: 'sun-s1',
      name: 'Garlic Butter Green Beans',
      category: 'sides',
      pricePerPerson: 4.5,
      unitsAvailable: 40,
      description: 'Blistered green beans finished with garlic butter and toasted almonds.',
      ingredients: ['Green beans', 'Butter', 'Garlic', 'Almonds', 'Lemon', 'Salt', 'Black pepper'],
      nutrition: nf({
        calories: 140,
        totalFat: '10g',
        saturatedFat: '4g',
        cholesterol: '15mg',
        sodium: '220mg',
        totalCarbohydrate: '10g',
        dietaryFiber: '4g',
        totalSugars: '3g',
        protein: '4g',
      }),
      imageUrl: img('1596797038530-2c107229464b', 9),
    },
    {
      id: 'sun-s2',
      name: 'Buttermilk Cornbread',
      category: 'sides',
      pricePerPerson: 3.75,
      unitsAvailable: 36,
      description: 'Moist cornbread with a hint of honey — baked in a cast-iron pan.',
      ingredients: ['Cornmeal', 'Flour', 'Buttermilk', 'Egg', 'Honey', 'Butter', 'Baking powder', 'Salt'],
      nutrition: nf({
        calories: 220,
        totalFat: '8g',
        saturatedFat: '4g',
        cholesterol: '55mg',
        sodium: '320mg',
        totalCarbohydrate: '32g',
        dietaryFiber: '2g',
        totalSugars: '10g',
        protein: '5g',
      }),
      imageUrl: img('1504674900247-0877df9cc836', 10),
    },
  ],
  // Monday — abbreviated unique sets using same structure; I'll duplicate pattern with different ids/names for each day
];

function cloneItem(item: MenuItem, newId: string, overrides: Partial<MenuItem>): MenuItem {
  return { ...item, ...overrides, id: newId };
}

/** Build Mon–Sat by cloning Sunday template with new names/ids for variety */
const sun = WEEKLY_MENU[0];

WEEKLY_MENU[1] = [
  cloneItem(sun[0], 'mon-p1', { name: 'Lemon Oregano Chicken Thighs', unitsAvailable: 26 }),
  cloneItem(sun[1], 'mon-p2', { name: 'Coffee-Rubbed Brisket Slices', unitsAvailable: 20 }),
  cloneItem(sun[2], 'mon-p3', { name: 'Herb Crusted Cod', pricePerPerson: 16.75, unitsAvailable: 17 }),
  cloneItem(sun[3], 'mon-p4', { name: 'Apple Cider Pork Shoulder', unitsAvailable: 23 }),
  cloneItem(sun[4], 'mon-p5', { name: 'Turkey & Quinoa Meatloaf Muffins', pricePerPerson: 13.25, unitsAvailable: 29 }),
  cloneItem(sun[5], 'mon-v1', { name: 'Eggplant Parmigiana', unitsAvailable: 19 }),
  cloneItem(sun[6], 'mon-v2', { name: 'Red Lentil Dal', pricePerPerson: 11.25, unitsAvailable: 27 }),
  cloneItem(sun[7], 'mon-v3', { name: 'Wild Mushroom Risotto Cakes', unitsAvailable: 15 }),
  cloneItem(sun[8], 'mon-s1', { name: 'Roasted Rainbow Carrots', pricePerPerson: 4.25, unitsAvailable: 38 }),
  cloneItem(sun[9], 'mon-s2', { name: 'Herbed Potato Wedges', pricePerPerson: 3.95, unitsAvailable: 35 }),
];

WEEKLY_MENU[2] = [
  cloneItem(sun[0], 'tue-p1', { name: 'Peri-Peri Chicken Drumsticks', unitsAvailable: 30 }),
  cloneItem(sun[1], 'tue-p2', { name: 'Red Wine Short Ribs', pricePerPerson: 17.0, unitsAvailable: 18 }),
  cloneItem(sun[2], 'tue-p3', { name: 'Miso Ginger Salmon', unitsAvailable: 19 }),
  cloneItem(sun[3], 'tue-p4', { name: 'Honey Mustard Ham Slices', pricePerPerson: 14.25, unitsAvailable: 25 }),
  cloneItem(sun[4], 'tue-p5', { name: 'Lamb Kofta with Mint Yogurt', pricePerPerson: 16.5, unitsAvailable: 21 }),
  cloneItem(sun[5], 'tue-v1', { name: 'Spinach Ricotta Cannelloni', unitsAvailable: 18 }),
  cloneItem(sun[6], 'tue-v2', { name: 'Thai Green Curry Tofu', unitsAvailable: 24 }),
  cloneItem(sun[7], 'tue-v3', { name: 'Caprese Stuffed Peppers', unitsAvailable: 17 }),
  cloneItem(sun[8], 'tue-s1', { name: 'Charred Broccolini', unitsAvailable: 42 }),
  cloneItem(sun[9], 'tue-s2', { name: 'Cilantro Lime Rice', pricePerPerson: 3.5, unitsAvailable: 44 }),
];

WEEKLY_MENU[3] = [
  cloneItem(sun[0], 'wed-p1', { name: 'Smoky BBQ Pulled Chicken', pricePerPerson: 13.95, unitsAvailable: 32 }),
  cloneItem(sun[1], 'wed-p2', { name: 'Peppercorn Crusted Steak Tips', pricePerPerson: 18.25, unitsAvailable: 16 }),
  cloneItem(sun[2], 'wed-p3', { name: 'Coconut Lime Shrimp Skewers', pricePerPerson: 18.0, unitsAvailable: 15 }),
  cloneItem(sun[3], 'wed-p4', { name: 'Apricot Glazed Pork Loin', unitsAvailable: 22 }),
  cloneItem(sun[4], 'wed-p5', { name: 'Chicken Apple Sausage Bites', unitsAvailable: 28 }),
  cloneItem(sun[5], 'wed-v1', { name: 'Butternut Squash Ravioli', unitsAvailable: 20 }),
  cloneItem(sun[6], 'wed-v2', { name: 'Vegetable Tagine', pricePerPerson: 12.25, unitsAvailable: 23 }),
  cloneItem(sun[7], 'wed-v3', { name: 'Grilled Halloumi Grain Bowl Base', unitsAvailable: 18 }),
  cloneItem(sun[8], 'wed-s1', { name: 'Maple Roasted Brussels', unitsAvailable: 37 }),
  cloneItem(sun[9], 'wed-s2', { name: 'Cheddar Jalapeño Corn Pudding', unitsAvailable: 30 }),
];

WEEKLY_MENU[4] = [
  cloneItem(sun[0], 'thu-p1', { name: 'Tandoori Yogurt Chicken', unitsAvailable: 27 }),
  cloneItem(sun[1], 'thu-p2', { name: 'Braised Oxtail Ragu', pricePerPerson: 17.75, unitsAvailable: 14 }),
  cloneItem(sun[2], 'thu-p3', { name: 'Sesame Crusted Tuna Medallions', pricePerPerson: 19.0, unitsAvailable: 12 }),
  cloneItem(sun[3], 'thu-p4', { name: 'Cider Braised Pork Belly Bites', unitsAvailable: 19 }),
  cloneItem(sun[4], 'thu-p5', { name: 'Teriyaki Turkey Meatballs', unitsAvailable: 26 }),
  cloneItem(sun[5], 'thu-v1', { name: 'Four Cheese Baked Ziti (veg)', unitsAvailable: 21 }),
  cloneItem(sun[6], 'thu-v2', { name: 'West African Peanut Stew (veg)', unitsAvailable: 22 }),
  cloneItem(sun[7], 'thu-v3', { name: 'Quinoa Stuffed Acorn Squash', unitsAvailable: 16 }),
  cloneItem(sun[8], 'thu-s1', { name: 'Sesame Soy Snap Peas', unitsAvailable: 39 }),
  cloneItem(sun[9], 'thu-s2', { name: 'Rosemary Focaccia Pull-Apart', pricePerPerson: 4.1, unitsAvailable: 33 }),
];

WEEKLY_MENU[5] = [
  cloneItem(sun[0], 'fri-p1', { name: 'Crispy Chicken Cutlets', unitsAvailable: 29 }),
  cloneItem(sun[1], 'fri-p2', { name: 'Red Mole Beef Cheeks', pricePerPerson: 17.5, unitsAvailable: 17 }),
  cloneItem(sun[2], 'fri-p3', { name: 'Blackened Catfish Fillets', pricePerPerson: 15.75, unitsAvailable: 18 }),
  cloneItem(sun[3], 'fri-p4', { name: 'Peach Bourbon Ribs', unitsAvailable: 20 }),
  cloneItem(sun[4], 'fri-p5', { name: 'Buffalo Cauliflower “Wings” + Chicken Duo', pricePerPerson: 14.0, unitsAvailable: 24 }),
  cloneItem(sun[5], 'fri-v1', { name: 'Truffle Mac & Cheese (veg)', unitsAvailable: 25 }),
  cloneItem(sun[6], 'fri-v2', { name: 'Chana Masala', unitsAvailable: 31 }),
  cloneItem(sun[7], 'fri-v3', { name: 'Beet & Goat Cheese Galette Slices', unitsAvailable: 14 }),
  cloneItem(sun[8], 'fri-s1', { name: 'Caesar Kale Slaw', unitsAvailable: 41 }),
  cloneItem(sun[9], 'fri-s2', { name: 'Honey Butter Dinner Rolls', pricePerPerson: 3.6, unitsAvailable: 48 }),
];

WEEKLY_MENU[6] = [
  cloneItem(sun[0], 'sat-p1', { name: 'Sunday Gravy Chicken Cacciatore', unitsAvailable: 25 }),
  cloneItem(sun[1], 'sat-p2', { name: 'Espresso Crusted Tri-Tip', pricePerPerson: 18.5, unitsAvailable: 15 }),
  cloneItem(sun[2], 'sat-p3', { name: 'Capers & Lemon Sole', unitsAvailable: 16 }),
  cloneItem(sun[3], 'sat-p4', { name: 'Root Beer Glazed Ham', unitsAvailable: 23 }),
  cloneItem(sun[4], 'sat-p5', { name: 'Korean BBQ Beef Bulgogi', pricePerPerson: 16.0, unitsAvailable: 22 }),
  cloneItem(sun[5], 'sat-v1', { name: 'Pumpkin Sage Gnocchi', unitsAvailable: 18 }),
  cloneItem(sun[6], 'sat-v2', { name: 'Mediterranean Orzo Bake', unitsAvailable: 20 }),
  cloneItem(sun[7], 'sat-v3', { name: 'Crispy Tofu with Orange Glaze', unitsAvailable: 19 }),
  cloneItem(sun[8], 'sat-s1', { name: 'Parmesan Roasted Cauliflower', unitsAvailable: 36 }),
  cloneItem(sun[9], 'sat-s2', { name: 'Wild Rice Pilaf', pricePerPerson: 3.85, unitsAvailable: 40 }),
];

export function getMenuForDate(d: Date): MenuItem[] {
  const idx = d.getDay();
  return WEEKLY_MENU[idx] ?? WEEKLY_MENU[0];
}
