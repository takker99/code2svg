import { parseSVGLength } from "./svgLength.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

Deno.test("parseSVGLength()", () => {
  assertEquals(parseSVGLength("400"), { length: 400, unit: "px" });
  assertEquals(parseSVGLength("400px"), { length: 400, unit: "px" });
  assertEquals(parseSVGLength("40.0"), { length: 40.0, unit: "px" });
  assertEquals(parseSVGLength("40.0px"), { length: 40.0, unit: "px" });
  assertEquals(parseSVGLength("40."), { length: 40, unit: "px" });
  assertEquals(parseSVGLength("40."), { length: 40, unit: "px" });
  assertEquals(parseSVGLength(".43"), { length: .43, unit: "px" });
  assertEquals(parseSVGLength(".43"), { length: .43, unit: "px" });
});
