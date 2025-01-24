import { writeFileSync, readFileSync } from "fs";

const packageConfig = JSON.parse(readFileSync("package.json", "utf-8"));

const buildInfo = {
    buildTime: Date.now(),
    ver: packageConfig.version,
};

const outputPath = "dist/latestVersion.json";

writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

console.log(`Build information generated at: ${outputPath}`);
