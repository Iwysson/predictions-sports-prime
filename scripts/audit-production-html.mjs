import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["scripts/audit-technical-seo.mjs"], {
  stdio: "inherit",
});

if (result.status !== 0) process.exit(result.status ?? 1);

console.log("Production HTML audit: PASS");
