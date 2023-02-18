import { Comment, Element, ElementContent, Root, Text } from "./deps.ts";

/** 与えられたhastを1行ごとに分割する
 *
 * @param node 分割したいhast
 * @return 分割したhastを1行ずつ返す
 */
export function* splitNode(
  node: Root | ElementContent,
): Generator<ElementContent, void, unknown> {
  switch (node.type) {
    case "root":
      yield* splitNode({
        type: "element",
        tagName: "div",
        children: node.children,
      });
      return;
    case "comment":
    case "text":
      for (
        const textNode of node.value.split("\n").map(
          (value) => ({ type: node.type, value }),
        )
      ) {
        yield textNode;
      }
      return;
    case "element": {
      if (node.children.length === 0) {
        yield node;
        return;
      }
      let prev: Element | undefined;
      const { children, ...rest } = node;
      for (const child of children) {
        let counter = 0;
        for (const splitted of splitNode(child)) {
          if (prev && counter > 0) {
            if (prev.children.length === 0) prev.children.push(breakLine);
            yield prev;
            prev = undefined;
          }
          counter++;
          const isEmpty = isEmptyNode(splitted);
          if (prev) {
            if (isEmpty) continue;
            prev.children.push(splitted);
            continue;
          }
          prev = { ...rest, children: isEmpty ? [] : [splitted] };
        }
      }
      if (prev) {
        if (prev.children.length === 0) prev.children.push(breakLine);
        yield prev;
      }
      return;
    }
  }
}

/** 空文字のnodeなら`false`を返す */
const isEmptyNode = (node: ElementContent): node is Text | Comment =>
  (node.type === "text" || node.type === "comment") && node.value === "";

const breakLine: Element = { type: "element", tagName: "br", children: [] };
