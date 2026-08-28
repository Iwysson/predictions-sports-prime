import { spawnSync } from "node:child_process";

const commands = [
  "audit:content", "audit:editorial-quality", "audit:content-similarity",
  "audit:prediction-integrity", "audit:prediction-history", "audit:results",
  "audit:seo", "audit:search-intent-seo", "audit:technical-seo", "audit:international-seo", "audit:structured-data",
  "audit:sports-event-location", "audit:adsense-quality", "audit:duplicate-seo",
];
const failed = [];
for (const command of commands) {
  console.log(`\n=== ${command} ===`);
  const executable = process.platform === "win32" ? "cmd.exe" : "npm";
  const args = process.platform === "win32"
    ? ["/d", "/s", "/c", `npm.cmd run ${command}`]
    : ["run", command];
  const result = spawnSync(executable, args, { cwd: process.cwd(), stdio: "inherit", shell: false });
  if (result.status !== 0) failed.push(command);
}
if (failed.length) {
  console.error(`\nSite quality audit failed: ${failed.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(`\nSite quality audit: PASS (${commands.length} gates)`);
}
