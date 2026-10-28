import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const bucket = process.env.R2_BUCKET || "nicolas-paschoal-cinema";
const wrangler = process.platform === "win32" ? "npx.cmd" : "npx";
const put = (key, file, type) => execFileSync(wrangler, ["wrangler", "r2", "object", "put", `${bucket}/${key}`, `--file=${file}`, `--content-type=${type}`], { stdio: "inherit" });

put("cms/state.json", "content/initial-state.json", "application/json");
for (const file of readdirSync("content/media")) {
  const type = file.endsWith(".jpg") ? "image/jpeg" : file.endsWith(".png") ? "image/png" : "application/octet-stream";
  put(`media/${file}`, join("content/media", file), type);
}
