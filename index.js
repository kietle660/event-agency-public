const { spawn } = require("child_process");

const port = process.env.PORT || process.env.APP_PORT || 3000;

const child = spawn("npx", ["next", "start", "-p", String(port)], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
