import { Middleware, Status } from "./deps.ts";
export const handleNotFound: Middleware = async (context, next) => {
  await next();
  if (context.response.status !== Status.NotFound) return;
  if (context.request.accepts("application/json")) {
    context.response.status = Status.NotFound;
    context.response.type = "json";
    context.response.body = {
      name: "NotFoundError",
      url: context.request.url,
    };
  } else if (context.request.accepts("text/html")) {
    context.response.status = Status.NotFound;
    context.response.body =
      `<!DOCTYPE html><html><meta><title>404 - Not Found</title></meta><body><h1>404 - Not Found</h1><p>Path <code>${context.request.url}</code> not found.`;
  }
};
