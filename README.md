# Hearth & Honey Catering

An accessible, mobile-friendly website for a small homemade food catering business.
Customers browse a daily-changing menu, view rich detail and nutrition information,
build a cart, and check out for pickup. Orders are saved as invoices in the
browser's `localStorage` (no backend required).

> Built per a brief: client-side only, WCAG 2.2-conscious, no user accounts, no
> admin view, no real payment processing.

## Stack

- React 18 + TypeScript
- React Router v6
- Vite (dev server + production build)
- Plain CSS with custom properties (no UI framework)

## Scripts

```bash
npm install      # install dependencies
npm run dev      # start the Vite dev server at http://localhost:5173
npm run build    # type-check and produce a production build in dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint (incl. jsx-a11y rules)
```

## Features

| Requirement                                                                                                | Where it lives                                       |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Customer can view the menu on the date they want catering on.                                              | `MenuPage`, `PickupDatePicker`, `PickupDateContext`  |
| Menu shown as a list grouped into protein, vegetarian, and sides — with name, price, portion, image.       | `MenuPage`, `FoodCard`                               |
| Detail view: description, ingredients, nutritional facts table.                                            | `FoodDetailPage`                                     |
| Add to cart.                                                                                               | `FoodCard`, `FoodDetailPage`, `CartContext`          |
| View / update cart (change quantity, remove items).                                                        | `CartPage`, `QuantityControl`                        |
| Checkout with pickup, contact, payment method, special instructions.                                       | `CheckoutPage`                                       |
| Invoice generated after order; visible to customer and persisted to `localStorage` for the owner to view. | `CheckoutPage`, `InvoicePage`, `utils/storage.ts`    |
| About page.                                                                                                | `AboutPage`, `data/business.ts`                      |
| Contact page (social, phone, in-site form).                                                                | `ContactPage`                                        |

### Functional rules implemented

- Each weekday (Sun–Sat) has its own unique 10-item menu (5 protein, 3 veg, 2 sides) — see `data/menu.ts`.
- Order window: pickup must be at least **2 days** out and at most **2 weeks** out. Enforced via the `<input type="date">` `min`/`max` and `isWithinOrderWindow()`.
- Checkout requires a party size between **6 and 30** people, validated client-side.
- No payment is actually processed; entered card details aren't stored — only the
  last 4 digits make it into the saved invoice (for display).

## Accessibility — WCAG 2.2 conformance

