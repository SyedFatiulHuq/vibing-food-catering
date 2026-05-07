export const BUSINESS = {
  legalName: "Homestyle Kitchen Collective",
  tagline: "Homemade catering, prepared for pickup.",
  phone: "+1 (503) 555-0198",
  phoneTel: "+15035550198",
  email: "hello@homestylekitchencollective.example",
  addressLine1: "1420 NE Alberta Street",
  addressLine2: "Portland, OR 97211",
  hoursNote: "Kitchen production runs Tuesday through Sunday. Pickup windows are scheduled after checkout.",
  story: [
    "Homestyle Kitchen Collective began as a weekly supper club for neighbors. Word traveled quickly, and today we prepare thoughtful, scratch-made trays for celebrations, team lunches, and family gatherings.",
    "We source produce from regional growers when seasonally possible, build flavor from herbs and aromatics instead of shortcuts, and label major allergens clearly on request.",
    "Every menu is built as a weekly rotation so our small team can focus on consistent technique and safe holding temperatures from our licensed commissary kitchen.",
  ],
  values: [
    {
      title: "Made from scratch",
      body: "Stocks, sauces, and spice blends are prepared in-house. No mystery marinades.",
    },
    {
      title: "Pickup-first logistics",
      body: "Orders are packed in insulated carriers with reheating notes so food travels well.",
    },
    {
      title: "Clear communication",
      body: "We confirm pickup windows by email and text so you always know when trays are ready.",
    },
  ],
} as const;

export const SOCIAL_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@homestylekitchencollective",
    href: "https://www.instagram.com/example-placeholder",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "Homestyle Kitchen Collective",
    href: "https://www.facebook.com/example-placeholder",
  },
] as const;
