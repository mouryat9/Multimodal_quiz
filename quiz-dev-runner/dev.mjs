import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import fs from "node:fs";
import kill from "tree-kill";

const ROOT = path.resolve(process.cwd(), "..");
const UI_DIR = path.join(ROOT, "quiz-video-ui");
const BACKEND_DIR = path.join(ROOT, "quiz-video-backend");

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

// Toggle dev behavior: DEV=1 npm run dev
const IS_DEV = process.env.DEV === "1";

// --- venv detection ---
const candidateVenvs = ["venv312", ".venv312", "venv", ".venv"];
const venvName =
  process.env.VENV_NAME ||
  candidateVenvs.find((v) => fs.existsSync(path.join(BACKEND_DIR, v)));

if (!venvName) {
  console.error(
    `No virtualenv found in ${BACKEND_DIR}. Tried: ${candidateVenvs.join(", ")}`
  );
  process.exit(1);
}

const pythonPath =
  process.platform === "win32"
    ? path.join(BACKEND_DIR, venvName, "Scripts", "python.exe")
    : path.join(BACKEND_DIR, venvName, "bin", "python");

// --- environment defaults ---
const API_PORT = process.env.API_PORT || "8000";
const UI_PORT = process.env.UI_PORT || "3000";

// If Ollama runs on same machine outside Docker, this works locally.
// On Ubuntu + Docker, you'd use http://ollama:11434 (compose) or host networking.
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

function runProc(name, cmd, args, cwd, extraEnv = {}) {
  const isWin = process.platform === "win32";

  const env = { ...process.env, ...extraEnv };

  const child = isWin
    ? spawn(`${cmd} ${args.join(" ")}`, { cwd, stdio: "inherit", env, shell: true })
    : spawn(cmd, args, { cwd, stdio: "inherit", env });

  child.on("exit", (code) => console.log(`\n[${name}] exited with code ${code}`));
  child.on("error", (err) => console.error(`\n[${name}] failed to start:`, err));

  return child;
}

console.log("Starting backend + frontend...");
console.log("Detected venv:", venvName);
console.log("Backend python:", pythonPath);
console.log("Frontend npm:", npmCmd);
console.log("DEV mode:", IS_DEV ? "ON" : "OFF");
console.log("");

const backendArgs = IS_DEV
  ? ["-m", "uvicorn", "app.main:app", "--reload", "--port", API_PORT, "--host", "0.0.0.0"]
  : ["-m", "uvicorn", "app.main:app", "--port", API_PORT, "--host", "0.0.0.0"];

const backend = runProc(
  "backend",
  pythonPath,
  backendArgs,
  BACKEND_DIR,
  {
    OLLAMA_URL,
    OLLAMA_MODEL
  }
);

const frontend = runProc(
  "frontend",
  npmCmd,
  ["run", "dev", "--", "-p", UI_PORT],
  UI_DIR,
  {
    NEXT_PUBLIC_API_BASE: `http://localhost:${API_PORT}/api`
  }
);

function shutdown() {
  console.log("\nShutting down...");
  if (frontend?.pid) kill(frontend.pid);
  if (backend?.pid) kill(backend.pid);
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
