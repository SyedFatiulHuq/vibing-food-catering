import { BUSINESS, SOCIAL_LINKS } from "../data/businessInfo";

export function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__title">{BUSINESS.legalName}</p>
          <p>
            {BUSINESS.addressLine1}
            <br />
            {BUSINESS.addressLine2}
          </p>
        </div>
        <div>
          <p className="site-footer__title">Contact</p>
          <p>
            <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a>
            <br />
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </p>
        </div>
        <div>
          <p className="site-footer__title">Social</p>
          <ul className="site-footer__social">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.id}>
                <a href={s.href} rel="me noreferrer noopener" target="_blank">
                  {s.label} ({s.handle})
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="site-footer__note">
        Sample website for demonstration. Payment is not processed online.
      </p>
    </footer>
  );
}
