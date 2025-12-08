import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import AdmZip from "adm-zip";

const REGISTRY_URL =
  "https://celsus-cloud.ckwebgamingstudios.pages.dev/functions/api/plugins.json";

async function installPlugin(pluginName) {
  // Special case: developer template
  if (pluginName === "dev") {
    const targetPath = process.argv[3];
    if (!targetPath) {
      console.error("⚙️ Usage: celsus install dev <target-folder>");
      process.exit(1);
    }

    const templateDir = path.join(
      process.cwd(),
      "cli_installer",
      "templates",
      "dev_plugin"
    );
    const outputDir = path.resolve(targetPath);

    if (!fs.existsSync(templateDir)) {
      console.error("❌ Dev template not found in templates/dev_plugin/");
      process.exit(1);
    }

    // Copy template folder
    fs.mkdirSync(outputDir, { recursive: true });
    fs.cpSync(templateDir, outputDir, { recursive: true });

    console.log(`✅ Dev template created successfully at: ${outputDir}`);
    console.log("🧩 You can now build your own plugin inside this folder!");
    return;
  }

  // =============== Normal plugin install logic =================
  console.log(`🔍 Searching for plugin "${pluginName}"...`);

  const res = await fetch(REGISTRY_URL);
  const registry = await res.json();
  const plugin = registry.plugins.find(
    (p) => p.id.toLowerCase() === pluginName.toLowerCase()
  );

  if (!plugin) {
    console.error(`❌ Plugin "${pluginName}" not found in registry.`);
    return;
  }

  console.log(`⬇️  Downloading ${plugin.name} v${plugin.version}...`);
  const zipResponse = await fetch(plugin.url);
  if (!zipResponse.ok)
    throw new Error("Download failed: " + zipResponse.statusText);

  const arrayBuffer = await zipResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const celsusDir = path.join(process.cwd(), "Celsus_modules");
  const pluginDir = path.join(celsusDir, plugin.name);

  fs.mkdirSync(celsusDir, { recursive: true });

  const tempZip = path.join(celsusDir, `${plugin.name}.zip`);
  fs.writeFileSync(tempZip, buffer);

  console.log("📦 Extracting to Celsus_modules...");
  try {
    const zip = new AdmZip(tempZip);
    zip.extractAllTo(pluginDir, true);
  } catch (e) {
    console.error("❌ Installer error: invalid zip file:", e.message);
    return;
  }

  // Merge public/src if exists
  const publicFolder = path.join(pluginDir, "public");
  const srcFolder = path.join(pluginDir, "src");

  if (fs.existsSync(publicFolder)) {
    console.log("📁 Merging /public...");
    fs.cpSync(publicFolder, path.join(process.cwd(), "public"), {
      recursive: true,
    });
  }

  if (fs.existsSync(srcFolder)) {
    console.log("📁 Merging /src...");
    fs.cpSync(srcFolder, path.join(process.cwd(), "src"), { recursive: true });
  }

  // Update local registry
  const localRegistryPath = path.join(celsusDir, "registry.json");
  let localRegistry = [];

  if (fs.existsSync(localRegistryPath)) {
    try {
      localRegistry = JSON.parse(fs.readFileSync(localRegistryPath, "utf-8"));
    } catch {
      localRegistry = [];
    }
  }

  const existingIndex = localRegistry.findIndex((p) => p.id === plugin.id);
  if (existingIndex >= 0) localRegistry.splice(existingIndex, 1);
  localRegistry.push({
    id: plugin.id,
    version: plugin.version,
    installedAt: new Date().toISOString(),
  });

  fs.writeFileSync(localRegistryPath, JSON.stringify(localRegistry, null, 2));

  fs.unlinkSync(tempZip);
  console.log(`✅ Installed ${plugin.name} v${plugin.version} successfully!`);
  console.log(`📂 Location: ${pluginDir}`);
}

const pluginName = process.argv[2];
if (!pluginName) {
  console.log("⚙️ Usage: celsus install <plugin-name>");
  process.exit(1);
}

installPlugin(pluginName).catch((err) =>
  console.error("❌ Installer failed:", err)
);
