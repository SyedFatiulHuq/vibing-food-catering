import { Link } from "react-router-dom";
import type { FoodItem } from "../../types";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/format";
import { FoodImage } from "../FoodImage";

const categoryLabel: Record<FoodItem["category"], string> = {
  protein: "Protein",
  vegetarian: "Vegetarian",
  side: "Side",
};

interface Props {
  item: FoodItem;
}

export const FoodCard = ({ item }: Props) => {
  const { addItem, getQuantity } = useCart();
  const inCart = getQuantity(item.id);

  return (
    <article className="food-card" aria-labelledby={`food-${item.id}-name`}>
      <div className="food-card__media" aria-hidden="true">
        <FoodImage item={item} />
      </div>

      <div className="food-card__body">
        <div className="food-card__head">
          <Link
            to={`/menu/item/${item.id}`}
            className="food-card__title-link"
            aria-describedby={`food-${item.id}-meta`}
          >
            <h3 id={`food-${item.id}-name`} className="food-card__name">
              {item.name}
            </h3>
          </Link>
          <span className="food-card__price" aria-label={`Price: ${formatCurrency(item.price)} per portion`}>
            {formatCurrency(item.price)}
          </span>
        </div>

        <div id={`food-${item.id}-meta`} className="food-card__meta">
          <span className="cat-pill" data-cat={item.category}>
            {categoryLabel[item.category]}
          </span>{" "}
          <span className="sr-only">·</span> {item.portion}
        </div>

        <p className="food-card__desc">{item.shortDescription}</p>

        <div className="food-card__actions" role="group" aria-label={`Actions for ${item.name}`}>
          <Link to={`/menu/item/${item.id}`} className="btn btn--secondary btn--sm food-card__detail-link">
            View details
          </Link>
          <button
            type="button"
            className="btn btn--sm"
            onClick={() => addItem(item.id, 1)}
            aria-label={`Add ${item.name} to cart`}
          >
            {inCart > 0 ? `Add another (${inCart})` : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
};
