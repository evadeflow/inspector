// Patches @open-rpc/logs-react after `npm install`: its Filter panel and its "add new filter"
// dialog list method names in the order they first appeared in the log. This sorts them
// alphabetically instead. It is idempotent, and it fails the install loudly if the package no
// longer contains the code it patches (for example after an upgrade past 1.2.0).
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "node_modules", "@open-rpc", "logs-react", "package",
  "components", "methodList", "methodList.js");
const original = "    return methods;\n};\nvar MethodList";
const patched = "    // Patched by scripts/patch-logs-react.js: sort alphabetically, not by first appearance.\n"
  + "    return methods.sort(function (a, b) { return String(a[0]).localeCompare(String(b[0])); });\n};\nvar MethodList";

const source = fs.readFileSync(file, "utf8");
if (source.includes(patched)) {
  console.log("logs-react filter sort: already patched");
} else if (source.includes(original)) {
  fs.writeFileSync(file, source.replace(original, patched));
  console.log("logs-react filter sort: patched " + path.relative(process.cwd(), file));
} else {
  console.error("logs-react filter sort: " + file + " has changed; update scripts/patch-logs-react.js");
  process.exit(1);
}
