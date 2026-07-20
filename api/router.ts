import { createRouter, publicQuery } from "./middleware";
import { wikiRouter } from "./routers/wiki";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  wiki: wikiRouter,
});

export type AppRouter = typeof appRouter;
