// ported from https://github.com/denoland/docland/blob/5fc93d458c59a5ddec9deb06e51dfb32ffdc4b7f/middleware/logging.ts
import { Middleware } from "./deps.ts";

export const timing: Middleware = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
};
