import { serve } from "./deps_dev.ts";
import handle from "./api/main.ts";

await serve(async (req) => {
  return (await handle(req))!;
}, { port: 8080 });
