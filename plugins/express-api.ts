import { fromNodeMiddleware } from "h3";
import { definePlugin } from "nitro";
import { createApp } from "../server/dist/app.js";

let appPromise: ReturnType<typeof createApp> | null = null;

/** Mount Express API + admin panel on Vercel (same deployment as TanStack Start). */
export default definePlugin(async (nitroApp) => {
  const expressApp = await (appPromise ??= createApp());
  const handle = fromNodeMiddleware(expressApp);

  nitroApp.h3.use(async (event) => {
    const pathname = event.path.split("?")[0] ?? "";
    if (!pathname.startsWith("/api") && !pathname.startsWith("/admin")) {
      return;
    }
    return handle(event);
  });
});
