import { Link } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { usePageTitle } from "../hooks/usePageTitle";

export function NotFoundPage() {
  usePageTitle("Page not found");

  return (
    <AppLayout>
      <div className="page-heading">
        <h1>Page not found</h1>
        <p>The page you requested is unavailable.</p>
        <Link className="button button--primary" to="/">
          Return home
        </Link>
      </div>
    </AppLayout>
  );
}
