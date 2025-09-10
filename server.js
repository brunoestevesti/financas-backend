import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";

dotenv.config();

const {
  GITHUB_TOKEN,
  GITHUB_OWNER = "brunoestevesti",
  GITHUB_REPO = "brunoestevesti.github.io",
  GITHUB_BRANCH = "main",
  API_KEY,
  CORS_ORIGIN = "https://brunoestevesti.github.io",
  PORT = 3000
} = process.env;

if (!GITHUB_TOKEN || !API_KEY) {
  console.error("❌ Defina GITHUB_TOKEN e API_KEY nas variáveis de ambiente.");
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"]
  })
);

const octokit = new Octokit({ auth: GITHUB_TOKEN });

function requireApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

async function getFileSha(path) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      ref: GITHUB_BRANCH
    });
    if (Array.isArray(data)) return null;
    return data.sha || null;
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

app.get("/load/:username", requireApiKey, async (req, res) => {
  const username = (req.params.username || "").trim();
  if (!username) return res.status(400).json({ error: "username required" });

  const path = `data/users/${username}.json`;

  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      ref: GITHUB_BRANCH
    });

    if (Array.isArray(data)) {
      return res.status(404).json({ error: "unexpected directory" });
    }

    const content = Buffer.from(data.content, "base64").toString("utf8");
    const json = JSON.parse(content);
    return res.json({ ok: true, data: json, sha: data.sha });
  } catch (err) {
    if (err.status === 404) {
      return res.json({ ok: true, data: null });
    }
    console.error(err);
    return res.status(500).json({ error: "failed_to_load" });
  }
});

app.post("/save", requireApiKey, async (req, res) => {
  const { username, userData } = req.body || {};
  if (!username || typeof userData !== "object") {
    return res.status(400).json({ error: "username and userData required" });
  }

  const path = `data/users/${username}.json`;
  const message = `chore: update data for ${username}`;

  try {
    const sha = await getFileSha(path);

    const contentBase64 = Buffer.from(JSON.stringify(userData, null, 2)).toString("base64");

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      message,
      content: contentBase64,
      sha: sha || undefined,
      branch: GITHUB_BRANCH
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed_to_save" });
  }
});

app.get("/", (req, res) => {
  res.send("OK - Finanças backend");
});

app.listen(PORT, () => {
  console.log(`✅ Backend rodando na porta ${PORT}`);
});
