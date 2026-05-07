import { useEffect } from "react";

const SITE_TITLE = "Vibing Kitchen — Homemade catering";

/** Sets `<title>` for 2.4.2 Page Titled when `pageTitle` is provided. */
export function useDocumentTitle(pageTitle: string | undefined, restoreOnUnmount = false) {
  useEffect(() => {
    if (!pageTitle) return;
    if (!restoreOnUnmount) {
      document.title = `${pageTitle} | ${SITE_TITLE}`;
      return;
    }
    const previous = document.title;
    document.title = `${pageTitle} | ${SITE_TITLE}`;
    return () => {
      document.title = previous || SITE_TITLE;
    };
  }, [pageTitle, restoreOnUnmount]);
}
