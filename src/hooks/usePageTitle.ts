import { useEffect } from "react";

export function usePageTitle(pageTitle: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${pageTitle} · Homestyle Kitchen Collective`;
    return () => {
      document.title = prev;
    };
  }, [pageTitle]);
}
