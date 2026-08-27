const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const test = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const LOCAL_DS_STORE = "docs/superpowers/.DS_Store";
const REQUIRED_IGNORES = [
    "docs/superpowers/",
    ".DS_Store",
    ".playwright-cli/",
    "output/",
    "node_modules/"
];
const PRIVATE_MARKERS = [
    ["", "Users", ""].join("/"),
    ["", "var", "folders", ""].join("/"),
    "codex" + "-clipboard"
];

function gitLines(...args) {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" })
        .split("\n")
        .filter(Boolean);
}

test("internal planning files and local artifacts stay outside the public Git tree", () => {
    const trackedFiles = gitLines("ls-files");
    const ignoreSource = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf8");

    assert.equal(trackedFiles.some((file) => file.startsWith("docs/superpowers/")), false);
    REQUIRED_IGNORES.forEach((pattern) => {
        assert.match(ignoreSource, new RegExp(`^${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"));
    });
    assert.doesNotThrow(() => {
        execFileSync("git", ["check-ignore", "--quiet", LOCAL_DS_STORE], { cwd: ROOT });
    });
});

test("tracked public content contains no private workstation path markers", () => {
    gitLines("ls-files").forEach((file) => {
        const absolutePath = path.join(ROOT, file);
        if (!fs.statSync(absolutePath).isFile()) {
            return;
        }

        const content = fs.readFileSync(absolutePath);
        PRIVATE_MARKERS.forEach((marker) => {
            assert.equal(content.includes(Buffer.from(marker)), false, `${file} contains a private path marker`);
        });
    });
});

test("Pages and Validate workflows pin every action to an immutable commit", () => {
    for (const workflow of ["pages.yml", "validate.yml"]) {
        const source = fs.readFileSync(path.join(ROOT, ".github/workflows", workflow), "utf8");
        const usesLines = source.split("\n").filter((line) => /^\s*-?\s*uses:/.test(line));

        assert.ok(usesLines.length > 0, `${workflow} must use at least one action`);
        usesLines.forEach((line) => {
            assert.match(
                line,
                /^\s*-?\s*uses:\s*[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+@[0-9a-f]{40}\s+#\s+v\d+(?:\.\d+(?:\.\d+)?)?\s*$/,
                `${workflow} contains a mutable or undocumented action ref: ${line.trim()}`
            );
        });
    }
});

test("CODEOWNERS assigns default and sensitive-tree ownership to the maintainer", () => {
    const codeownersPath = path.join(ROOT, ".github/CODEOWNERS");

    assert.equal(fs.existsSync(codeownersPath), true, ".github/CODEOWNERS must exist");
    const source = fs.readFileSync(codeownersPath, "utf8");
    const rules = new Map(source
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => line.split(/\s+/)));

    for (const pattern of ["*", "/js/data.js", "/.github/workflows/", "/SECURITY.md"]) {
        assert.equal(rules.get(pattern), "@siliang42", `${pattern} must be owned by @siliang42`);
    }
});

test("browser validation is an exact development-only dependency and runs in CI", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
    const workflow = fs.readFileSync(path.join(ROOT, ".github/workflows/validate.yml"), "utf8");
    const readme = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
    const readmeZh = fs.readFileSync(path.join(ROOT, "README.zh-CN.md"), "utf8");
    const quickStart = readme.match(/## Quick Start[\s\S]*?(?=\n## )/)?.[0] || "";
    const installIndex = workflow.indexOf("npx playwright install --with-deps chromium");
    const browserIndex = workflow.indexOf("npm run test:browser");

    assert.deepEqual(packageJson.dependencies || {}, {});
    assert.deepEqual(Object.keys(packageJson.devDependencies || {}), ["playwright"]);
    assert.match(packageJson.devDependencies.playwright, /^\d+\.\d+\.\d+$/);
    assert.equal(packageJson.scripts["test:browser"], "node --test browser/calendar-regression.mjs");
    assert.ok(workflow.includes("npm ci"), "CI must install the lockfile exactly");
    assert.ok(installIndex >= 0, "CI must install Chromium");
    assert.ok(browserIndex > installIndex, "CI must run the browser check after installing Chromium");
    for (const document of [readme, readmeZh]) {
        assert.match(document, /npm ci/);
        assert.match(document, /npx playwright install chromium/);
        assert.match(document, /npm run test:browser/);
        assert.match(document, /browser\/calendar-regression\.mjs/);
    }
    assert.match(quickStart, /open index\.html/);
    assert.match(quickStart, /No package installation is required to run the application\./);
});
