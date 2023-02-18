import { Octokit, pooledMap } from "./deps_dev.ts";

const ref = "11.7.0";
const owner = "highlightjs";
const repo = "highlight.js";

const octkit = new Octokit();

const path = "src/styles";
const { data } = await octkit.rest.repos.getContent({ owner, repo, ref, path });

if (!Array.isArray(data)) {
  throw Error(
    `https://github.com/${owner}/${repo}/tree/${ref}/${path} must have multiple files`,
  );
}

const { data: base16 } = await octkit.rest.repos.getContent({
  owner,
  repo,
  ref,
  path: `${path}/base16`,
});
if (!Array.isArray(base16)) {
  throw Error(
    `https://github.com/${owner}/${repo}/tree/${ref}/${path}/base16 must have multiple files`,
  );
}

const themeMap: Record<string, string> = {};
for await (
  const filename of pooledMap(
    4,
    [...data, ...base16],
    async (file) => {
      if (file.type !== "file") return;
      if (!file.name.endsWith(".css")) return;
      if (!file.download_url) return;

      const key = file.name.slice(0, -4);
      if (Object.hasOwn(themeMap, key)) return;

      const res = await fetch(file.download_url);
      const content = await res.text();
      themeMap[key] = content;

      return file.name;
    },
  )
) {
  if (!filename) continue;
  console.log(`Download ${filename}`);
}

await Deno.writeTextFile(
  new URL("./src/theme.json", import.meta.url),
  JSON.stringify(themeMap),
);
