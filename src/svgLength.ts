export type SVGLengthUnit =
  | "em"
  | "ex"
  | "px"
  | "in"
  | "cm"
  | "mm"
  | "pt"
  | "pc"
  | "%";
export interface SVGLength {
  length: number;
  unit: SVGLengthUnit;
}

/** parseに失敗したら`undefined`を返す */
export const parseSVGLength = (
  length: number | string,
): SVGLength | undefined => {
  if (typeof length === "number") return { length, unit: "px" };
  const num = parseFloat(length);
  if (isNaN(num)) return;
  if (/^(?:\d+\.?\d*|\.\d+)$/.test(length)) return { length: num, unit: "px" };
  const [, unit] = length.match(/(em|ex|px|in|cm|mm|pt|pc|%)$/) ?? [];
  if (unit === undefined) return;
  return { length: num, unit: unit as SVGLengthUnit };
};