Following the [WCAG 2.2 spec](https://www.w3.org/TR/WCAG22/), the site implements:

### Perceivable

- **1.1.1 Non-text content** — All meaningful images use `<title>` + `<desc>` inside `<svg role="img">` (see `FoodImage`); decorative graphics are `aria-hidden`.
- **1.3.1 Info and Relationships** — Semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`), heading hierarchy, `<fieldset>` + `<legend>` groups, table headers and captions.
- **1.3.5 Identify Input Purpose** — Inputs use proper `autocomplete` tokens (`name`, `email`, `tel`, `cc-number`, …).
- **1.4.3 / 1.4.6 Contrast** — Default and dark-mode palettes were tuned to ≥ 4.5:1 (small text) and ≥ 3:1 (large text). The primary brown (`#7a3e16`) on white is 7.4:1.
- **1.4.4 Resize text** — Sizes use `rem` and `clamp()`; the layout tolerates 200% zoom.
- **1.4.10 Reflow** — All layouts collapse cleanly at 320 CSS px without horizontal scrolling.
- **1.4.11 Non-text contrast** — Buttons, focus rings, and form borders all use ≥ 3:1 against neighbours.
- **1.4.12 Text spacing** — Body styles avoid fixed line-heights/letter-spacing that would break user-stylesheet overrides.
- **1.4.13 Content on hover/focus** — No hover-only tooltips; all menu information is statically present.

### Operable

- **2.1.1 Keyboard / 2.1.2 No keyboard trap** — Every interactive element is a real `<button>`, `<a>`, or form control; the mobile menu is toggled with a button and closes on `Escape`.
- **2.4.1 Bypass blocks** — `SkipLink` to `#main-content`.
- **2.4.3 Focus order** — Logical DOM order; focus is moved to `<main>` on route change.
- **2.4.4 / 2.4.6 Link purpose & headings** — Buttons that say "Add to cart" carry an `aria-label` naming the dish; section headings describe their content.
- **2.4.7 Focus visible** + **2.4.13 Focus appearance** — Strong, 3px solid focus ring at high contrast against the page background.
- **2.4.11 Focus not obscured (Minimum)** — Sticky header has `z-index` low enough not to overlap focused content; on route change we scroll to top.
- **2.5.5 / 2.5.8 Target size** — Buttons, inputs, and tap targets are ≥ 44×44 CSS px (the WCAG 2.2 minimum requires only 24×24, and we comfortably exceed it).
- **2.5.7 Dragging movements** — No drag-required interactions exist; quantities are adjusted with `+`/`−` buttons and a number input.
- **2.5.3 Label in name** — Visible labels match accessible names (we don't override visible labels with `aria-label`).

### Understandable

- **3.1.1 Language** — `<html lang="en">`.
- **3.2.3 / 3.2.4 Consistent navigation & identification** — Same primary nav across pages; recurring components named consistently (Cart, Menu, Checkout).
- **3.2.6 Consistent help** — Contact information is reachable from the footer (and the dedicated Contact page) on every page.
- **3.3.1 Error identification** — Per-field error text and a top-of-form error summary (focused on submit, with anchor links to each field).
- **3.3.2 Labels or instructions** — All inputs have explicit `<label for>`; required fields are flagged visibly and via `aria-required`.
- **3.3.3 Error suggestion** — Validation messages explain how to fix (e.g., "Use MM/YY (for example 09/28).").
- **3.3.7 Redundant entry** — We don't ask for the same information twice; the cart's pickup date carries through to checkout (and is editable there).
- **3.3.8 Accessible authentication** — There's no authentication, so no cognitive function tests.

### Robust

- **4.1.2 Name, role, value** — All custom widgets use native HTML elements where possible; the mobile nav toggle exposes `aria-expanded` and `aria-controls`.
- **4.1.3 Status messages** — `aria-live="polite"` announcements for "added to cart", "selected pickup date", and the contact-form success notice; `role="alert"` for form error summaries.

### Reduced motion

`prefers-reduced-motion: reduce` disables non-essential animations (SC 2.3.3 advisory).

## Project layout

```
src/
├── App.tsx                  # Routes, layout, focus management on route change
├── main.tsx                 # ReactDOM bootstrap
├── components/
│   ├── FoodImage.tsx        # Self-contained SVG illustration (no external assets)
│   ├── QuantityControl.tsx  # Accessible +/- numeric stepper
│   ├── layout/              # Header, Footer, SkipLink
│   └── menu/                # PickupDatePicker, FoodCard
├── context/
│   ├── CartContext.tsx      # Persisted cart state
│   └── PickupDateContext.tsx
├── data/
│   ├── business.ts          # About + contact dummy data
│   └── menu.ts              # 7 days × 10 items
├── pages/                   # Home, Menu, FoodDetail, Cart, Checkout, Invoice, About, Contact, NotFound
├── styles/                  # global.css, layout.css, pages.css
├── types/index.ts           # TypeScript types
└── utils/                   # dateUtils, format, storage
```

## Design notes

- **Images** are rendered as deterministic SVGs based on each item's id and category, so the site works fully offline and never has broken `<img>` tags — easy to swap for real photography later.
- **Pickup date** is stored separately from the cart so a customer can change days without losing their selections; the cart page warns when items don't belong to the selected day.
- **Invoices** are kept in `localStorage` under the key `hh:orders` (most recent first, capped at 100). The current cart lives at `hh:cart`, and the selected pickup date at `hh:pickupDate`.

## Manual testing checklist

- Navigate the entire site by keyboard only — Tab, Shift+Tab, Enter, Escape, Arrow keys.
- Run through with VoiceOver / NVDA / JAWS; landmarks and headings should outline the page.
- Resize text to 200% (Cmd/Ctrl with `+`) — no clipping or overlapping content.
- Set the OS to dark mode — the dark palette continues to meet contrast targets.
- At 320 px wide (smallest mobile) the layout reflows without horizontal scrolling.
- Place an order; refresh the browser; the invoice page still renders the order from localStorage.
