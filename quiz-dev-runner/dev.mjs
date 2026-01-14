import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import kill from "tree-kill";

const ROOT = path.resolve(process.cwd(), "..");
const UI_DIR = path.join(ROOT, "quiz-video-ui");
const BACKEND_DIR = path.join(ROOT, "quiz-video-backend");

// Set this to your backend venv folder name
const VENV_NAME = ".venv312";

// Cross-platform python path inside venv
const pythonPath =
  process.platform === "win32"
    ? path.join(BACKEND_DIR, VENV_NAME, "Scripts", "python.exe")
    : path.join(BACKEND_DIR, VENV_NAME, "bin", "python");

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

function runProc(name, cmd, args, cwd) {
  const isWin = process.platform === "win32";

  // On Windows, run through a shell so paths/args are handled reliably.
  // On *nix, spawn normally.
  const child = isWin
    ? spawn(`${cmd} ${args.join(" ")}`, {
        cwd,
        stdio: "inherit",
        env: { ...process.env },
        shell: true
      })
    : spawn(cmd, args, {
        cwd,
        stdio: "inherit",
        env: { ...process.env }
      });

  child.on("exit", (code) => console.log(`\n[${name}] exited with code ${code}`));
  child.on("error", (err) => console.error(`\n[${name}] failed to start:`, err));

  return child;
}

console.log("Starting backend + frontend...");
console.log("Backend python:", pythonPath);
console.log("Frontend npm:", npmCmd);
console.log("");

const backend = runProc(
  "backend",
  pythonPath,
  ["-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"],
  BACKEND_DIR
);

const frontend = runProc(
  "frontend",
  npmCmd,
  ["run", "dev", "--", "-p", "3000"],
  UI_DIR
);

function shutdown() {
  console.log("\nShutting down...");
  if (frontend?.pid) kill(frontend.pid);
  if (backend?.pid) kill(backend.pid);
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
