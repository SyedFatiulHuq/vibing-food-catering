import { Link } from "react-router-dom";
import { business } from "../../data/business";

export const Footer = () => (
  <footer className="site-footer" role="contentinfo">
    <div className="container site-footer__inner">
      <div>
        <h2>{business.name}</h2>
        <p style={{ maxWidth: "44ch" }}>{business.shortDescription}</p>
        <p>
          <a href={`tel:${business.phoneTel}`}>{business.phone}</a>
          {" · "}
          <a href={`mailto:${business.email}`}>{business.email}</a>
        </p>
      </div>

      <div>
        <h2>Explore</h2>
        <ul>
          <li>
            <Link to="/menu">View menu</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
        </ul>
      </div>

      <div>
        <h2>Pickup hours</h2>
        <ul className="hours-list">
          {business.pickupHours.map((row) => (
            <li key={row.day}>
              <span>{row.day}</span>
              <span>{row.hours}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="site-footer__base">
      <div className="container">
        © {new Date().getFullYear()} {business.name}. Homemade with care.
      </div>
    </div>
  </footer>
);
