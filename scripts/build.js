const esbuild = require("esbuild");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const watch = process.argv.includes("--watch");
const root = path.join(__dirname, "..");
const distDir = path.join(root, "xModal");

const common = {
  entryPoints: [path.join(root, "index.ts")],
  bundle: true,
  target: "es2018",
  sourcemap: true,
};

// <script src="xModal.js">: expõe o global xModal
const iifeOptions = {
  ...common,
  format: "iife",
  globalName: "xModal",
  outfile: path.join(distDir, "xModal.js"),
  footer: {
    js: "if (xModal && xModal.default) { xModal = xModal.default; }",
  },
};

// import xModal from "xmodalv2": usado pelos projetos que instalam o pacote
const esmOptions = {
  ...common,
  format: "esm",
  outfile: path.join(distDir, "xModal.mjs"),
};

const allOptions = [iifeOptions, esmOptions];

function copyAssets() {
  fs.mkdirSync(path.join(distDir, "images"), { recursive: true });
  fs.copyFileSync(path.join(root, "index.css"), path.join(distDir, "index.css"));
  // imagens usadas pelo index.css (url(images/...))
  for (const img of ["xModal-bg-content.png", "xModal-bg-modal.png"]) {
    fs.copyFileSync(path.join(root, "images", img), path.join(distDir, "images", img));
  }
}

function buildTypes() {
  const tsc = path.join(root, "node_modules", ".bin", "tsc");
  execFileSync(tsc, ["-p", path.join(root, "tsconfig.build.json")], { stdio: "inherit" });
}

async function run() {
  copyAssets();
  buildTypes();

  if (watch) {
    for (const options of allOptions) {
      const ctx = await esbuild.context(options);
      await ctx.watch();
    }
    console.log("xModal: watch em xModal/xModal.js e xModal/xModal.mjs");
    return;
  }

  await Promise.all(allOptions.map((options) => esbuild.build(options)));
  console.log(
    "xModal: build concluído → xModal/xModal.js, xModal/xModal.mjs, xModal/index.css, xModal/index.d.ts",
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
