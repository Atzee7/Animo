#!/usr/bin/env node
/**
 * Jalankan tunnel ngrok ke dev server Next.js.
 *
 * Domain statis opsional, dibaca berurutan dari:
 *   1. argumen CLI   -> npm run tunnel -- xxxx.ngrok-free.app
 *   2. env           -> NGROK_DOMAIN
 *   3. .env.local    -> NGROK_DOMAIN=xxxx.ngrok-free.app
 *
 * Tanpa domain, ngrok memakai URL acak yang berubah tiap restart.
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const port = process.env.PORT ?? "3000";

function readEnvLocal(key) {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) return undefined;

  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!match || match[1] !== key) continue;

    const value = match[2].replace(/^["']|["']$/g, "").trim();
    return value || undefined;
  }

  return undefined;
}

const domain = process.argv[2] ?? process.env.NGROK_DOMAIN ?? readEnvLocal("NGROK_DOMAIN");

const args = ["http"];
if (domain) args.push(`--url=${domain}`);
args.push(port);

console.log(
  `ngrok -> http://localhost:${port}` +
    (domain ? ` (domain: ${domain})` : " (URL acak, berubah tiap restart)"),
);

const child = spawn("ngrok", args, {
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error("Gagal menjalankan ngrok:", error.message);
  process.exit(1);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code) => process.exit(code ?? 0));
