// ported from https://github.com/denoland/docland/blob/5fc93d458c59a5ddec9deb06e51dfb32ffdc4b7f/middleware/logging.ts
import { bold, cyan, gray, green, Middleware, red, yellow } from "./deps.ts";

export const logging: Middleware = async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  const c = ctx.response.status >= 500
    ? red
    : ctx.response.status >= 400
    ? yellow
    : green;
  console.log(
    `${c(ctx.request.method)} ${gray(`(${ctx.response.status})`)} - ${
      cyan(`${ctx.request.url.pathname}${ctx.request.url.search}`)
    } - ${bold(String(rt))}`,
  );
};
