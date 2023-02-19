import { RouterContext } from "./deps.ts";
import { parseSVGLength, SVGLength } from "./svgLength.ts";

export interface Params {
  url: string;
  range?: [number, number];
  language?: string;
  lightTheme?: string;
  darkTheme?: string;
  nowrap: boolean;
  fontSize?: SVGLength;
  width?: SVGLength;
  blanks?: number;
}

export const parseParams = (
  params: RouterContext<
    "/svg/:options?/:proto(http:/|https:/)/:host/:path*"
  >["params"],
): Params => {
  const { options = "", proto, host, path } = params;
  const parsed: Params = { url: `${proto}/${host}/${path}`, nowrap: false };
  for (const option of options.split(",").map((option) => option.trim())) {
    if (option.includes("=")) {
      const [key, value] = option.split("=", 2);
      if (!value) continue;
      switch (key) {
        case "lang":
          parsed.language ??= value;
          break;
        case "light":
          parsed.lightTheme ??= value;
          break;
        case "dark":
          parsed.darkTheme ??= value;
          break;
        case "fontSize":
          parsed.fontSize ??= parseSVGLength(value);
          break;
        case "width":
          parsed.width ??= parseSVGLength(value);
          break;
        case "blanks":
          if (/^\d+$/.test(value)) parsed.blanks ??= parseInt(value);
          break;
        default:
          break;
      }
    }
    if (option === "nowrap") parsed.nowrap = true;
    {
      const range = option.match(/^L(\d+)(?:-(\d+))?$/)?.slice?.(1);
      if (range) {
        const start = parseInt(range[0]);
        const end = parseInt(range[1] ?? range[0]);
        // 1始まりを0始まりに直す
        parsed.range ??= [start - 1, end - 1];
        continue;
      }
    }
  }
  parsed.language ??= parsed.url.match(/\.(\w+)$/)?.[1];
  return parsed;
};
