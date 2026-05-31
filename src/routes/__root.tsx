import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const isProd = typeof window !== "undefined"
      ? (window.location.hostname === "calczen.in" || window.location.hostname === "www.calczen.in")
      : (typeof process !== "undefined" && process.env && (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production"));

    return {
      meta: [
        { charSet: "utf-8" },
        {
  name: "robots",
  content: "index, follow",
},
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        { title: "CalcZen — Smart Online Calculators" },
        {
          name: "description",
          content: "Free online calculators for finance, health, math and everyday life.",
        },
        { name: "author", content: "CalcZen" },
        { name: "theme-color", content: "#0F172A" },
        { property: "og:site_name", content: "CalcZen" },
        { property: "og:type", content: "website" },
        { property: "og:image", content: "/icons/android-chrome-512x512.png" },
        { name: "twitter:image", content: "/icons/android-chrome-512x512.png" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "icon", type: "image/x-icon", href: "/icons/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/icons/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/icons/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/icons/apple-touch-icon.png" },
        { rel: "manifest", href: "/manifest.webmanifest" },
      ],
    };
  },
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const state = useRouterState();

  useEffect(() => {
    let title = "CalcZen — Smart Online Calculators";
    let description = "Free online calculators for finance, health, math and everyday life.";

    // Iterate from root to leaf so that specific child routes override parent/root default tags
    for (let i = 0; i < state.matches.length; i++) {
      const match = state.matches[i];
      const route = router.routesById[match.routeId];
      if (route?.options?.head) {
        try {
          const headResult = typeof route.options.head === "function"
            ? route.options.head({
                loaderData: match.loaderData,
                params: match.params,
                context: match.context,
              })
            : route.options.head;

          if (headResult?.meta) {
            // Find title
            const titleObj = headResult.meta.find((m: any) => m && "title" in m);
            if (titleObj && typeof titleObj.title === "string") {
              title = titleObj.title;
            }

            // Find description
            const descObj = headResult.meta.find((m: any) => m && m.name === "description");
            if (descObj && typeof descObj.content === "string") {
              description = descObj.content;
            }
          }
        } catch (err) {
          console.error("Error evaluating route head:", err);
        }
      }
    }

    // Update document title
    document.title = title;

    // Update meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.setAttribute("name", "description");
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute("content", description);
  }, [state.matches, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
