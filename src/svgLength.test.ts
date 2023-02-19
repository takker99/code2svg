import { parseSVGLength } from "./svgLength.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

Deno.test("parseSVGLength()", async (t) => {
  await t.step("must pass", async (t) => {
    const units = [
      "em",
      "ex",
      "px",
      "in",
      "cm",
      "mm",
      "pt",
      "pc",
      "%",
      "",
    ] as const;
    for (const unit of units) {
      for (const length of ["400", "40.0", ".43", "40."]) {
        const str = `${length}${unit}`;
        await t.step(str, () => {
          assertEquals(parseSVGLength(str), {
            length: parseFloat(length),
            unit: unit || "px",
          });
        });
      }
    }
  });

  await t.step("cannot pass", () => {
    assertEquals(parseSVGLength("500ch"), undefined);
    assertEquals(parseSVGLength("hello"), undefined);
  });
});
