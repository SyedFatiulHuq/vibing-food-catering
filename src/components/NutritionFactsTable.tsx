import type { NutritionFacts } from "../types";

export function NutritionFactsTable({ facts }: { facts: NutritionFacts }) {
  return (
    <section className="nutrition" aria-labelledby="nutrition-heading">
      <h2 id="nutrition-heading" className="section-heading">
        Nutrition facts
      </h2>
      <p id="nutrition-legal" className="nutrition__note">
        Values are illustrative for planning portions. Final packaging may vary.
      </p>
      <div className="table-wrap">
        <table className="nutrition__table" aria-describedby="nutrition-legal">
          <caption className="visually-hidden">
            Nutritional information per catering tray
          </caption>
          <thead>
            <tr>
              <th scope="col">Nutrient</th>
              <th scope="col">Amount per serving</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Serving size</th>
              <td>{facts.servingSize}</td>
            </tr>
            <tr>
              <th scope="row">Calories</th>
              <td>{facts.calories}</td>
            </tr>
            <tr>
              <th scope="row">Total fat</th>
              <td>{facts.totalFatG} g</td>
            </tr>
            <tr>
              <th scope="row">Saturated fat</th>
              <td>{facts.saturatedFatG} g</td>
            </tr>
            <tr>
              <th scope="row">Trans fat</th>
              <td>{facts.transFatG} g</td>
            </tr>
            <tr>
              <th scope="row">Cholesterol</th>
              <td>{facts.cholesterolMg} mg</td>
            </tr>
            <tr>
              <th scope="row">Sodium</th>
              <td>{facts.sodiumMg} mg</td>
            </tr>
            <tr>
              <th scope="row">Total carbohydrate</th>
              <td>{facts.totalCarbG} g</td>
            </tr>
            <tr>
              <th scope="row">Dietary fiber</th>
              <td>{facts.dietaryFiberG} g</td>
            </tr>
            <tr>
              <th scope="row">Total sugars</th>
              <td>{facts.totalSugarsG} g</td>
            </tr>
            <tr>
              <th scope="row">Protein</th>
              <td>{facts.proteinG} g</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
