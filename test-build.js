const cp = require("child_process");
const fs = require("fs");
try {
  const result = cp.execSync("npm run build");
  fs.writeFileSync("build-output.txt", result.toString());
} catch (e) {
  let out = "BUILD FAILED:\n";
  if (e.stdout) out += e.stdout.toString() + "\n";
  if (e.stderr) out += e.stderr.toString() + "\n";
  fs.writeFileSync("build-output.txt", out);
}
