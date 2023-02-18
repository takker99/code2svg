/*
 * This is an example of a server that utilizes the router.
 */

import {
  Application,
  bold,
  lowlight,
  Router,
  Status,
  yellow,
} from "../src/deps.ts";
import { svgGet } from "../src/svgGet.ts";
import { timing } from "../src/timing.ts";
import { logging } from "../src/logging.ts";
import { handleErrors } from "../src/handleErrors.ts";
import { handleNotFound } from "../src/handleNotFound.ts";
import themes from "../src/theme.json" assert { type: "json" };

const router = new Router<Record<string, string>>();
router
  .get("/list/languages", (context) => {
    context.response.status = Status.OK;
    context.response.type = "json";
    context.response.body = lowlight.listLanguages();
    context.response.headers.set(
      "expires",
      new Date(Date.now() + 86_400).toUTCString(),
    );
  })
  .get("/list/themes", (context) => {
    context.response.status = Status.OK;
    context.response.type = "json";
    context.response.body = [...Object.keys(themes)].sort();
    context.response.headers.set(
      "expires",
      new Date(Date.now() + 86_400).toUTCString(),
    );
  })
  .get(
    "/svg/:options?/:proto(http:/?|https:/?)/:host/:path*",
    svgGet,
  );

const app = new Application();

app.use(logging);
app.use(timing);
app.use(handleErrors);

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

// A basic 404 page
app.use(handleNotFound);

app.addEventListener("listen", ({ hostname, port, serverType }) => {
  console.log(`${bold("Start listening on ")}${yellow(`${hostname}:${port}`)}`);
  console.log(`${bold("  using HTTP server: ")}${yellow(serverType)}`);
});

export default app.handle;
