import type { NutritionFacts } from "../types";

export function NutritionTable({ n }: { n: NutritionFacts }) {
  const rows: [string, string][] = [
    ["Serving size", n.servingSize],
    ["Calories", String(n.calories)],
    ["Total fat", `${n.totalFatG}g`],
    ["Saturated fat", `${n.saturatedFatG}g`],
    ["Cholesterol", `${n.cholesterolMg}mg`],
    ["Sodium", `${n.sodiumMg}mg`],
    ["Total carbohydrate", `${n.totalCarbG}g`],
    ["Dietary fiber", `${n.dietaryFiberG}g`],
    ["Total sugars", `${n.totalSugarsG}g`],
    ["Protein", `${n.proteinG}g`],
  ];

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
        <caption
          style={{
            captionSide: "top",
            textAlign: "left",
            padding: "0.75rem 1rem",
            fontWeight: 700,
            borderBottom: "2px solid var(--color-ink)",
          }}
        >
          Nutrition facts
        </caption>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th
                scope="row"
                style={{
                  textAlign: "left",
                  padding: "0.5rem 1rem",
                  fontWeight: 500,
                  color: "var(--color-muted)",
                }}
              >
                {k}
              </th>
              <td style={{ padding: "0.5rem 1rem", textAlign: "right" }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ margin: 0, padding: "0.65rem 1rem", fontSize: "0.8rem", color: "var(--color-muted)" }}>
        Percent daily values are estimates for planning and may vary by preparation.
      </p>
    </div>
  );
}
