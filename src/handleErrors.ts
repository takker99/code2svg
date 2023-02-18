// based on https://github.com/denoland/docland/blob/5fc93d458c59a5ddec9deb06e51dfb32ffdc4b7f/middleware/errors.tsx
/** @jsx h */
import {
  Context,
  isHttpError,
  Middleware,
  Status,
  STATUS_TEXT,
} from "./deps.ts";

export const handleErrors: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const accepts = ctx.request.accepts("text/html", "application/json");
    if (isHttpError(err)) {
      setResponse(ctx, accepts, err.status, err.message);
      if (err.expose) {
        return;
      }
    } else if (err instanceof Error) {
      setResponse(ctx, accepts, Status.InternalServerError, err.message);
    } else {
      setResponse(
        ctx,
        accepts,
        Status.InternalServerError,
        "[non-error-thrown]",
      );
    }
    throw err;
  }
};

const setResponse = (
  ctx: Context,
  accepts: string | undefined,
  status: Status,
  message: string,
) => {
  const statusText = `${status} ${STATUS_TEXT[status]}`;
  ctx.response.status = status;
  if (accepts === "text/html") {
    ctx.response.body =
      `<!DOCTYPE html><html><meta><title>${statusText}</title></meta><body><h1>${statusText}</h1><p>${message}`;
    ctx.response.type = "html";
  } else if (accepts === "application/json") {
    ctx.response.body = { status, text: STATUS_TEXT[status], message };
    ctx.response.type = "json";
  } else {
    ctx.response.body = `Error: [${statusText}] ${message}`;
    ctx.response.type = "text/plain";
  }
};
