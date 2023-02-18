import {
  createHttpError,
  lowlight,
  RouterMiddleware,
  Status,
  toHtml,
} from "./deps.ts";
import { splitNode } from "./splitNode.ts";
import { slice } from "./slice.ts";
import { parseParams } from "./parseParams.ts";
import themes from "./theme.json" assert { type: "json" };

export const svgGet: RouterMiddleware<
  "/svg/:options?/:proto(http:/|https:/)/:host/:path*"
> = async (context) => {
  const {
    url,
    range = [0, Infinity],
    width = 800,
    height: height_,
    lightTheme,
    darkTheme,
    language,
    nowrap,
  } = parseParams(
    context.params,
  );
  const res = await fetch(url);
  if (!res.ok) {
    throw createHttpError(res.status, `Failed to fetch ${url}`, {
      headers: res.headers,
    });
  }
  const text = await res.text();

  const tree = language && lowlight.registered(language)
    ? lowlight.highlight(language, text)
    : lowlight.highlightAuto(text);
  const [start, end] = range.map((l) => Math.max(0, l));
  const snippet = slice(start, end, splitNode(tree));
  const height = height_ ?? `${snippet.length * 20}`;

  const light = isTheme(lightTheme) ? lightTheme : "github";
  const lightCSS = themes[light] ?? themes.github;
  const dark = isTheme(darkTheme) ? darkTheme : "github-dark";
  const darkCSS = themes[dark] ?? themes["github-dark"];

  context.response.status = Status.OK;
  context.response.type = "image/svg+xml";
  context.response.headers.set(
    "expires",
    res.headers.get("expires") ??
      new Date(Date.now() + 86_400).toUTCString(),
  );
  context.response.body = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">
  <!-- ${url} -->
  <!-- light theme: ${light} -->
  <!-- dark theme: ${dark} -->
  <foreignObject x="0" y="0" width="100%" height="100%">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <style>
          ${
    nowrap ? "" : "pre{white-space:pre-wrap}"
  }body,pre{margin:unset}code{font-family:Menlo,Monaco,Consolas,"Courier New",monospace}pre code.hljs{display:block;overflow-x:auto;padding:1em}${lightCSS}${
    light === dark ? "" : `@media(prefers-color-scheme:dark){${darkCSS}}`
  }
        </style>
      </head>
      <body><pre><code class="hljs" data-language="${tree.data.language}">${
    toHtml(snippet, {
      closeEmptyElements: true,
      closeSelfClosing: true,
    })
  }</code></pre> </body></html></foreignObject></svg>`;
};

const isTheme = (theme: string | undefined): theme is keyof typeof themes =>
  Object.hasOwn(themes, theme ?? "");
