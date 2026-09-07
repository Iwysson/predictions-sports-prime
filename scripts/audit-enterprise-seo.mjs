import { spawnSync } from "node:child_process";

const audits = [
  "audit:seo",
  "audit:adsense-quality",
  "audit:adsense-content-gate",
  "audit:duplicate-seo",
  "audit:prediction-first-search-intent",
  "audit:technical-seo",
  "audit:international-seo",
  "audit:structured-data",
  "audit:prediction-integrity",
  "fixtures:validate",
  "audit:fixtures",
  "audit:data-integrity",
  "audit:text-encoding",
];

const npmCli = process.env.npm_execpath;
const failures = [];

for (const audit of audits) {
  console.log(`\n=== ${audit} ===`);
  const result = npmCli
    ? spawnSync(process.execPath, [npmCli, "run", audit], {
        cwd: process.cwd(),
        env: process.env,
        encoding: "utf8",
        stdio: "inherit",
      })
    : spawnSync("npm", ["run", audit], {
    cwd: process.cwd(),
    env: process.env,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.status !== 0) {
    if (result.error) console.error(`${audit}: ${result.error.message}`);
    failures.push({ audit, exitCode: result.status ?? 1 });
  }
}

console.log(`\nEnterprise SEO audit: ${audits.length - failures.length}/${audits.length} passed.`);
if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure.audit} (exit ${failure.exitCode})`);
  process.exit(1);
}
