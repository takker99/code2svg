export { serve } from "https://deno.land/std@0.179.0/http/server.ts";
export { pooledMap } from "https://deno.land/std@0.179.0/async/pool.ts";
import { Octokit as OctokitCore } from "https://cdn.skypack.dev/@octokit/core@4.2.0?dts";
import { restEndpointMethods } from "https://cdn.skypack.dev/@octokit/plugin-rest-endpoint-methods@7.0.1?dts";

export const Octokit = OctokitCore.plugin(restEndpointMethods);
